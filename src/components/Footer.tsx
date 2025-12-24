import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>Argentino Oeste</h3>
                    <p>Historia, pasión y estadísticas del club.</p>
                </div>
                <div className={styles.column}>
                    <h4>Enlaces</h4>
                    <ul>
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/historia/2023">Historia</a></li>
                        <li><a href="/buscador">Buscador</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h4>Contacto</h4>
                    <p>info@argentinooeste.com</p>
                    <p>San Nicolás, Buenos Aires</p>
                </div>
            </div>
            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} Club Argentino Oeste. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
