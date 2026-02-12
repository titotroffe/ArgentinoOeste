import { PortableTextBlock } from 'sanity';

export interface Jugador {
    id: string;
    nombre: string;
    posicion: string;
    fechaNacimiento?: string;
    nacionalidad?: string;
    foto?: string;
}

export interface Partido {
    id: string;
    fecha: string;
    anio: number;
    rival: string;
    resultado: string; // ej: "2-1"
    golesFavor: number;
    golesContra: number;
    cancha: string; // "Local", "Visitante", "Neutral"
    estadio?: string;
    arbitro?: string;
    tecnico?: string;
    torneo: string;
    instancia?: string; // "Fecha 1", "Final", etc.
    goleadores?: { idJugador: string; minuto: number; tipo?: 'penal' | 'cabezazo' | 'jugada' }[];
    alineacion?: string[]; // IDs de jugadores
}


export interface Nota {
    _id: string; // Sanity uses _id
    titulo: string;
    slug?: { current: string }; // Sanity slug object
    bajada: string;
    fecha: string;
    autor?: string;
    cuerpo: PortableTextBlock[]; // Portable Text Blocks
    imagenPortada?: {
        asset: { url: string };
        hotspot?: { x: number; y: number; height: number; width: number };
        epigrafe?: string;
    };
    imagen?: {
        asset: {
            url: string;
        };
        alt?: string;
        epigrafe?: string;
    };
    categoria: 'Crónica' | 'Hemeroteca' | 'Entrevista' | 'Especial' | 'Institucional' | 'Sociales' | 'Deportes';
    detallesPartido?: {
        local: {
            nombre: string;
            titulares: { nombre: string; goles?: number; rojas?: boolean }[];
            suplentes: { nombre: string; goles?: number; ingreso?: boolean }[];
            dt: string
        };
        visitante: {
            nombre: string;
            titulares: { nombre: string; goles?: number; rojas?: boolean }[];
            suplentes: { nombre: string; goles?: number; ingreso?: boolean }[];
            dt: string
        };
        arbitro: string;
        cancha: string;
        resultado: string;
    };
}

export interface EstadisticaAnual {
    anio: number;
    jugados: number;
    ganados: number;
    empatados: number;
    perdidos: number;
    golesFavor: number;
    golesContra: number;
    posicion?: string;
    logros?: string[];
    historia?: string; // Texto descriptivo del año
}

export interface Leyenda {
    _id: string;
    nombre: string;
    slug?: { current: string };
    roles?: string[];
    rol: string; // kept as position/title
    periodo: string;
    partidos?: number;
    goles?: number;
    partidosDirigidos?: number;
    ganados?: number;
    empatados?: number;
    perdidos?: number;
    titulos?: { titulo: string; anio?: string }[];
    bio: string;
    bioCompleta?: PortableTextBlock[];
    imagen?: {
        asset: {
            url: string;
            metadata?: {
                dimensions: {
                    width: number;
                    height: number;
                }
            }
        };
        alt?: string;
    };
}
