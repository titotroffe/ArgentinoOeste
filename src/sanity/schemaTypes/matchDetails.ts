import { defineField, defineType } from 'sanity'

export const matchDetails = defineType({
    name: 'matchDetails',
    title: 'Detalles del Partido (Síntesis)',
    type: 'object',
    fields: [
        defineField({
            name: 'resultado',
            title: 'Resultado Final (ej: 2-1)',
            type: 'string',
        }),
        defineField({
            name: 'cancha',
            title: 'Estadio / Cancha',
            type: 'string',
        }),
        defineField({
            name: 'arbitro',
            title: 'Árbitro',
            type: 'string',
        }),
        defineField({
            name: 'local',
            title: 'Local',
            type: 'team',
        }),
        defineField({
            name: 'visitante',
            title: 'Visitante',
            type: 'team',
        }),
    ],
})
