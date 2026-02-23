import { defineType, defineField } from 'sanity'

export const chatLog = defineType({
    name: 'chatLog',
    title: 'Log de Chat',
    type: 'document',
    fields: [
        defineField({
            name: 'ip',
            title: 'Dirección IP',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'mensaje',
            title: 'Mensaje del Usuario',
            type: 'text',
            readOnly: true,
        }),
        defineField({
            name: 'respuesta',
            title: 'Respuesta del Bot',
            type: 'text',
            readOnly: true,
        }),
        defineField({
            name: 'fecha',
            title: 'Fecha y Hora',
            type: 'datetime',
            readOnly: true,
        }),
    ],
    preview: {
        select: {
            title: 'mensaje',
            subtitle: 'fecha',
        },
    },
})
