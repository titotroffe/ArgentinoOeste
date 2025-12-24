import { Partido, Jugador, EstadisticaAnual } from '@/types';

export const jugadores: Jugador[] = [
    { id: 'j1', nombre: 'Juan Rodríguez', posicion: 'Delantero' },
    { id: 'j2', nombre: 'Carlos Bianchi', posicion: 'Director Técnico' },
    { id: 'j3', nombre: 'M. Díaz', posicion: 'Arquero' },
    { id: 'j4', nombre: 'C. López', posicion: 'Defensor' },
    { id: 'j5', nombre: 'R. Gómez', posicion: 'Defensor' },
];

export const partidos: Partido[] = [
    {
        id: '1',
        fecha: '1998-05-12',
        anio: 1998,
        rival: 'Rival FC',
        resultado: '1-0',
        golesFavor: 1,
        golesContra: 0,
        cancha: 'Local',
        estadio: 'El Fortín',
        arbitro: 'Horacio Elizondo',
        tecnico: 'Carlos Bianchi',
        torneo: 'Liga Nicoleña',
        goleadores: [{ idJugador: 'j1', minuto: 88, tipo: 'jugada' }],
        alineacion: ['j3', 'j4', 'j5', 'j1']
    },
    {
        id: '2',
        fecha: '1998-05-19',
        anio: 1998,
        rival: 'Otro Rival',
        resultado: '2-1',
        golesFavor: 2,
        golesContra: 1,
        cancha: 'Visitante',
        torneo: 'Liga Nicoleña',
        tecnico: 'Carlos Bianchi'
    }
];

export const historiaAnual: EstadisticaAnual[] = [
    {
        anio: 1998,
        jugados: 30,
        ganados: 20,
        empatados: 5,
        perdidos: 5,
        golesFavor: 60,
        golesContra: 25,
        posicion: '1º',
        logros: ['Campeón Liga Nicoleña'],
        historia: 'El año 1998 quedó marcado en la memoria de todos los hinchas de Argentino Oeste por la obtención del título de la Liga Nicoleña en una final apasionante.'
    }
];
