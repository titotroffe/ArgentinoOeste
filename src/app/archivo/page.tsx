'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, User, Users, Calendar, Trophy, ChevronDown } from 'lucide-react';
import partidos from '@/data/partidos.json';
import styles from './page.module.css';

type Partido = {
    id: string;
    fecha: string;
    anio: number;
    torneo: string;
    instancia: string;
    condicion: string;
    rival: string;
    equipoLocal: string;
    equipoVisitante: string;
    golesLocal: number;
    golesVisitante: number;
    golesFavor: number;
    golesContra: number;
    resultado: string;
    cancha: string;
    arbitro: string;
    dt: string;
    titularesLocal: string[];
    titularesVisitante: string[];
    suplentesLocal: string[];
    suplentesVisitante: string[];
    goleadoresLocal: { jugador: string; goles: number }[];
    goleadoresVisitante: { jugador: string; goles: number }[];
};

const allPartidos = partidos as Partido[];

// Get unique years sorted
const years = [...new Set(allPartidos.map(p => p.anio))].sort((a, b) => b - a);

export default function ArchivoPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedTorneo, setSelectedTorneo] = useState<string>('');
    const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

    // Get unique torneos based on selectedYear
    const availableTorneos = useMemo(() => {
        const matches = selectedYear
            ? allPartidos.filter(p => p.anio === selectedYear)
            : allPartidos;
        return [...new Set(matches.map(p => p.torneo))].sort();
    }, [selectedYear]);

    // Reset selectedTorneo when year changes
    useEffect(() => {
        setSelectedTorneo('');
    }, [selectedYear]);

    const filteredMatches = useMemo(() => {
        let results = allPartidos;

        // Filter by year
        if (selectedYear) {
            results = results.filter(p => p.anio === selectedYear);
        }

        // Filter by torneo
        if (selectedTorneo) {
            results = results.filter(p => p.torneo === selectedTorneo);
        }

        // Filter by search term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            results = results.filter(p => {
                if ((p.rival || '').toLowerCase().includes(lowerTerm)) return true;
                if ((p.cancha || '').toLowerCase().includes(lowerTerm)) return true;
                if ((p.arbitro || '').toLowerCase().includes(lowerTerm)) return true;
                if ((p.dt || '').toLowerCase().includes(lowerTerm)) return true;
                if ((p.instancia || '').toLowerCase().includes(lowerTerm)) return true;
                // Search in players
                const allPlayers = [
                    ...p.titularesLocal, ...p.titularesVisitante,
                    ...p.suplentesLocal, ...p.suplentesVisitante
                ];
                if (allPlayers.some(name => name.toLowerCase().includes(lowerTerm))) return true;
                // Search in scorers
                const allScorers = [...p.goleadoresLocal, ...p.goleadoresVisitante];
                if (allScorers.some(g => g.jugador.toLowerCase().includes(lowerTerm))) return true;
                return false;
            });
        }

        return results;
    }, [searchTerm, selectedYear, selectedTorneo]);

    // Statistics
    const stats = useMemo(() => {
        const wins = filteredMatches.filter(p => p.golesFavor > p.golesContra).length;
        const draws = filteredMatches.filter(p => p.golesFavor === p.golesContra).length;
        const losses = filteredMatches.filter(p => p.golesFavor < p.golesContra).length;
        const golesAFavor = filteredMatches.reduce((acc, p) => acc + p.golesFavor, 0);
        const golesEnContra = filteredMatches.reduce((acc, p) => acc + p.golesContra, 0);
        return { wins, draws, losses, golesAFavor, golesEnContra, total: filteredMatches.length };
    }, [filteredMatches]);

    const getResultClass = (p: Partido) => {
        if (p.golesFavor > p.golesContra) return styles.win;
        if (p.golesFavor < p.golesContra) return styles.loss;
        return styles.draw;
    };



    /** Get the display names and scores for left (local) / right (visitante) */
    const getDisplayInfo = (p: Partido) => {
        if (p.condicion === 'Neutral') {
            // Neutral: Argentino always on the left
            const argIsLocal = (p.equipoLocal || '').toLowerCase().includes('argentino');
            return {
                leftTeam: (argIsLocal ? p.equipoLocal : p.equipoVisitante) || '',
                rightTeam: (argIsLocal ? p.equipoVisitante : p.equipoLocal) || '',
                leftScore: (argIsLocal ? p.golesLocal : p.golesVisitante) || 0,
                rightScore: (argIsLocal ? p.golesVisitante : p.golesLocal) || 0,
                leftLabel: '',
                rightLabel: '',
                canchaLabel: `${p.cancha || 'N/A'} (Neutral)`,
                leftGoleadores: (argIsLocal ? p.goleadoresLocal : p.goleadoresVisitante) || [],
                rightGoleadores: (argIsLocal ? p.goleadoresVisitante : p.goleadoresLocal) || [],
                leftTitulares: (argIsLocal ? p.titularesLocal : p.titularesVisitante) || [],
                rightTitulares: (argIsLocal ? p.titularesVisitante : p.titularesLocal) || [],
                leftSuplentes: (argIsLocal ? p.suplentesLocal : p.suplentesVisitante) || [],
                rightSuplentes: (argIsLocal ? p.suplentesVisitante : p.suplentesLocal) || [],
            };
        }

        // Normal: Local on the left, Visitante on the right
        return {
            leftTeam: p.equipoLocal || '',
            rightTeam: p.equipoVisitante || '',
            leftScore: p.golesLocal || 0,
            rightScore: p.golesVisitante || 0,
            leftLabel: '(Local)',
            rightLabel: '(Visitante)',
            canchaLabel: p.cancha || 'N/A',
            leftGoleadores: p.goleadoresLocal || [],
            rightGoleadores: p.goleadoresVisitante || [],
            leftTitulares: p.titularesLocal || [],
            rightTitulares: p.titularesVisitante || [],
            leftSuplentes: p.suplentesLocal || [],
            rightSuplentes: p.suplentesVisitante || [],
        };
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedYear(null);
        setSelectedTorneo('');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Archivo Histórico</h1>
                <p className={styles.subtitle}>
                    {allPartidos.length} partidos documentados · {years[years.length - 1]} — {years[0]}
                </p>
            </header>

            {/* Search & Filters */}
            <div className={styles.searchBox}>
                <div className={styles.inputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por rival, jugador, técnico, árbitro, cancha..."
                        className={styles.input}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterRow}>
                    <div className={styles.selectWrapper}>
                        <Calendar size={14} />
                        <select
                            className={styles.select}
                            value={selectedYear || ''}
                            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">Todos los años</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.selectWrapper}>
                        <Trophy size={14} />
                        <select
                            className={styles.select}
                            value={selectedTorneo}
                            onChange={(e) => setSelectedTorneo(e.target.value)}
                        >
                            <option value="">Todos los torneos</option>
                            {availableTorneos.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    {(searchTerm || selectedYear || selectedTorneo) && (
                        <button onClick={clearFilters} className={styles.clearBtn}>
                            Limpiar filtros
                        </button>
                    )}
                </div>
                <div className={styles.quickFilters}>
                    <span className={styles.filterLabel}><Filter size={14} /> Rápido:</span>
                    {years.slice(0, 5).map(y => (
                        <button
                            key={y}
                            onClick={() => setSelectedYear(y)}
                            className={`${styles.filterTag} ${selectedYear === y ? styles.filterTagActive : ''}`}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Bar */}
            <div className={styles.statsBar}>
                <div className={styles.stat}>
                    <span className={styles.statNumber}>{stats.total}</span>
                    <span className={styles.statLabel}>Partidos</span>
                </div>
                <div className={styles.stat}>
                    <span className={`${styles.statNumber} ${styles.winColor}`}>{stats.wins}</span>
                    <span className={styles.statLabel}>Ganados</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statNumber}>{stats.draws}</span>
                    <span className={styles.statLabel}>Empates</span>
                </div>
                <div className={styles.stat}>
                    <span className={`${styles.statNumber} ${styles.lossColor}`}>{stats.losses}</span>
                    <span className={styles.statLabel}>Perdidos</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statNumber}>{stats.golesAFavor}</span>
                    <span className={styles.statLabel}>GF</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statNumber}>{stats.golesEnContra}</span>
                    <span className={styles.statLabel}>GC</span>
                </div>
            </div>

            {/* Results */}
            <div className={styles.results}>
                <h2 className={styles.resultsTitle}>
                    Resultados ({filteredMatches.length})
                </h2>

                {filteredMatches.length > 0 ? (
                    <div className={styles.matchesList}>
                        {filteredMatches.map((partido) => {
                            const display = getDisplayInfo(partido);
                            const isExpanded = expandedMatch === partido.id;

                            return (
                                <div
                                    key={partido.id}
                                    className={`${styles.matchCard} ${getResultClass(partido)}`}
                                >
                                    <div
                                        className={styles.matchMain}
                                        onClick={() => setExpandedMatch(isExpanded ? null : partido.id)}
                                    >
                                        <div className={styles.matchHeader}>
                                            <div className={styles.matchMeta}>
                                                <span className={styles.yearBadge}>{partido.anio}</span>
                                                <span className={styles.instanciaBadge}>{partido.instancia || partido.torneo}</span>
                                            </div>
                                            <span className={styles.date}><Calendar size={12} /> {partido.fecha}</span>
                                        </div>
                                        <div className={styles.matchScore}>
                                            <div className={styles.teamHome}>
                                                <span className={styles.teamName}>{display.leftTeam}</span>
                                                {display.leftGoleadores.length > 0 && (
                                                    <div className={styles.teamScorers}>
                                                        <span className={styles.goalsTitle}>Goles</span>
                                                        {display.leftGoleadores.map((g, i) => (
                                                            <div key={i} className={styles.scorerItem}>
                                                                {g.goles > 1 ? `${g.jugador} (${g.goles})` : g.jugador}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.scoreNumber}>
                                                {display.leftScore} - {display.rightScore}
                                            </div>
                                            <div className={styles.teamAway}>
                                                <span className={styles.teamName}>{display.rightTeam}</span>
                                                {display.rightGoleadores.length > 0 && (
                                                    <div className={styles.teamScorers}>
                                                        <span className={styles.goalsTitle}>Goles</span>
                                                        {display.rightGoleadores.map((g, i) => (
                                                            <div key={i} className={styles.scorerItem}>
                                                                {g.goles > 1 ? `${g.jugador} (${g.goles})` : g.jugador}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.matchInfo}>
                                            <span><MapPin size={12} /> {display.canchaLabel}</span>
                                            <span><User size={12} /> DT: {partido.dt || 'N/A'}</span>
                                            <ChevronDown size={16} className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`} />
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className={styles.matchExpanded}>
                                            <div className={styles.expandedGrid}>
                                                {/* Left column: local team (or Argentino if neutral) */}
                                                <div className={styles.lineupCol}>
                                                    <h4>{display.leftTeam}</h4>
                                                    {display.leftTeam.toLowerCase().includes('argentino') && partido.dt && (
                                                        <p className={styles.dtName}>DT: {partido.dt}</p>
                                                    )}
                                                    <h5>Titulares</h5>
                                                    {display.leftTitulares.length > 0 ? (
                                                        <ul>
                                                            {display.leftTitulares.map((j, i) => {
                                                                return (
                                                                    <li key={i}>
                                                                        {j}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <p className={styles.noPlayers}>Sin datos</p>
                                                    )}
                                                    {display.leftSuplentes.length > 0 && (
                                                        <>
                                                            <h5>Ingresaron</h5>
                                                            <ul>
                                                                {display.leftSuplentes.map((j, i) => (
                                                                    <li key={i}>{j}</li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Right column: visitante team (or rival if neutral) */}
                                                <div className={styles.lineupCol}>
                                                    <h4>{display.rightTeam}</h4>
                                                    {display.rightTeam.toLowerCase().includes('argentino') && partido.dt && (
                                                        <p className={styles.dtName}>DT: {partido.dt}</p>
                                                    )}
                                                    <h5>Titulares</h5>
                                                    {display.rightTitulares.length > 0 ? (
                                                        <ul>
                                                            {display.rightTitulares.map((j, i) => {
                                                                return (
                                                                    <li key={i}>
                                                                        {j}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <p className={styles.noPlayers}>Sin datos</p>
                                                    )}
                                                    {display.rightSuplentes.length > 0 && (
                                                        <>
                                                            <h5>Ingresaron</h5>
                                                            <ul>
                                                                {display.rightSuplentes.map((j, i) => (
                                                                    <li key={i}>{j}</li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.expandedFooter}>
                                                <span><Users size={12} /> Árbitro: {partido.arbitro || 'N/A'}</span>
                                                <span><MapPin size={12} /> {display.canchaLabel}</span>
                                                <span><Trophy size={12} /> {partido.torneo}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
