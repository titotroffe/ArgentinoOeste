import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User, Users, Trophy } from 'lucide-react';
import { partidos, jugadores } from '@/data/mock-data';
import styles from './page.module.css';

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateStaticParams() {
    return partidos.map((p) => ({
        id: p.id,
    }));
}

export default function PartidoPage({ params }: PageProps) {
    const partido = partidos.find((p) => p.id === params.id);

    if (!partido) {
        return <div className={styles.container}>Partido no encontrado</div>;
    }

    const getNombreJugador = (id: string) => {
        return jugadores.find(j => j.id === id)?.nombre || 'Jugador Desconocido';
    };

    return (
        <div className={styles.container}>
            <Link href={`/historia/${partido.anio}`} className={styles.backLink}>
                <ArrowLeft size={20} /> Volver a {partido.anio}
            </Link>

            <div className={styles.header}>
                <div className={styles.scoreBoard}>
                    <div className={styles.team}>
                        <span className={styles.teamName}>Argentino Oeste</span>
                    </div>
                    <div className={styles.score}>
                        {partido.golesFavor} - {partido.golesContra}
                    </div>
                    <div className={styles.team}>
                        <span className={styles.teamName}>{partido.rival}</span>
                    </div>
                </div>
                <div className={styles.metaData}>
                    <span><Calendar size={16} /> {new Date(partido.fecha).toLocaleDateString()}</span>
                    <span><MapPin size={16} /> {partido.cancha} - {partido.estadio}</span>
                    <span><Trophy size={16} /> {partido.torneo}</span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Goles</h2>
                    {partido.goleadores && partido.goleadores.length > 0 ? (
                        <ul className={styles.goalsList}>
                            {partido.goleadores.map((g, index) => (
                                <li key={index} className={styles.goalItem}>
                                    <span className={styles.minute}>{g.minuto}'</span>
                                    <span className={styles.scorer}>{getNombreJugador(g.idJugador)}</span>
                                    {g.tipo && <span className={styles.goalType}>({g.tipo})</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        partido.golesFavor > 0 ? <p>Sin información de goleadores.</p> : <p>Sin goles a favor.</p>
                    )}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Cuerpo Técnico y Autoridades</h2>
                    <div className={styles.staffGrid}>
                        <div className={styles.staffItem}>
                            <span className={styles.staffLabel}>Director Técnico</span>
                            <span className={styles.staffValue}><User size={18} /> {partido.tecnico}</span>
                        </div>
                        <div className={styles.staffItem}>
                            <span className={styles.staffLabel}>Árbitro</span>
                            <span className={styles.staffValue}><Users size={18} /> {partido.arbitro}</span>
                        </div>
                    </div>
                </div>

                {partido.alineacion && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Alineación</h2>
                        <ul className={styles.playerList}>
                            {partido.alineacion.map(id => (
                                <li key={id}>{getNombreJugador(id)}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
