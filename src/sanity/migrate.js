const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_SESSION_TOKEN // CLI --with-user-token might not inject this env var directly, better to let CLI handle it?
    // Actually, let's try to run this as a standalone node script if the user sets a token.
    // But since we are using 'sanity exec', we can use the 'sanity' client from the context if we use the sanity cli config.
});

// Hardcoded content
const gloriaEternaNote = {
    _id: 'gloria-eterna-98-migrated', // forcing ID to avoid duplicates if re-run
    _type: 'nota',
    titulo: 'Gloria Eterna: Argentino Oeste Campeón 1998',
    slug: { _type: 'slug', current: 'gloria-eterna-98' },
    fecha: '1998-12-20',
    categoria: 'Hemeroteca',
    bajada: 'A 25 años de la máxima gesta del club. Crónica de una tarde inolvidable donde el equipo de la estación tocó el cielo con las manos.',
    autor: 'Archivo Histórico AO',
    cuerpo: [
        {
            _type: 'block',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    text: 'Fue una tarde de calor agobiante en San Nicolás, pero a nadie le importó. El Estadio de 12 de Octubre estaba colmado. La hinchada de Argentino Oeste había llegado en caravana desde la estación, presintiendo que la historia estaba a punto de escribirse.',
                },
            ],
        },
        {
            _type: 'block',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    text: 'El rival era duro, pero el equipo dirigido por "El Mago" Ramírez sabía a lo que jugaba. Con un esquema 4-3-1-2 clásico, Argentino dominó las acciones desde el primer minuto, empujado por el aliento incesante de su gente.',
                },
            ],
        },
        {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'El Gol del Campeonato' }],
        },
        {
            _type: 'block',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    text: 'Corría el minuto 88 y el empate 0-0 parecía sentenciado. El partido había sido una batalla táctica y física. Cada pelota se disputaba como si fuera la última, con el mediocampo convertido en una zona de guerra donde nadie regalaba un centímetro. La tensión se palpaba en el aire, densa como la humedad de aquella tarde de diciembre.',
                },
            ],
        },
        {
            _type: 'block',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    text: 'Fue entonces cuando apareció la figura de Juan "La Fiera" Rodríguez, ese delantero indomable que tantas alegrías había dado a la hinchada. Recibió un pase filtrado exquisito de Martínez, rompiendo la línea del offside con una diagonal perfecta. El tiempo pareció detenerse. Rodríguez eludió al arquero con una finta sutil hacia la derecha y, con el arco libre, acarició la pelota hacia la red. El grito de gol no fue solo un sonido; fue una explosión emocional que sacudió los cimientos del estadio y se escuchó hasta las vías del tren.',
                },
            ],
        },
        {
            _type: 'block',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    text: 'Los minutos finales fueron de infarto. El rival, herido en su orgullo, se lanzó al ataque con desesperación, llenando el área de Argentino de centros llovidos. Pero la defensa, liderada por el capitán "El Muro" González, despejó todo lo que caía. Y cuando la defensa fue superada, apareció las manos seguras del arquero López para descolgar ilusiones rivales. El pitazo final de Elizondo no solo marcó el final del partido, sino el comienzo de la eternidad.',
                },
            ],
        },
        {
            _type: 'block',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    text: 'Jugadores, cuerpo técnico e hinchas se fundieron en un abrazo interminable, una marea humana de lágrimas y sonrisas. La vuelta olímpica en cancha ajena tuvo un sabor especial, reivindicando años de esfuerzo y sacrificio de una institución humilde pero gigante de corazón. Esa noche, San Nicolás no durmió. La caravana de regreso a la estación fue interminable, una serpiente de luces y bocinas que iluminó la oscuridad. "El equipo de la estación" había logrado lo que muchos creían imposible: tocar la gloria con las manos y escribir la página más dorada de su historia.',
                },
            ],
        },
    ],
    detallesPartido: {
        _type: 'matchDetails',
        resultado: '1 - 0',
        cancha: 'Estadio Manuel Santos Podestá',
        arbitro: 'Horacio Elizondo',
        local: {
            _type: 'team',
            nombre: 'Argentino Oeste',
            dt: 'Carlos Ramírez',
            titulares: [
                { _type: 'player', _key: 'p1', nombre: 'G. López' },
                { _type: 'player', _key: 'p2', nombre: 'R. Sánchez' },
                { _type: 'player', _key: 'p3', nombre: 'M. Díaz' },
                { _type: 'player', _key: 'p4', nombre: 'J. Pérez' },
                { _type: 'player', _key: 'p5', nombre: 'A. González' },
                { _type: 'player', _key: 'p6', nombre: 'P. Miguez' },
                { _type: 'player', _key: 'p7', nombre: 'L. Torres' },
                { _type: 'player', _key: 'p8', nombre: 'D. Romero' },
                { _type: 'player', _key: 'p9', nombre: 'Juan Rodríguez', goles: 1 },
                { _type: 'player', _key: 'p10', nombre: 'O. Martinez' },
                { _type: 'player', _key: 'p11', nombre: 'F. Sosa' },
            ],
            suplentes: [
                { _type: 'player', _key: 's1', nombre: 'A. Benitez' },
                { _type: 'player', _key: 's2', nombre: 'C. Ruiz' },
            ]
        },
        visitante: {
            _type: 'team',
            nombre: 'Real San Nicolás',
            dt: 'Jorge Solari',
            titulares: [
                { _type: 'player', _key: 'v1', nombre: 'Arquero Rival' },
                { _type: 'player', _key: 'v2', nombre: 'Defensa Rival 1' },
                { _type: 'player', _key: 'v3', nombre: 'Defensa Rival 2' },
                { _type: 'player', _key: 'v4', nombre: 'Defensa Rival 3' },
                { _type: 'player', _key: 'v5', nombre: 'Medio Rival 1' },
                { _type: 'player', _key: 'v6', nombre: 'Medio Rival 2' },
                { _type: 'player', _key: 'v7', nombre: 'Medio Rival 3' },
                { _type: 'player', _key: 'v8', nombre: 'Delantero Rival 1' },
                { _type: 'player', _key: 'v9', nombre: 'Delantero Rival 2' },
                { _type: 'player', _key: 'v10', nombre: 'Delantero Rival 3' },
                { _type: 'player', _key: 'v11', nombre: 'Enganche Rival' },
            ],
            suplentes: []
        }
    }
};

async function run() {
    console.log('Migrando nota...');
    try {
        const transaction = client.transaction();
        transaction.createOrReplace(gloriaEternaNote);
        const res = await transaction.commit();
        console.log('Nota migrada:', res);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

// Since we are running via `sanity exec`, the client needs valid token.
// `sanity exec` with `--with-user-token` injects the token into the client config if using `getCliClient`.
// Let's try to grab the client from `sanity/cli` if possible, or just default to standard.

run();
