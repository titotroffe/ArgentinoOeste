import { defineField, defineType } from 'sanity'

export const nota = defineType({
    name: 'nota',
    title: 'Nota',
    type: 'document',
    fields: [
        defineField({
            name: 'titulo',
            title: 'Título',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'titulo',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'fecha',
            title: 'Fecha de Publicación',
            type: 'date', // Simple date string YYYY-MM-DD
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'categoria',
            title: 'Sección / Categoría',
            type: 'string',
            options: {
                list: [
                    { title: 'Crónica', value: 'Crónica' },
                    { title: 'Hemeroteca', value: 'Hemeroteca' },
                    { title: 'Entrevista', value: 'Entrevista' },
                    { title: 'Especial', value: 'Especial' },
                    { title: 'Institucional', value: 'Institucional' },
                    { title: 'Sociales', value: 'Sociales' },
                    { title: 'Deportes', value: 'Deportes' },
                ]
            },
            validation: (rule) => rule.required(),
            initialValue: 'Crónica'
        }),
        defineField({
            name: 'bajada',
            title: 'Bajada / Copete',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'autor',
            title: 'Autor',
            type: 'string',
        }),
        defineField({
            name: 'cuerpo',
            title: 'Cuerpo de la Nota',
            type: 'array',
            of: [{ type: 'block' }], // Rich Text
        }),
        defineField({
            name: 'imagenPortada',
            title: 'Imagen de Portada (Home)',
            description: 'Imagen que se mostrará en la página principal. Si se deja vacía, se usará la imagen principal.',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'epigrafe',
                    type: 'string',
                    title: 'Epígrafe',
                }
            ]
        }),
        defineField({
            name: 'imagen',
            title: 'Imagen Principal (Nota)',
            description: 'Imagen que se mostrará dentro de la nota.',
            type: 'image',
            options: {
                hotspot: true, // Allow cropping
            },
            fields: [
                {
                    name: 'epigrafe',
                    type: 'string',
                    title: 'Epígrafe',
                }
            ]
        }),

        // Optional Match Details
        defineField({
            name: 'detallesPartido',
            title: 'Planilla de Partido (Opcional)',
            type: 'matchDetails',
        })
    ],
    preview: {
        select: {
            titulo: 'titulo',
            autor: 'autor',
            media: 'imagen',
        },
        prepare(selection) {
            const { titulo, autor, media } = selection
            return {
                title: titulo,
                subtitle: autor && `por ${autor}`,
                media: media,
            }
        },
    },
})
