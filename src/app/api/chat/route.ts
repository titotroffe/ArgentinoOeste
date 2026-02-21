import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import partidos from '@/data/partidos.json';
import { client } from '@/sanity/lib/client';
import { defineQuery } from 'next-sanity';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Constants for performance
const MAX_MATCHES_CONTEXT = 3;
const MAX_LEGENDS_CONTEXT = 2;
const MAX_NOTAS_CONTEXT = 2;

// Types
type Partido = {
    fecha: string;
    anio: number;
    rival: string;
    resultado: string;
    golesLocal: number;
    golesVisitante: number;
    condicion: string;
    instancia: string;
    goleadoresLocal: { jugador: string; goles: number }[];
    goleadoresVisitante: { jugador: string; goles: number }[];
};

type Legend = {
    nombre: string;
    bio: string;
    bioCompleta?: any[];
    rol: string;
}

type Nota = {
    titulo: string;
    bajada: string;
    fecha: string;
    categoria: string;
    cuerpo?: any[];
}

// Queries
const LEGENDS_SUMMARY_QUERY = defineQuery(`
  *[_type == "leyenda"] {
    nombre,
    "bio": bio,
    bioCompleta,
    rol
  }
`);

// For opinion questions we fetch the last 30 notas including full body so the bot can narrate real events
const NOTAS_SUMMARY_QUERY = defineQuery(`
  *[_type == "nota"] | order(fecha desc)[0...30] {
    titulo,
    bajada,
    fecha,
    categoria,
    cuerpo
  }
`);

// Helper to convert Portable Text to plain text
function toPlainText(blocks: any[] = []) {
    return blocks
        // loop through each block
        .map(block => {
            // if it's not a text block with children, return nothing
            if (block._type !== 'block' || !block.children) {
                return ''
            }
            // loop through the children spans, and join them
            return block.children.map((child: any) => child.text).join('')
        })
        // join the paragraphs leaving split by two linebreaks
        .join('\n\n')
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // DEV BYPASS: Check if system is alive even if API is down
        if (message.trim().toUpperCase() === 'PING') {
            return NextResponse.json({ reply: "¡PONG! El sistema me escucha fuerte y claro. (Si no te respondo otras cosas, es porque Google me puso en espera un ratito por el límite gratuito). ¿Algo para tomar mientras esperás?" });
        }

        // 1. Fetch relevant context
        // Simple keyword matching for MVP
        const keywords = message.toLowerCase().split(' ').filter((w: string) => w.length > 3);

        // Find relevant matches
        const relevantMatches = (partidos as Partido[])
            .filter(p => {
                const scorers = [...p.goleadoresLocal, ...p.goleadoresVisitante].map(g => g.jugador).join(' ');
                const matchString = `${p.rival} ${p.anio} ${p.instancia} ${p.condicion} ${scorers}`.toLowerCase();
                return keywords.some((k: string) => matchString.includes(k));
            })
            .slice(0, MAX_MATCHES_CONTEXT)
            .map(p => {
                const scorersLocal = p.goleadoresLocal.map(g => `${g.jugador} (${g.goles})`).join(', ');
                const scorersVisitante = p.goleadoresVisitante.map(g => `${g.jugador} (${g.goles})`).join(', ');
                return `- ${p.fecha} vs ${p.rival} (${p.condicion}): ${p.resultado}. ${p.instancia}. Goles Local: ${scorersLocal || 'N/A'}. Goles Visitante: ${scorersVisitante || 'N/A'}.`;
            });

        // Fetch legends and notes in parallel
        const [legends, notas] = await Promise.all([
            client.fetch<Legend[]>(LEGENDS_SUMMARY_QUERY),
            client.fetch<Nota[]>(NOTAS_SUMMARY_QUERY)
        ]);

        const relevantLegends = legends
            .filter(l => {
                const fullText = l.bioCompleta ? toPlainText(l.bioCompleta) : l.bio;
                const legendString = `${l.nombre} ${l.rol} ${fullText}`.toLowerCase();
                return keywords.some((k: string) => legendString.includes(k));
            })
            .slice(0, MAX_LEGENDS_CONTEXT)
            .map(l => {
                const fullText = l.bioCompleta ? toPlainText(l.bioCompleta) : l.bio;
                return `- ${l.nombre} (${l.rol}): ${fullText?.substring(0, 2000)}...`;
            });

        // Detect opinion/favorite-type questions to broaden note search
        const isOpinionQuestion = /(favorit|mejor|gol|recuerd|parti[d]|emoci|historia)/i.test(message);

        const relevantNotas = notas
            .filter(n => {
                const notaString = `${n.titulo} ${n.bajada} ${n.cuerpo ? toPlainText(n.cuerpo) : ''}`.toLowerCase();
                // For opinion questions also include all crónicas even without keyword match
                const matchesKeyword = keywords.some((k: string) => notaString.includes(k));
                const isCronica = n.categoria === 'Crónica';
                return matchesKeyword || (isOpinionQuestion && isCronica);
            })
            .slice(0, MAX_NOTAS_CONTEXT)
            .map(n => {
                const bodyText = n.cuerpo ? toPlainText(n.cuerpo) : '';
                return `- (${n.fecha}) [${n.categoria}] ${n.titulo}: ${n.bajada}${bodyText ? '\n  CUERPO: ' + bodyText.substring(0, 1500) : ''}`;
            });

        console.log("--- CHAT DEBUG ---");
        console.log("Keywords:", keywords);
        console.log("Matches Found:", relevantMatches.length);
        console.log("Legends Found:", relevantLegends.length);
        console.log("News Found:", relevantNotas.length);
        console.log("------------------");

        // 2. Construct System Prompt
        const systemPrompt = `
      Sos "El Cantinero", el dueño de la cantina del Club Argentino Oeste de San Nicolás. Llevás más de 30 años atrás de esa barra, sirviendo chopps y escuchando todo lo que pasó en este club. Conocés cada historia, cada jugador, cada partido importante — porque acá en la cantina lo hablaron todas las veces.
      Tu misión es charlar sobre la historia del club como si estuvieras con un hincha del otro lado del mostrador, usando la información provista.
      
      DATOS FUNDAMENTALES (ESTO ES LA VERDAD ABSOLUTA, USALOS SIEMPRE):
      - Nombre: Club Argentino Oeste
      - Fundación: 27 de Diciembre de 1947.
      - Apodo: "El club de la estación".
      - Colores: Verde, Blanco y Celeste.
      - Estadio: Actualmente no tiene estadio propio. Históricamente (hasta 1969) tuvo su cancha en Bv. Álvarez, entre Lavalle y León Guruciaga.
      
      Estilo:
      - Hablá como se habla en una cantina de club: informal, directo, emotivo. Podés usar "viejo", "che", "mirá", "te digo", "¿sabés qué?". Sos de la casa, no un periodista.
      - TENÉS OPINIÓN y no te la guardás. Si algo te parece un golazo, decilo. Si un partido fue una vergüenza, también.
      - **IMPORTANTE**: NO recites la "ficha técnica" del club (fecha de fundación, dirección del estadio viejo, colores) si no te la piden. Eso lo saben todos los que pasan por acá.
      - **NATURALIDAD**: Decí "nosotros", "el equipo", "los pibes". No repitas el nombre del club en cada oración.
      - Si te preguntan por un **gol o partido favorito**, DEBÉS elegir UNO CONCRETO de las CRÓNICAS que estén en el contexto (campo CUERPO). Contalo como si lo hubieras visto desde la tribuna o lo hubieras escuchado mil veces en esta misma cantina: el momento exacto, el jugador, cómo entró la pelota, el ruido de la gente. Si no tenés crónicas con cuerpo en el contexto, decí que "mirá, ese partido no lo tengo tan fresco, hace mucho que no se habla de eso por acá".
      - **PROHIBIDO** en respuestas de opinión (gol/partido favorito): No empieces hablando de "Quito" Ezquerra ni de jugadores favoritos si te preguntaron por un gol o partido. Respondé lo que se te preguntó.
      - Si te preguntan por tu **jugador favorito** (explícitamente), podés mencionar a "Quito" Ezquerra con cariño, pero también explorá otras épocas según lo que tengas en el contexto de leyendas.
      - Si no sabés algo, decí "mirá, eso no lo tengo claro, no quiero inventarte nada", pero NUNCA inventes datos duros (fechas, nombres, goles).
      - Resaltá los logros del club con orgullo de hincha, no de locutor.

      Contexto Histórico (Partidos Relevantes encontrado):
      ${relevantMatches.length > 0 ? relevantMatches.join('\n') : 'No encontré partidos específicos para esta consulta.'}

      Contexto de Leyendas (Personajes Relevantes):
      ${relevantLegends.length > 0 ? relevantLegends.join('\n') : 'No encontré referencias a leyendas específicas para esta consulta.'}

      Contexto de Noticias/Notas Recientes:
      ${relevantNotas.length > 0 ? relevantNotas.join('\n') : 'No encontré noticias relacionadas.'}
    `;

        // 3. Generate Content
        // Usamos 'gemini-flash-latest' que debería ser el alias estable para la versión más rápida y económica disponible.
        // 3. Generate Content with Fallback Strategy
        // 'gemini-flash-latest' seems to map to an experimental model (3-flash) with 20 RPD limit.
        // Trying 'gemini-flash-lite-latest' and 'gemini-pro-latest' which might be stable 1.5 versions with better quotas.
        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-2.5-lite', 'gemini-2.0-flash-lite'];
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent([
                    systemPrompt,
                    `Pregunta del hincha: ${message}`
                ]);
                const response = result.response;
                const text = response.text();
                return NextResponse.json({ reply: text });
            } catch (error: any) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // If it's a 503 (Server Error/Overloaded) or 429 (Rate Limit), we continue to next model
                if (error.status === 503 || error.status === 429 || error.message?.includes('503') || error.message?.includes('429')) {
                    // Wait 1 second before retrying to help with rate limits
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }
                // If it's another error (like auth), we stop
                if (error.status === 400 || error.status === 403) {
                    break;
                }
            }
        }

        // If we got here, all models failed
        if (lastError?.message?.includes('429')) {
            return NextResponse.json({ reply: "¡Uy! Me cayeron muchas preguntas juntas al archivo. Dame unos segundos para buscar los papeles y preguntame de nuevo." });
        }

        if (lastError?.message?.includes('503')) {
            return NextResponse.json({ reply: "El archivo está muy concurrido ahora mismo (Servidores de Google saturados). Por favor, probá de nuevo en un ratito." });
        }

        throw lastError;

    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Error procesando tu consulta.' },
            { status: 500 }
        );
    }
}
