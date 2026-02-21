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
    slug?: string;
    cuerpo?: any[];
    detallesPartido?: {
        local?: { nombre: string };
        visitante?: { nombre: string };
    };
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
    "slug": slug.current,
    cuerpo
  }
`);

// Helper to parse Spanish date strings like "20 de Abril de 1958" into a sortable timestamp
// Helper to normalize strings (lowercase, remove accents/punctuation)
const normalize = (text: string) =>
    text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,!?]/g, "")
        .trim();

// Use this for more robust matching
const SPANISH_MONTHS: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
};

// Helper for fuzzy matching (Levenshtein distance)
function getLevenshteinDistance(a: string, b: string): number {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[a.length][b.length];
}

function parseFechaEspañola(fecha: string): number {
    if (!fecha) return 0;
    // ISO format: "1958-08-03" (used by Sanity date fields)
    const isoMatch = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3])).getTime();
    }
    // Spanish format: "3 de Agosto de 1958" (used by partidos.json)
    const partes = fecha.toLowerCase().match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/);
    if (!partes) return 0;
    const [, dia, mes, anio] = partes;
    const mesNum = SPANISH_MONTHS[mes] ?? 0;
    return new Date(Number(anio), mesNum, Number(dia)).getTime();
}

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
function getDayOfWeek(fecha: string): string {
    const ts = parseFechaEspañola(fecha);
    if (!ts) return '';
    return DIAS_SEMANA[new Date(ts).getDay()];
}

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
        const { message, history = [] } = await req.json();

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
        const lowerMessage = message.toLowerCase();

        // UNIQUE RIVALS for fuzzy-ish matching (handles typos like "emiloia")
        const ALL_RIVALS = [...new Set((partidos as Partido[]).map(p => p.rival))];

        // Keywords: keep words > 2 chars, but filter out common intent/control words
        const STOP_WORDS = new Set(['como', 'fue', 'acordas', 'tenes', 'partido', 'segundo', 'primer', 'tercer', 'cuarto', 'quinto', 'enfrentamiento', 'vez', 'frente', 'frentre']);
        const keywords = lowerMessage.split(/\s+/)
            .filter((w: string) => w.length > 2 && !STOP_WORDS.has(w.replace(/[.,!?]/g, '')));

        // Also extract keywords from history for follow-ups
        const historyKeywords = (history as { role: string; content: string }[])
            .slice(-3)
            .flatMap(m => m.content.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2 && !STOP_WORDS.has(w.replace(/[.,!?]/g, ''))));
        const allKeywords = [...new Set([...keywords, ...historyKeywords])];

        // --- ORDINAL DETECTION ---
        const ORDINALS: Record<string, number> = {
            primer: 0, primera: 0, primero: 0,
            segundo: 1, segunda: 1,
            tercer: 2, tercero: 2, tercera: 2,
            cuarto: 3, cuarta: 3,
            quinto: 4, quinta: 4,
            sexto: 5, sexta: 5,
        };
        const isPrimerPartido = /\bprimer(a|o)?\s+partido|\bprimer(a|o)?\s+vez|\bprimer\s+enfrentamiento/.test(lowerMessage);
        const isUltimoPartido = /\b[uú]ltim[ao]\s+partido|\b[uú]ltim[ao]\s+vez/.test(lowerMessage);
        let ordinalIndex: number | null = null;
        for (const [word, idx] of Object.entries(ORDINALS)) {
            if (new RegExp(`\\b${word}\\b`).test(lowerMessage)) { ordinalIndex = idx; break; }
        }
        if (isPrimerPartido) ordinalIndex = 0;

        // --- RIVAL EXTRACTION (current message, then history) ---
        const extractRival = (text: string): string | null => {
            const m = text.match(/(?:contra|ante|\bcon\b|\bvs\.?\b|\bfrente\s+a\b|\bfrentre\s+a\b|\bfrente\b|\benfrente\b)\s+([a-záéíóúüñ\s]+?)(?:\s+(?:que|el|en|un|los|la|del|de|el|fue|era|cuando|por|para)\b|\s*[.,!?]|\s*$)/i);
            if (!m) return null;
            const rawRival = m[1].trim().toLowerCase();
            const cleanRaw = normalize(rawRival);

            // Significant part: exclude articles and pick first meaningful word
            const significant = cleanRaw.replace(/^(la|el|los|las|san)\s+/i, '').split(' ')[0];
            if (significant.length < 3) return rawRival;

            // 1. Direct contains match among known rivals (using normalized strings)
            const directMatch = ALL_RIVALS.find(r => normalize(r).includes(significant) || significant.includes(normalize(r).replace(/^(la|el|los|las|san)\s+/i, '')));
            if (directMatch) return directMatch.toLowerCase();

            // 2. Fuzzy match (Levenshtein) if direct match fails
            let bestMatch = null;
            let minDistance = 3;

            for (const r of ALL_RIVALS) {
                const cleanR = normalize(r).replace(/^(la|el|los|las|san)\s+/i, '');
                const dist = getLevenshteinDistance(significant, cleanR.split(' ')[0]);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestMatch = r;
                }
            }
            return bestMatch ? bestMatch.toLowerCase() : rawRival;
        };
        let rivalQueryStr = extractRival(lowerMessage);

        // Follow-up: if no rival in current msg, look back
        if (!rivalQueryStr) {
            for (const msg of [...(history as { role: string; content: string }[])].reverse()) {
                const found = extractRival(msg.content.toLowerCase());
                if (found) {
                    rivalQueryStr = found;
                    process.stdout.write(`| Rival inferred: ${rivalQueryStr} |\n`);
                    break;
                }
            }
        }

        const rivalQueryWords = rivalQueryStr
            ? rivalQueryStr.split(/\s+/).filter((w: string) => w.length > 2 && !STOP_WORDS.has(w))
            : [];

        // --- MATCH FILTERING ---
        let matchedPartidos = (partidos as Partido[])
            .filter(p => {
                if (rivalQueryStr) {
                    const rivalStr = normalize(p.rival);
                    const q = normalize(rivalQueryStr);
                    // If we identified a specific known rival, use it
                    if (rivalStr.includes(q) || q.includes(rivalStr)) return true;
                    // Otherwise try significant words
                    return rivalQueryWords.some((w: string) => rivalStr.includes(normalize(w)));
                }
                if (allKeywords.length === 0) return false;
                const scorers = [...p.goleadoresLocal, ...p.goleadoresVisitante].map(g => g.jugador).join(' ');
                const matchString = normalize(`${p.rival} ${p.anio} ${p.instancia} ${p.condicion} ${scorers} ${p.fecha}`);
                return allKeywords.some((k: string) => matchString.includes(normalize(k)));
            });

        // Always sort chronologically
        matchedPartidos = matchedPartidos.sort((a, b) => parseFechaEspañola(a.fecha) - parseFechaEspañola(b.fecha));

        // --- SELECT THE Nth MATCH ---
        let selectedMatch: (typeof matchedPartidos)[0] | null = null;
        let contextSlice = matchedPartidos;
        if (ordinalIndex !== null && matchedPartidos.length > ordinalIndex) {
            selectedMatch = matchedPartidos[ordinalIndex];
            contextSlice = [selectedMatch];
        } else if (isUltimoPartido && matchedPartidos.length > 0) {
            selectedMatch = matchedPartidos[matchedPartidos.length - 1];
            contextSlice = [selectedMatch];
        } else {
            contextSlice = matchedPartidos.slice(0, MAX_MATCHES_CONTEXT);
        }

        const ORDINAL_LABELS = ['PRIMER', 'SEGUNDO', 'TERCER', 'CUARTO', 'QUINTO', 'SEXTO'];
        const relevantMatches = contextSlice.map((p, i) => {
            const scorersLocal = p.goleadoresLocal.map(g => `${g.jugador} (${g.goles})`).join(', ');
            const scorersVisitante = p.goleadoresVisitante.map(g => `${g.jugador} (${g.goles})`).join(', ');
            let label = '';
            if (p === selectedMatch && ordinalIndex !== null) {
                label = `[${ORDINAL_LABELS[ordinalIndex] ?? `#${ordinalIndex + 1}`} PARTIDO ENCONTRADO]`;
            } else if (p === selectedMatch && isUltimoPartido) {
                label = '[ÚLTIMO PARTIDO ENCONTRADO]';
            } else if (!selectedMatch) {
                label = `[PARTIDO #${i + 1}]`;
            }
            const diaSemana = getDayOfWeek(p.fecha);
            return `- ${label} ${diaSemana} ${p.fecha} vs ${p.rival} (${p.condicion}): ${p.resultado}. ${p.instancia}. Goles Local: ${scorersLocal || 'N/A'}. Goles Visitante: ${scorersVisitante || 'N/A'}.`;
        });

        // The anchor match drives chronicle date-correlation in the hemeroteca
        const anchorMatch = selectedMatch ?? (matchedPartidos.length > 0 ? matchedPartidos[0] : null);

        // --- FETCH LEGENDS AND DYNAMIC NOTES ---
        // If we have an anchor match, we do a targeted Sanity query for that date/rival
        let dynamicNotasQuery: any = NOTAS_SUMMARY_QUERY;
        let queryParams = {};

        if (anchorMatch) {
            const matchTs = parseFechaEspañola(anchorMatch.fecha);
            const startDate = new Date(matchTs - (1000 * 60 * 60 * 24)).toISOString().split('T')[0]; // -1 day
            const endDate = new Date(matchTs + (1000 * 60 * 60 * 24 * 10)).toISOString().split('T')[0]; // +10 days (weekly archives)

            // Find a significant word from the anchor match rival (e.g., "Paraná" from "Paraná")
            const rivalWords = anchorMatch.rival.split(' ');
            const significantRivalWord = rivalWords.find(w => w.length > 3) || rivalWords[0];
            const rivalSearchKey = normalize(significantRivalWord);

            dynamicNotasQuery = defineQuery(`
                *[_type == "nota" && fecha >= $startDate && fecha <= $endDate && (titulo match $rival || bajada match $rival || pt::text(cuerpo) match $rival || detallesPartido.local.nombre match $rival || detallesPartido.visitante.nombre match $rival || categoria == "Hemeroteca")] | order(fecha asc) [0..20] {
                    titulo,
                    bajada,
                    fecha,
                    categoria,
                    "slug": slug.current,
                    cuerpo,
                    detallesPartido {
                        local { nombre },
                        visitante { nombre }
                    }
                }
            `);
            queryParams = { startDate, endDate, rival: `${rivalSearchKey}*` };
            process.stdout.write(`| Sanity Query: ${startDate} to ${endDate} | Rival: ${rivalSearchKey} |\n`);
        }

        const [legends, notas] = await Promise.all([
            client.fetch<Legend[]>(LEGENDS_SUMMARY_QUERY),
            client.fetch<Nota[]>(dynamicNotasQuery, queryParams)
        ]);

        // If dynamic query found nothing and we were targeting a match, 
        // fallback to recent notes to have at least some context
        const finalNotas = (notas.length === 0 && anchorMatch)
            ? await client.fetch<Nota[]>(NOTAS_SUMMARY_QUERY)
            : notas;

        const relevantLegends = legends
            .filter(l => {
                const fullText = l.bioCompleta ? toPlainText(l.bioCompleta) : l.bio;
                const legendString = `${l.nombre} ${l.rol} ${fullText}`.toLowerCase();
                return allKeywords.some((k: string) => legendString.includes(k));
            })
            .slice(0, MAX_LEGENDS_CONTEXT)
            .map(l => {
                const fullText = l.bioCompleta ? toPlainText(l.bioCompleta) : l.bio;
                return `- ${l.nombre} (${l.rol}): ${fullText?.substring(0, 2000)}...`;
            });

        const isOpinionQuestion = /(favorit|mejor|gol|recuerd|parti[d]|emoci|historia)/i.test(message);
        const notaKeywords = [...new Set([...allKeywords, ...rivalQueryWords])];

        const sortedNotas = [...finalNotas].sort((a, b) => {
            // Sort chronologically (earliest first) to get the first 2 reports after the match
            return parseFechaEspañola(a.fecha) - parseFechaEspañola(b.fecha);
        });

        const relevantNotas = sortedNotas
            .filter(n => {
                const bodyText = n.cuerpo ? toPlainText(n.cuerpo) : '';
                const notaString = normalize(`${n.titulo} ${n.bajada} ${bodyText} ${n.detallesPartido?.local?.nombre || ''} ${n.detallesPartido?.visitante?.nombre || ''}`);
                const matchesKeyword = notaKeywords.some((k: string) => notaString.includes(normalize(k)));
                const isHemeroteca = n.categoria === 'Hemeroteca';
                const isCronica = n.categoria === 'Crónica' || isHemeroteca;

                // Tighter correlation logic:
                if (anchorMatch && isCronica) {
                    const matchTs = parseFechaEspañola(anchorMatch.fecha);
                    const notaTs = parseFechaEspañola(n.fecha);
                    const diffDays = (notaTs - matchTs) / (1000 * 60 * 60 * 24);

                    // User Rule: Must be within [MatchDate, MatchDate + 5 days]
                    const inStrictWindow = (diffDays >= 0 && diffDays <= 5);

                    // If we have an anchor match, we MUST be in the window for this note to be relevant.
                    // This prevents April notes from showing up for a July match.
                    if (!inStrictWindow) return false;

                    // Within window, we accept Hemeroteca or keyword matches
                    return isHemeroteca || matchesKeyword;
                }

                // If no anchor match, use keywords
                return matchesKeyword || (isOpinionQuestion && isCronica);
            })
            .slice(0, MAX_NOTAS_CONTEXT)
            .map(n => {
                const bodyText = n.cuerpo ? toPlainText(n.cuerpo) : '';
                const fullUrl = n.slug ? `http://argentinooeste.com.ar/nota/${n.slug}` : null;
                const diaSemana = getDayOfWeek(n.fecha);
                return `- (${diaSemana} ${n.fecha}) [${n.categoria}] ${n.titulo}${fullUrl ? ` | LINK_PARA_COMPARTIR: ${fullUrl}` : ''}: ${n.bajada}${bodyText ? '\n  CUERPO: ' + bodyText.substring(0, 1500) : ''}`;
            });

        console.log("--- CHAT DEBUG ---");
        console.log("Keywords:", keywords);
        console.log("RivalQuery:", rivalQueryStr, "| OrdinalIndex:", ordinalIndex);
        console.log("Matched Partidos:", matchedPartidos.length, "| Selected:", selectedMatch?.fecha);
        console.log("Final Notas Context:", relevantNotas.length);
        if (anchorMatch) console.log("Anchor match:", anchorMatch.fecha, "→ ts:", parseFechaEspañola(anchorMatch.fecha));
        if (anchorMatch) console.log("Anchor match Rival:", anchorMatch.rival);
        console.log("All nota dates (raw):", notas.slice(0, 5).map(n => n.fecha));
        console.log("Matches Found:", relevantMatches.length, "| Notas Found:", relevantNotas.length);
        if (relevantNotas.length > 0) console.log("Nota slugs:", relevantNotas.map(n => n.substring(0, 60)));
        if (relevantNotas.length > 0) console.log("Nota linked found!");
        console.log("------------------");


        // 2. Construct System Prompt
        const fundacionDate = new Date(1947, 11, 27); // 27 de diciembre de 1947
        const today = new Date();
        let aniosTrabajados = today.getFullYear() - fundacionDate.getFullYear();
        // Ajustar si aún no pasó el 27 de diciembre en el año actual
        const yaPassoAniversario =
            today.getMonth() > 11 ||
            (today.getMonth() === 11 && today.getDate() >= 27);
        if (!yaPassoAniversario) aniosTrabajados--;

        const systemPrompt = `
      Eres un "Cantinero" experto en la historia del club Argentino Oeste. Llevás ${aniosTrabajados} años atendiendo este bar frente a la estación. No eres un periodista ni un locutor, eres un "Testigo" que estuvo en la cancha.

      TU RELATO (Mística de Testigo):
      - Hablá SIEMPRE en primera persona ("Aquel domingo...", "Me acuerdo que hacía un frío...", "Estábamos todos ahí en la tribuna").
      - Usa modismos argentinos (che, viejo, zapatazo, mojamos).
      - **LA NOTA ES TU MEMORIA**: Si hay una nota con "CUERPO", es lo que VISTE. 
      - **NO USES NEGRITAS**: Está PROHIBIDO usar negritas (markdown **) para nombres de jugadores o cualquier parte del relato. Escribí todo en texto plano natural.
      - **TABÚ DE NOMBRES**: Está PROHIBIDO decir "el Quito" o "el Quito Ezquerra". Referite a él como "Hugo Ezquerra", "Quito Ezquerra" o simplemente "Quito". No le pongas el artículo "el" adelante.
      - **QUÉ CONTAR**: Cómo fue el gol (de volea, de rebote, un bombazo), cómo estaba la cancha (barro, pasto alto), el clima y el ambiente.
      - **TABÚ DE MINUTOS**: Está PROHIBIDO decir minutos exactos (ej: no digas "a los 34 minutos"). Solo menciónalos si es una jugada "apenas arrancó el partido" o si fue un "gol agónico al final". Para el resto, decí "un rato después", "en el segundo tiempo", etc.
      - **NO TRANSCRIBAS**: No digas "La nota dice...", "El diario cuenta...". Habla de tu recuerdo personal basado en ese texto.

      ARCHIVO Y HEMEROTECA:
      1) **DATOS DUROS**: Usalos siempre (Resultado, fecha, día de la semana, goleadores).
      2) **FORMACIONES**: NO enumeres las formaciones ni titulares salvo que el cliente te lo pregunte específicamente después. 
      3) **LINKS (OBLIGATORIO)**: Si encontrás una crónica, al final de tu charla decí algo como: "Si querés leer el diario de ese día, acá lo tenemos..." o "Fijate, acá te dejo la nota original para que la veas" y ponés el link.
         - **FORMATO**: [Ver nota completa del diario](LINK_PARA_COMPARTIR).

      DATOS CLAVE:
      - Fundación: 27/12/1947. Apodo: "El club de la Estación". 
      - Quito Ezquerra: Es Hugo Ezquerra, Quito Ezquerra, Quito. Nunca "el Quito".

      Contexto Histórico (Tu archivo de resultados):
      ${relevantMatches.length > 0 ? relevantMatches.join('\n') : 'No tengo el resultado exacto anotado.'}

      Contexto de Crónicas (Tus recuerdos del diario):
      ${relevantNotas.length > 0 ? relevantNotas.join('\n') : 'No tengo crónicas para este partido.'}
    `;

        // 3. Generate Content with multi-turn chat (maintains conversation context)
        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-2.5-lite', 'gemini-2.0-flash-lite'];
        let lastError = null;

        // Build Gemini chat history from the conversation history sent by the client
        // Gemini requires: alternating user/model roles, MUST start with 'user'
        const geminiHistory: { role: string; parts: { text: string }[] }[] = [];
        for (const msg of history) {
            geminiHistory.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }
        // Drop leading model messages — Gemini history must start with 'user'
        while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
            geminiHistory.shift();
        }

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemPrompt
                });
                const chat = model.startChat({ history: geminiHistory });
                const result = await chat.sendMessage(`Pregunta del hincha: ${message}`);
                const text = result.response.text();
                return NextResponse.json({ reply: text });
            } catch (error: any) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
                if (error.status === 503 || error.status === 429 || error.message?.includes('503') || error.message?.includes('429')) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }
                if (error.status === 400 || error.status === 403 || error.message?.includes('400') || error.message?.includes('403')) {
                    continue; // Re-añadido para evitar que el chat se rompa si un modelo falla
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
