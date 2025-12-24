import styles from './palmares.module.css';
import { Star } from 'lucide-react';

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

    // Helper para dividir en estantes (chunks de 3)
    const shelves = [];
    for (let i = 0; i < trofeos.length; i += 3) {
        shelves.push(trofeos.slice(i, i + 3));
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Sala de Trofeos</h1>
                <p className={styles.subtitle}>Orgullo y gloria de nuestra institución</p>
            </header>

            <div className={styles.cabinetContainer}>

                {shelves.map((shelf, shelfIndex) => (
                    <div key={shelfIndex} className={styles.shelf}>
                        {shelf.map((trofeo, index) => (
                            <div key={index} className={styles.trophyWrapper}>
                                <Star
                                    size={80}
                                    strokeWidth={1}
                                    className={styles.trophyIcon}
                                    aria-label={`Trofeo ${trofeo.nombre} ${trofeo.anio}`}
                                />
                                <div className={styles.plaque}>
                                    <span className={styles.trophyName}>{trofeo.nombre}</span>
                                    <span className={styles.trophyYear}>{trofeo.anio}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
