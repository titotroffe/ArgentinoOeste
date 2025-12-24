import Link from 'next/link';
import styles from './hemeroteca.module.css';
import { getNotas } from '@/lib/db';

// Configuración
const ITEMS_PER_PAGE = 6;

export default async function HemerotecaPage(props: { searchParams: Promise<{ page?: string }> }) {
    const notas = await getNotas();
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams.page) || 1;

    // Calcular índices
    const indexOfLastNote = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstNote = indexOfLastNote - ITEMS_PER_PAGE;
    const currentNotes = notas.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(notas.length / ITEMS_PER_PAGE);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Hemeroteca</h1>
                <p className={styles.subtitle}>Archivo digital de noticias y crónicas históricas</p>
            </div>

            <div className={styles.grid}>
                {currentNotes.map((nota) => (
                    <article key={nota._id} className={styles.card}>
                        <span className={styles.cardCategory}>{nota.categoria || 'Archivo'}</span>
                        <Link href={`/nota/${nota._id}`}>
                            <h2 className={styles.cardTitle}>{nota.titulo}</h2>
                        </Link>
                        <p className={styles.cardExcerpt}>{nota.bajada}</p>
                        <div className={styles.cardFooter}>
                            <span className={styles.date}>{nota.fecha}</span>
                            <Link href={`/nota/${nota._id}`} className={styles.readMore}>
                                Leer Nota
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {/* Paginación */}
            <div className={styles.pagination}>
                {/* Botón Anterior */}
                {currentPage > 1 ? (
                    <Link href={`/hemeroteca?page=${currentPage - 1}`} className={styles.pageLink}>
                        &larr; Anterior
                    </Link>
                ) : (
                    <span className={`${styles.pageLink} ${styles.disabledPage}`}>&larr; Anterior</span>
                )}

                {/* Números de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <Link
                        key={number}
                        href={`/hemeroteca?page=${number}`}
                        className={`${styles.pageLink} ${currentPage === number ? styles.activePage : ''}`}
                    >
                        {number}
                    </Link>
                ))}

                {/* Botón Siguiente */}
                {currentPage < totalPages ? (
                    <Link href={`/hemeroteca?page=${currentPage + 1}`} className={styles.pageLink}>
                        Siguiente &rarr;
                    </Link>
                ) : (
                    <span className={`${styles.pageLink} ${styles.disabledPage}`}>Siguiente &rarr;</span>
                )}
            </div>
        </div>
    );
}
