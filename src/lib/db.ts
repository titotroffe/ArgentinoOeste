import { client } from '@/sanity/lib/client';
import { NOTAS_QUERY, NOTA_BY_ID_QUERY } from '@/sanity/lib/queries';
import { Nota } from '../types';

export async function getNotas(): Promise<Nota[]> {
    return await client.fetch(NOTAS_QUERY);
}

export async function getNotaById(id: string): Promise<Nota | undefined> {
    return await client.fetch(NOTA_BY_ID_QUERY, { id });
}

