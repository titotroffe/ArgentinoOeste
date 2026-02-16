import React, { forwardRef } from 'react';
import styles from './vintage-card-pdf.module.css';

interface VintageCardPdfProps {
    name: string;
    photoUrl: string | null;
}

export const VintageCardPdf = forwardRef<HTMLDivElement, VintageCardPdfProps>(({ name, photoUrl }, ref) => {
    // Generate random carnet number for effect if not real
    const carnetNumber = Math.floor(1000 + Math.random() * 9000);

    // Split name
    const nameParts = name ? name.split(' ') : ['Nombre', 'Apellido'];
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');

    return (
        <div ref={ref} className={styles.sleeveWrapper} id="vintage-card-pdf">
            <div className={styles.pdfContainer}>
                {/* Watermark Logo */}
                <div className={styles.watermark}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/escudo.png" alt="Escudo" style={{ width: '100%', height: 'auto' }} />
                </div>

                <header className={styles.header}>
                    <span className={styles.titleTop}>Club Atlético</span>
                    <span className={styles.titleMain}>Argentino Oeste</span>
                    <div className={styles.subTitle}>Sede Social: Av. Moreno 20 - Tel. 23908 - 2900 San Nicolas</div>
                </header>

                <div className={styles.contentRow}>
                    <div className={styles.leftCol}>
                        <div className={styles.photoFrame}>
                            {photoUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={photoUrl} alt="Foto" className={styles.photo} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#eee' }}></div>
                            )}
                        </div>
                    </div>

                    <div className={styles.rightCol}>
                        <div className={styles.fieldRow} style={{ marginBottom: '2mm' }}>
                            <span className={styles.label}>Carnet Nº</span>
                            <div className={styles.dots}></div>
                            <span className={styles.carnetValue}>{carnetNumber}</span>
                        </div>

                        <div className={styles.fieldRow}>
                            <span className={styles.label}>Apellido</span>
                            <div className={styles.dots}></div>
                            <span className={styles.value}>{lastName || 'Apellido'}</span>
                        </div>
                        <div className={styles.fieldRow}>
                            <span className={styles.label}>Nombre</span>
                            <div className={styles.dots}></div>
                            <span className={styles.value}>{firstName || 'Nombre'}</span>
                        </div>
                        <div className={styles.fieldRow} style={{ marginBottom: '0' }}>
                            <span className={styles.label}>Categoría</span>
                            <div className={styles.dots}></div>
                            <span className={styles.value}>Activo</span>
                        </div>
                    </div>
                </div>

                {/* Stamp - Positioned centrally per CSS */}
                <div className={styles.stamp}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/sello.png" alt="Sello" style={{ width: '100%', height: 'auto' }} />
                </div>

                <div className={styles.signatures}>
                    <div className={styles.signatureBox}>
                        <div className={styles.signature}>Ezquerra</div>
                        <div className={styles.signatureLabel}>Tesorero</div>
                    </div>
                    <div className={styles.signatureBox}>
                        <div className={styles.signature}>Ernandorena</div>
                        <div className={styles.signatureLabel}>Sec. General</div>
                    </div>
                </div>
            </div>
        </div>
    );
});

VintageCardPdf.displayName = 'VintageCardPdf';
