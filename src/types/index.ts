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
    cuerpo: any[]; // Portable Text Blocks
    imagenPortada?: {
        asset: { url: string };
        hotspot?: any;
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
