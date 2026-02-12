import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import styles from './page.module.css';
import { getLeyendas } from '@/lib/db';
import { urlFor } from '@/sanity/lib/image';

export const revalidate = 60;

export default async function LeyendasPage() {
    const leyendas = await getLeyendas();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Salón de la Fama</h1>
                <p className={styles.subtitle}>
                    Homenaje a quienes escribieron las páginas doradas de nuestra institución.
                </p>
            </header>


            <div className={styles.grid}>
                {leyendas.map((leyenda) => (
                    <Link href={`/leyendas/${leyenda.slug?.current}`} key={leyenda._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.card}>
                            <div className={styles.photoFrame}>
                                {leyenda.imagen ? (
                                    <Image
                                        src={urlFor(leyenda.imagen).width(400).height(400).url()}
                                        alt={leyenda.nombre}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                        <span>Sin foto</span>
                                    </div>
                                )}
                            </div>
                            <h2 className={styles.name}>{leyenda.nombre}</h2>
                            <div className={styles.role}>
                                {leyenda.roles && leyenda.roles.length > 0
                                    ? leyenda.roles.map(r => r === 'DT' ? 'Director Técnico' : r).join(' - ')
                                    : leyenda.rol} { /* Fallback to old field if roles empty */}
                                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>({leyenda.periodo})</div>
                            </div>
                            <p className={styles.bio}>{leyenda.bio}</p>
                            <div className={styles.stats}>
                                {/* Player Stats - Show if role includes Jugador OR if no DT role (fallback for old data) */}
                                {(leyenda.roles?.includes('Jugador') || (!leyenda.roles?.includes('DT') && !leyenda.rol?.includes('Técnico') && !leyenda.rol?.includes('DT'))) && (
                                    <>
                                        {leyenda.partidos !== undefined && (
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{leyenda.partidos}</span>
                                                <span className={styles.statValue}>PJ</span>
                                            </div>
                                        )}
                                        {leyenda.goles !== undefined && (
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{leyenda.goles}</span>
                                                <span className={styles.statValue}>Goles</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                {/* Coach Stats - Only show if role includes DT */}
                                {(leyenda.roles?.includes('DT') || leyenda.rol?.includes('Técnico') || leyenda.rol?.includes('DT')) && (
                                    <>
                                        {leyenda.partidosDirigidos !== undefined && (
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{leyenda.partidosDirigidos}</span>
                                                <span className={styles.statValue}>PD</span>
                                            </div>
                                        )}
                                        {leyenda.ganados !== undefined && (
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{leyenda.ganados}</span>
                                                <span className={styles.statValue}>PG</span>
                                            </div>
                                        )}
                                        {leyenda.empatados !== undefined && (
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{leyenda.empatados}</span>
                                                <span className={styles.statValue}>PE</span>
                                            </div>
                                        )}
                                        {leyenda.perdidos !== undefined && (
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{leyenda.perdidos}</span>
                                                <span className={styles.statValue}>PP</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link href="/">
                    <Button variant="outline">Volver a la Portada</Button>
                </Link>
            </div>
        </div>
    );
}
