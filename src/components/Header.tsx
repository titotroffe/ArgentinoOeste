'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fechaHoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className={styles.mastheadWrapper}>
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <span className={styles.hideMobile}>San Nicolás de los Arroyos</span>
                        <span className={styles.hideMobile}>{fechaHoy}</span>
                        <span className={styles.hideMobile}>Ed. Digital n° 1</span>
                    </div>

                    <div className={styles.masthead}>
                        <Link href="/" className={styles.logoTitle}>
                            Argentino Oeste
                        </Link>
                        <div className={styles.logoSubtitle}>La Gaceta de la Estación</div>
                    </div>
                </div>
            </div>

            {/* Desktop Navbar */}
            <nav className={`${styles.navbar} ${styles.desktopNav}`}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.navLink}>Portada</Link>
                    <Link href="/hemeroteca" className={styles.navLink}>Hemeroteca</Link>
                    <Link href="/buscador" className={styles.navLink}>Archivo</Link>
                    <Link href="/leyendas" className={styles.navLink}>Leyendas</Link>
                    <Link href="/palmares" className={styles.navLink}>Palmarés</Link>
                    <Link href="/asociate" className={`${styles.navLink} ${styles.highlightLink || ''}`} style={{ color: 'var(--club-green)', fontWeight: 'bold' }}>Hacete Socio</Link>
                </div>
            </nav>

            {/* Mobile Navbar Header - Sticky */}
            <div className={styles.mobileNavHeader}>
                <button onClick={toggleMenu} className={styles.mobileMenuBtn} aria-label="Menu">
                    <Menu size={28} />
                </button>

                <span className={styles.mobileHeaderTitle}>La Gaceta de la Estación</span>

                {isMenuOpen ? (
                    <button onClick={toggleMenu} className={styles.mobileMenuBtn} aria-label="Close">
                        <X size={28} />
                    </button>
                ) : (
                    <div style={{ width: '28px' }}></div> /* Spacer to keep title centered */
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className={styles.mobileMenuOverlay}>
                    <nav className={styles.mobileNav}>
                        <Link href="/" className={styles.mobileNavLink} onClick={toggleMenu}>Portada</Link>
                        <Link href="/hemeroteca" className={styles.mobileNavLink} onClick={toggleMenu}>Hemeroteca</Link>
                        <Link href="/buscador" className={styles.mobileNavLink} onClick={toggleMenu}>Archivo</Link>
                        <Link href="/leyendas" className={styles.mobileNavLink} onClick={toggleMenu}>Leyendas</Link>
                        <Link href="/palmares" className={styles.mobileNavLink} onClick={toggleMenu}>Palmarés</Link>
                        <Link href="/asociate" className={styles.mobileNavLink} onClick={toggleMenu} style={{ color: 'var(--club-green)', fontWeight: 'bold' }}>Hacete Socio</Link>
                    </nav>
                </div>
            )}
        </>
    );
}
