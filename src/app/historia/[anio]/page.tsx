import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trophy, Users, ShieldAlert } from 'lucide-react';
import { historiaAnual, partidos } from '@/data/mock-data';
import styles from './page.module.css';

interface PageProps {
    params: {
        anio: string;
    };
}

export async function generateStaticParams() {
    return historiaAnual.map((h) => ({
        anio: h.anio.toString(),
    }));
}

export default async function HistoriaAnioPage(props: { params: Promise<{ anio: string }> }) {
    const params = await props.params;
    const anio = parseInt(params.anio);
    const datosAnio = historiaAnual.find((h) => h.anio === anio);
    const partidosAnio = partidos.filter((p) => p.anio === anio);

    if (!datosAnio) {
        return (
            <div className={styles.container}>
                <h1>Año no encontrado</h1>
                <Link href="/">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>
                <ArrowLeft size={20} /> Volver al Inicio
            </Link>

            <header className={styles.header}>
                <h1 className={styles.title}>Temporada {anio}</h1>
                <p className={styles.description}>{datosAnio.historia}</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Posición</span>
                    <span className={styles.statValue}>
                        <Trophy size={24} className={styles.iconGold} /> {datosAnio.posicion}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Partidos</span>
                    <span className={styles.statValue}>{datosAnio.jugados}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Goles a Favor</span>
                    <span className={styles.statValue}>{datosAnio.golesFavor}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Goles en Contra</span>
                    <span className={styles.statValue}>{datosAnio.golesContra}</span>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Partidos</h2>
            <div className={styles.matchesList}>
                {partidosAnio.map((partido) => (
                    <div key={partido.id} className={styles.matchCard}>
                        <div className={styles.matchDate}>
                            {new Date(partido.fecha).toLocaleDateString()}
                        </div>
                        <div className={styles.matchContent}>
                            <div className={styles.team}>Argentino Oeste</div>
                            <div className={styles.score}>
                                {partido.golesFavor} - {partido.golesContra}
                            </div>
                            <div className={styles.team}>{partido.rival}</div>
                        </div>
                        <div className={styles.matchFooter}>
                            <span>{partido.cancha}</span>
                            {partido.torneo && <span> • {partido.torneo}</span>}
                            <Link href={`/partido/${partido.id}`} className={styles.matchLink}>
                                Ver Detalle &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
                {partidosAnio.length === 0 && (
                    <p>No hay partidos registrados para este año.</p>
                )}
            </div>
        </div>
    );
}
