
import { client } from '@/sanity/lib/client';
import { NOTAS_QUERY, NOTA_BY_ID_QUERY, LEYENDAS_QUERY, LEYENDA_BY_SLUG_QUERY, LATEST_LEYENDAS_QUERY } from '@/sanity/lib/queries';
import { Nota, Leyenda } from '../types';

export async function getNotas(): Promise<Nota[]> {
    return await client.fetch(NOTAS_QUERY);
}

export async function getNotaById(id: string): Promise<Nota | undefined> {
    return await client.fetch(NOTA_BY_ID_QUERY, { id });
}


export async function getLeyendas(): Promise<Leyenda[]> {
    return await client.fetch(LEYENDAS_QUERY);
}

export async function getLeyendaBySlug(slug: string): Promise<Leyenda | undefined> {
    return await client.fetch(LEYENDA_BY_SLUG_QUERY, { slug });
}

export async function getLatestLeyendas(): Promise<Leyenda[]> {
    return await client.fetch(LATEST_LEYENDAS_QUERY);
}

