
export { }
const { getCliClient } = require('sanity/cli')

const client = getCliClient({ apiVersion: '2025-12-23' })

async function verify() {
    console.log('Verifying legends...')
    const query = '*[_type == "leyenda"]{_id, nombre}'
    try {
        const legends = await client.fetch(query)
        console.log('Found legends:', legends.length)
        legends.forEach((l: any) => console.log(`- ${l.nombre} (${l._id})`))
    } catch (err) {
        console.error('Query failed:', err)
    }
}

verify()
