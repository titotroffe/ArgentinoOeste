import { defineField, defineType } from 'sanity'

export const team = defineType({
    name: 'team',
    title: 'Equipo',
    type: 'object',
    fields: [
        defineField({
            name: 'nombre',
            title: 'Nombre del Club',
            type: 'string',
        }),
        defineField({
            name: 'dt',
            title: 'Director Técnico',
            type: 'string',
        }),
        defineField({
            name: 'titulares',
            title: 'Titulares',
            type: 'array',
            of: [{ type: 'player' }],
        }),
        defineField({
            name: 'suplentes',
            title: 'Suplentes',
            type: 'array',
            of: [{ type: 'player' }],
        }),
    ],
})
