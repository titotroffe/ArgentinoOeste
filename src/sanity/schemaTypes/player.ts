import { defineField, defineType } from 'sanity'

export const player = defineType({
    name: 'player',
    title: 'Jugador',
    type: 'object',
    fields: [
        defineField({
            name: 'nombre',
            title: 'Nombre',
            type: 'string',
        }),
        defineField({
            name: 'goles',
            title: 'Goles',
            type: 'number',
        }),
        defineField({
            name: 'golesEnContra',
            title: 'Goles en Contra',
            type: 'number',
        }),
        defineField({
            name: 'rojas',
            title: 'Tarjeta Roja',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'ingreso',
            title: 'Ingresó desde banco',
            type: 'boolean',
            initialValue: false,
        })
    ],
    preview: {
        select: {
            title: 'nombre',
            goles: 'goles',
        },
        prepare(selection) {
            const { title, goles } = selection
            return {
                title: title,
                subtitle: goles ? `${goles} Goles` : ''
            }
        }
    }
})
