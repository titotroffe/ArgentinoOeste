'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../../app/asociate/asociate.module.css';
import logo from '../../img/Escudos/ArgOeste.png';
import sello from '../../img/sello.png';

interface MembershipCardProps {
    name: string;
    photoUrl: string | null;
}

export default function MembershipCard({ name, photoUrl }: MembershipCardProps) {
    return (
        <div className={styles.cardPreview}>
            <div className={styles.bookWrapper}>

                {/* RIGHT PAGE (Base - Inside Right) - Vintage ID Card */}
                <div className={styles.pageRight}>
                    <div className={styles.paperInsert}>
                        {/* Header */}
                        <div className={styles.vintageHeader}>Club A. Argentino Oeste</div>
                        <div className={styles.vintageSubHeader}>SAN NICOLAS</div>

                        {/* Member Data - Name */}
                        <div className={styles.vintageDataRow}>
                            <span className={styles.vintageLabel}>Señor:</span>
                            <span className={styles.elegantName}>
                                {name || 'Tu Nombre'}
                            </span>
                        </div>

                        {/* Centered Circular Photo */}
                        <div className={styles.vintagePhotoFrame}>
                            {photoUrl ? (
                                <img src={photoUrl} alt="Foto Socio" className={styles.memberPhoto} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>
                            )}
                        </div>

                        {/* Stamps - Left and Right */}
                        <div className={styles.stampLeft}>
                            <Image src={sello} alt="Sello" style={{ width: '100%', height: 'auto' }} />
                        </div>
                        <div className={styles.stampRight}>
                            <Image src={sello} alt="Sello" style={{ width: '100%', height: 'auto' }} />
                        </div>

                        {/* Signatures / Authority */}
                        <div style={{
                            marginTop: 'auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '0.5rem',
                            position: 'relative',
                            zIndex: 2,
                            width: '100%'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: 'var(--font-script)',
                                    color: '#000080',
                                    fontSize: '1.6rem',
                                    transform: 'rotate(0deg)',
                                    marginBottom: '-5px'
                                }}>
                                    Perez
                                </div>
                                <div style={{
                                    borderTop: '1px solid #333',
                                    width: '80px',
                                    margin: '0 auto',
                                    paddingTop: '2px',
                                    fontSize: '0.6rem',
                                    fontFamily: 'Courier New',
                                    textTransform: 'uppercase'
                                }}>
                                    Secretario
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: 'var(--font-script)',
                                    color: '#000080',
                                    fontSize: '1.6rem',
                                    transform: 'rotate(0deg)',
                                    marginBottom: '-5px'
                                }}>
                                    Garcia
                                </div>
                                <div style={{
                                    borderTop: '1px solid #333',
                                    width: '80px',
                                    margin: '0 auto',
                                    paddingTop: '2px',
                                    fontSize: '0.6rem',
                                    fontFamily: 'Courier New',
                                    textTransform: 'uppercase'
                                }}>
                                    Presidente
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COVER PAGE (Rotates 180deg) */}
                <div className={styles.coverPage}>

                    {/* FRONT FACE (Closed Cover) - Leather & Gold */}
                    <div className={styles.front}>

                        {/* Unified SVG for all Text to ensure identical styling */}
                        <svg width="100%" height="100%" viewBox="0 0 260 300" style={{ overflow: 'visible', maxWidth: '100%', maxHeight: '100%' }}>
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#fff8db" /> {/* Very light gold highlight */}
                                    <stop offset="50%" stopColor="#ffd700" /> {/* Standard Gold */}
                                    <stop offset="100%" stopColor="#ffb700" /> {/* Deep Gold */}
                                </linearGradient>
                            </defs>

                            {/* Curved Top Text - Reverted to original curve as requested */}
                            <path id="curve" d="M 35,145 Q 130,10 225,145" fill="transparent" />
                            <text className={styles.embossedText} style={{ fill: 'url(#goldGradient)', fontFamily: '"Arial Narrow", "Arial", sans-serif', fontWeight: 'bold', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                                    Club Atlético
                                </textPath>
                            </text>

                            {/* Separator Dot 1 */}
                            <text x="50%" y="125" textAnchor="middle" className={styles.embossedText} style={{ fill: 'url(#goldGradient)', fontFamily: '"Arial Narrow", "Arial", sans-serif', fontWeight: 'bold', fontSize: '20px' }}>
                                •
                            </text>

                            {/* Middle Text: Argentino Oeste */}
                            <text
                                x="50%"
                                y="108"
                                transform="scale(1, 1.5)"
                                textAnchor="middle"
                                className={styles.embossedText}
                                style={{
                                    fill: 'url(#goldGradient)',
                                    fontFamily: '"Arial Narrow", "Arial", sans-serif',
                                    fontWeight: 'bold',
                                    fontSize: '24px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0px'
                                }}>
                                Argentino Oeste
                            </text>

                            {/* Separator Dot 2 */}
                            <text x="50%" y="180" textAnchor="middle" className={styles.embossedText} style={{ fill: 'url(#goldGradient)', fontFamily: '"Arial Narrow", "Arial", sans-serif', fontWeight: 'bold', fontSize: '20px' }}>
                                •
                            </text>

                            {/* Bottom Text: San Nicolás */}
                            <text x="50%" y="200" textAnchor="middle" className={styles.embossedText} style={{ fill: 'url(#goldGradient)', fontFamily: '"Arial Narrow", "Arial", sans-serif', fontWeight: 'bold', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                                San Nicolás
                            </text>
                        </svg>
                    </div>


                    {/* BACK FACE (Inside Left) */}
                    <div className={styles.back} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className={styles.paperInsert} style={{ transform: 'rotate(-90deg)', width: '300px', height: '200px', position: 'relative', padding: '5px', boxSizing: 'border-box' }}>
                            <div style={{ border: '3px dashed #333', width: '100%', height: '100%', position: 'relative', padding: '8px', boxSizing: 'border-box' }}>

                                {/* Header: CLUB ARGENTINO OESTE */}
                                <div style={{ textAlign: 'center', borderBottom: '2px solid #333', marginBottom: '0.5rem', paddingBottom: '0.2rem' }}>
                                    <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase', color: '#000', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                                        Club Argentino Oeste
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem', position: 'relative', zIndex: 2 }}>
                                    <span className={styles.vintageHeader} style={{ fontSize: '1rem', borderBottom: 'none', margin: 0, whiteSpace: 'nowrap' }}>Socio Activo</span>
                                    <span className={styles.vintageHeader} style={{ fontSize: '1rem', borderBottom: 'none', margin: 0, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                                        {new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase().replace(' DE ', ' ')}
                                    </span>
                                </div>

                                <div className={styles.vintageDataRow} style={{ position: 'relative', zIndex: 2, justifyContent: 'center' }}>
                                    <span className={styles.vintageLabel}>Sr</span>
                                    <span className={styles.elegantName} style={{ fontSize: '1.6rem', borderBottom: '2px dotted #555' }}>
                                        {name || 'Nombre Apellido'}
                                    </span>
                                </div>

                                <div className={styles.vintageDataRow} style={{ position: 'relative', zIndex: 2, justifyContent: 'center' }}>
                                    <span className={styles.vintageLabel}>Cuota $</span>
                                    <span className={styles.vintageValue}>30</span>
                                </div>

                                {/* Stamp Overlay - Centered and much lower */}
                                <div className={styles.stampRight} style={{ position: 'absolute', bottom: '-57%', left: '50%', transform: 'translateX(-50%) rotate(12deg)', right: 'auto', pointerEvents: 'none' }}>
                                    <Image src={sello} alt="Sello" style={{ width: '100%', height: 'auto' }} />
                                </div>

                                {/* Tesorero Signature */}
                                <div style={{ marginTop: 'auto', textAlign: 'center', alignSelf: 'center', width: '100%', paddingBottom: '0', position: 'absolute', bottom: '10px', left: 0, zIndex: 2 }}>
                                    <div style={{
                                        fontFamily: 'var(--font-script)',
                                        color: '#000080',
                                        fontSize: '1.6rem',
                                        transform: 'rotate(0deg)',
                                        marginBottom: '0px',
                                        display: 'inline-block'
                                    }}>
                                        Reynoso
                                    </div>
                                    <div style={{
                                        borderTop: '1px solid #333',
                                        width: '120px',
                                        margin: '0 auto',
                                        paddingTop: '2px',
                                        fontSize: '0.7rem',
                                        fontFamily: 'Courier New',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        color: '#000'
                                    }}>
                                        Tesorero
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
