import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import Button from '@/components/ui/Button';
import styles from './page.module.css';
import sintesisStyles from './sintesis.module.css';
import { getNotaById } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

// En Next.js 15+, params es una Promise.
export default async function NotaPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const nota = await getNotaById(params.id);

    if (!nota) {
        notFound();
    }

    return (
        <article className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{nota.titulo}</h1>
                <p className={styles.bajada}>{nota.bajada}</p>

                <div className={styles.meta}>
                    <span>{formatDate(nota.fecha)}</span>
                    <span>{nota.autor || 'Archivo Histórico'}</span>
                </div>
            </header>

            <div className={styles.body}>
                <div className={styles.twoColumnText}>
                    {/* Imagen Flotada a la Derecha (Wrap) */}
                    <div className={styles.figure}>
                        <Image
                            src={nota.imagen ? urlFor(nota.imagen).width(800).height(450).url() : '/placeholder.svg'}
                            alt={nota.titulo}
                            width={800}
                            height={450}
                            style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            priority
                        />
                        {/* Mostrar solo el epígrafe si existe */}
                        {nota.imagen?.epigrafe && (
                            <p className={styles.figcaption}>{nota.imagen.epigrafe}</p>
                        )}
                    </div>

                    {/* Todo el Texto fluye alrededor */}
                    <PortableText
                        value={nota.cuerpo}
                        components={{
                            block: {
                                normal: ({ children }: any) => <p className="mb-4 leading-relaxed text-justify">{children}</p>,
                                h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-2 uppercase">{children}</h3>,
                            }
                        }}
                    />
                </div>
            </div>

            {nota.detallesPartido && (
                <>
                    <h3 className={sintesisStyles.sintesisTitle}>Síntesis</h3>
                    <div className={sintesisStyles.sintesisContainer}>
                        <div className={sintesisStyles.resultLabel}>RESULTADO</div>
                        <div className={sintesisStyles.resultBig}>
                            {nota.detallesPartido.resultado}
                        </div>

                        <div className={sintesisStyles.teamsGrid}>
                            {/* Local */}
                            <div className={sintesisStyles.teamColumn}>
                                <h4>{nota.detallesPartido.local.nombre}</h4>
                                <div className={sintesisStyles.dt}>DT: {nota.detallesPartido.local.dt}</div>

                                <div className={sintesisStyles.sectionTitle}>Titulares</div>
                                <ul className={sintesisStyles.playersList}>
                                    {nota.detallesPartido.local.titulares.map((p, i) => (
                                        <li key={i} className={sintesisStyles.playerRow}>
                                            <span>{p.nombre}</span>
                                            <div>
                                                {p.goles && <span className={sintesisStyles.goalMark}>(G) {p.goles > 1 ? `x${p.goles}` : ''}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className={sintesisStyles.sectionTitle}>Suplentes</div>
                                <ul className={sintesisStyles.playersList}>
                                    {nota.detallesPartido.local.suplentes.map((p, i) => (
                                        <li key={i} className={sintesisStyles.playerRow}>
                                            <span>{p.nombre}</span>
                                            <div>
                                                {p.goles && <span className={sintesisStyles.goalMark}>(G) {p.goles > 1 ? `x${p.goles}` : ''}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visitante */}
                            <div className={sintesisStyles.teamColumn}>
                                <h4>{nota.detallesPartido.visitante.nombre}</h4>
                                <div className={sintesisStyles.dt}>DT: {nota.detallesPartido.visitante.dt}</div>

                                <div className={sintesisStyles.sectionTitle}>Titulares</div>
                                <ul className={sintesisStyles.playersList}>
                                    {nota.detallesPartido.visitante.titulares.map((p, i) => (
                                        <li key={i} className={sintesisStyles.playerRow}>
                                            <span>{p.nombre}</span>
                                            <div>
                                                {p.goles && <span className={sintesisStyles.goalMark}>(G) {p.goles > 1 ? `x${p.goles}` : ''}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className={sintesisStyles.sectionTitle}>Suplentes</div>
                                <ul className={sintesisStyles.playersList}>
                                    {nota.detallesPartido.visitante.suplentes.map((p, i) => (
                                        <li key={i} className={sintesisStyles.playerRow}>
                                            <span>{p.nombre}</span>
                                            <div>
                                                {p.goles && <span className={sintesisStyles.goalMark}>(G) {p.goles > 1 ? `x${p.goles}` : ''}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={sintesisStyles.sintesisFooter}>
                            <span>Árbitro: {nota.detallesPartido.arbitro}</span>
                            <span>Cancha: {nota.detallesPartido.cancha}</span>
                        </div>
                    </div>
                </>
            )}

            <div className={styles.backButton}>
                <Link href="/">
                    <Button variant="outline">Volver a la Portada</Button>
                </Link>
            </div>
        </article>
    );
}
