'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, Users, MapPin, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Partido, Jugador } from '@/types';
// import { partidos, jugadores } from '@/data/mock-data';

const partidos: Partido[] = [];
const jugadores: Jugador[] = [];
import styles from './page.module.css';

export default function BuscadorPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredMatches = useMemo(() => {
        if (!searchTerm) return partidos;

        const lowerTerm = searchTerm.toLowerCase();

        return partidos.filter((partido) => {
            // Búsqueda por Rival
            if (partido.rival.toLowerCase().includes(lowerTerm)) return true;
            // Búsqueda por Cancha
            if (partido.cancha.toLowerCase().includes(lowerTerm)) return true;
            if (partido.estadio?.toLowerCase().includes(lowerTerm)) return true;
            // Búsqueda por Arbitro
            if (partido.arbitro?.toLowerCase().includes(lowerTerm)) return true;
            // Búsqueda por Tecnico
            if (partido.tecnico?.toLowerCase().includes(lowerTerm)) return true;

            // Búsqueda por Jugador (Goleadores por ahora)
            const goleadorEncontrado = partido.goleadores?.some(g => {
                const jugador = jugadores.find(j => j.id === g.idJugador);
                return jugador?.nombre.toLowerCase().includes(lowerTerm);
            });
            if (goleadorEncontrado) return true;

            return false;
        });
    }, [searchTerm]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Buscador Histórico</h1>
                <p className={styles.subtitle}>Explora el archivo completo de partidos</p>
            </header>

            <div className={styles.searchBox}>
                <div className={styles.inputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por rival, jugador, técnico, árbitro..."
                        className={styles.input}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <span className={styles.filterLabel}><Filter size={16} /> Filtros rápidos:</span>
                    <button onClick={() => setSearchTerm('Local')} className={styles.filterTag}>Local</button>
                    <button onClick={() => setSearchTerm('Carlos Bianchi')} className={styles.filterTag}>DT: Bianchi</button>
                </div>
            </div>

            <div className={styles.results}>
                <h2 className={styles.resultsTitle}>
                    Resultados ({filteredMatches.length})
                </h2>

                {filteredMatches.length > 0 ? (
                    <div className={styles.matchesGrid}>
                        {filteredMatches.map((partido) => (
                            <div key={partido.id} className={styles.matchCard}>
                                <div className={styles.matchHeader}>
                                    <span className={styles.yearBadge}>{partido.anio}</span>
                                    <span className={styles.date}>{new Date(partido.fecha).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.matchScore}>
                                    <div className={styles.team}>Arg. Oeste</div>
                                    <div className={styles.scoreNumber}>{partido.golesFavor} - {partido.golesContra}</div>
                                    <div className={styles.team}>{partido.rival}</div>
                                </div>
                                <div className={styles.matchDetails}>
                                    <p><MapPin size={14} /> {partido.cancha} {partido.estadio ? `(${partido.estadio})` : ''}</p>
                                    <p><User size={14} /> DT: {partido.tecnico || 'N/A'}</p>
                                    <p><Users size={14} /> Árbitro: {partido.arbitro || 'N/A'}</p>
                                </div>
                                <Link href={`/historia/${partido.anio}`} className={styles.viewLink}>
                                    Ver Temporada
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noResults}>
                        <p>No se encontraron partidos con ese criterio.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
