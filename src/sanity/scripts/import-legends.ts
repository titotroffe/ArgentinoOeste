
export { }
const { getCliClient } = require('sanity/cli')

// Initialize client using CLI context (inherits token from 'sanity exec --with-user-token')
const client = getCliClient({ apiVersion: '2025-12-23' })

console.log('Script started using getCliClient')

const legends = [
    {
        _type: 'leyenda',
        _id: 'leyenda-juan-rodriguez',
        nombre: "Juan 'La Fiera' Rodríguez",
        slug: { _type: 'slug', current: 'juan-la-fiera-rodriguez' },
        rol: 'Delantero Centro',
        periodo: '1978 - 1985',
        partidos: 184,
        goles: 97,
        bio: 'El máximo goleador histórico del club. Conocido por su potente remate de derecha y su capacidad para definir en los momentos clave. Lideró al equipo al campeonato del 82.',
    },
    {
        _type: 'leyenda',
        _id: 'leyenda-roberto-sanchez',
        nombre: "Roberto 'El Muro' Sánchez",
        slug: { _type: 'slug', current: 'roberto-el-muro-sanchez' },
        rol: 'Defensor Central',
        periodo: '1990 - 2001',
        partidos: 312,
        goles: 12,
        bio: 'Capitán indiscutido durante la década de los 90. Un líder nato dentro y fuera de la cancha. Su entrega y coraje inspiraron a toda una generación de defensores.',
    },
    {
        _type: 'leyenda',
        _id: 'leyenda-carlos-bianchi',
        nombre: 'Carlos Bianchi (No el Virrey)',
        slug: { _type: 'slug', current: 'carlos-bianchi-no-el-virrey' },
        rol: 'Director Técnico',
        periodo: '1980 - 1984',
        partidos: 150,
        goles: 0,
        bio: 'El arquitecto del equipo campeón. Revolucionó el fútbol local con sus tácticas innovadoras y su enfoque en la disciplina física.',
    },
]

async function importLegends() {
    console.log('Importing legends...')
    for (const legend of legends) {
        try {
            const res = await client.createOrReplace(legend)
            console.log(`✅ Created/Updated legend: ${res.nombre}`)
        } catch (err) {
            console.error(`❌ Failed to create legend ${legend.nombre}:`, err)
            console.error(JSON.stringify(err, null, 2))
        }
    }
    console.log('Done!')
}

importLegends()
