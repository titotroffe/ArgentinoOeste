
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getLeyendaBySlug } from '@/lib/db';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function LeyendaDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const leyenda = await getLeyendaBySlug(slug);

    if (!leyenda) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{leyenda.nombre}</h1>
                <div className={styles.role}>
                    {leyenda.roles && leyenda.roles.length > 0
                        ? leyenda.roles.map(r => r === 'DT' ? 'Director Técnico' : r).join(' - ')
                        : leyenda.rol}
                </div>
                <div style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{leyenda.periodo}</div>
            </header>

            {leyenda.imagen && (
                <div className={styles.mainImage}>
                    <Image
                        src={urlFor(leyenda.imagen).width(800).url()}
                        alt={leyenda.nombre}
                        width={800}
                        height={leyenda.imagen.asset.metadata?.dimensions
                            ? (800 / leyenda.imagen.asset.metadata.dimensions.width) * leyenda.imagen.asset.metadata.dimensions.height
                            : 800}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        priority
                    />
                </div>
            )}

            <div className={styles.statsGrid}>
                {/* Player Stats */}
                {(leyenda.roles?.includes('Jugador') || (!leyenda.roles?.includes('DT') && !leyenda.rol?.includes('Técnico') && !leyenda.rol?.includes('DT'))) && (
                    <>
                        {leyenda.partidos !== undefined && (
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Partidos</span>
                                <span className={styles.statValue}>{leyenda.partidos}</span>
                            </div>
                        )}
                        {leyenda.goles !== undefined && (
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Goles</span>
                                <span className={styles.statValue}>{leyenda.goles}</span>
                            </div>
                        )}
                    </>
                )}
                {/* Coach Stats */}
                {(leyenda.roles?.includes('DT') || leyenda.rol?.includes('Técnico') || leyenda.rol?.includes('DT')) && (
                    <>
                        {leyenda.partidosDirigidos !== undefined && (
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Partidos Dirigidos</span>
                                <span className={styles.statValue}>{leyenda.partidosDirigidos}</span>
                            </div>
                        )}
                        {leyenda.ganados !== undefined && (
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Ganados</span>
                                <span className={styles.statValue}>{leyenda.ganados}</span>
                            </div>
                        )}
                        {leyenda.empatados !== undefined && (
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Empatados</span>
                                <span className={styles.statValue}>{leyenda.empatados}</span>
                            </div>
                        )}
                        {leyenda.perdidos !== undefined && (
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Perdidos</span>
                                <span className={styles.statValue}>{leyenda.perdidos}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className={styles.bioSection}>
                {leyenda.bioCompleta ? (
                    <div className="prose prose-invert max-w-none">
                        <PortableText value={leyenda.bioCompleta} />
                    </div>
                ) : (
                    <p>{leyenda.bio}</p>
                )}
            </div>

            <div className={styles.backButtonContainer}>
                <Link href="/leyendas">
                    <Button variant="outline">Volver al Salón de la Fama</Button>
                </Link>
            </div>
        </div>
    );
}
