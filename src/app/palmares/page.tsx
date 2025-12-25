import styles from './palmares.module.css';
import VintageTrophy from '../../components/Palmares/VintageTrophy';

export default function PalmaresPage() {
    const trofeos = [
        { nombre: "Torneo", anio: "1958" },
        { nombre: "Torneo", anio: "1985" },
        { nombre: "Torneo", anio: "1986" },
        { nombre: "Torneo", anio: "1989" },
        { nombre: "Torneo Apertura", anio: "1992" },
        { nombre: "Torneo Clausura", anio: "1992" },
        { nombre: "Torneo Clausura", anio: "1996" },
        { nombre: "Torneo Clausura", anio: "2019" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Sala de Trofeos</h1>
                <p className={styles.subtitle}>Orgullo y gloria de nuestra institución</p>
            </header>

            <div className={styles.cabinetGrid}>
                {trofeos.map((trofeo, index) => (
                    <div key={index} className={styles.trophyCard}>
                        <div className={styles.iconWrapper}>
                            <VintageTrophy
                                size={64}
                                className={styles.trophyIcon}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.trophyName}>{trofeo.nombre}</span>
                            <div className={styles.separator}></div>
                            <span className={styles.trophyYear}>{trofeo.anio}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
