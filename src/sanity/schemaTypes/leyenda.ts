import { defineField, defineType } from 'sanity'

export const leyenda = defineType({
    name: 'leyenda',
    title: 'Leyenda',
    type: 'document',
    fields: [
        defineField({
            name: 'nombre',
            title: 'Nombre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'nombre',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'roles',
            title: 'Roles Desempeñados',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Jugador', value: 'Jugador' },
                    { title: 'Director Técnico', value: 'DT' },
                    { title: 'Dirigente', value: 'Dirigente' },
                    { title: 'Hincha / Colaborador', value: 'Hincha' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'rol',
            title: 'Posición / Título (Texto libre)',
            description: 'Ej: "Delantero Centro", "Presidente Histórico", etc.',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'periodo',
            title: 'Periodo',
            type: 'string',
            description: 'Ej: "1978 - 1985"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'partidos',
            title: 'Partidos Jugados',
            type: 'number',
            hidden: ({ document }: any) => !document?.roles?.includes('Jugador'),
        }),
        defineField({
            name: 'goles',
            title: 'Goles',
            type: 'number',
            hidden: ({ document }: any) => !document?.roles?.includes('Jugador'),
        }),
        defineField({
            name: 'bio',
            title: 'Biografía Corta / Resumen (Card)',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'bioCompleta',
            title: 'Biografía Completa (Detalle)',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'imagen',
            title: 'Foto',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texto alternativo',
                }
            ]
        }),
    ],
    preview: {
        select: {
            title: 'nombre',
            subtitle: 'rol',
            media: 'imagen',
        },
    },
})
