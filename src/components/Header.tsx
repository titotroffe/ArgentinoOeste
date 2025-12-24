'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fechaHoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <div className={styles.mastheadWrapper}>
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <span>San Nicolás de los Arroyos</span>
                        <span>{fechaHoy}</span>
                        <span>Ed. Digital n° 1</span>
                    </div>

                    <div className={styles.masthead}>
                        <Link href="/" className={styles.logoTitle}>
                            Argentino Oeste
                        </Link>
                        <div className={styles.logoSubtitle}>La Gaceta de la Estación</div>
                    </div>
                </div>
            </div>

            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.navLink}>Portada</Link>
                    <Link href="/hemeroteca" className={styles.navLink}>Hemeroteca</Link>
                    <Link href="/buscador" className={styles.navLink}>Archivo</Link>
                    <Link href="/leyendas" className={styles.navLink}>Leyendas</Link>
                    <Link href="/palmares" className={styles.navLink}>Palmarés</Link>
                    <Link href="/asociate" className={`${styles.navLink} ${styles.highlightLink || ''}`} style={{ color: 'var(--club-green)', fontWeight: 'bold' }}>Hacete Socio</Link>
                </div>
            </nav>
        </>
    );
}
