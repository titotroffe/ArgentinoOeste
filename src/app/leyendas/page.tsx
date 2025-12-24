import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

// Datos Mock de Leyendas (después mover a mock-data.ts si es necesario)
const leyendas = [
    {
        id: 1,
        nombre: "Juan 'La Fiera' Rodríguez",
        rol: "Delantero Centro",
        periodo: "1978 - 1985",
        partidos: 184,
        goles: 97,
        bio: "El máximo goleador histórico del club. Conocido por su potente remate de derecha y su capacidad para definir en los momentos clave. Lideró al equipo al campeonato del 82.",
        imagen: "" // Placeholder
    },
    {
        id: 2,
        nombre: "Roberto 'El Muro' Sánchez",
        rol: "Defensor Central",
        periodo: "1990 - 2001",
        partidos: 312,
        goles: 12,
        bio: "Capitán indiscutido durante la década de los 90. Un líder nato dentro y fuera de la cancha. Su entrega y coraje inspiraron a toda una generación de defensores.",
        imagen: ""
    },
    {
        id: 3,
        nombre: "Carlos Bianchi (No el Virrey)",
        rol: "Director Técnico",
        periodo: "1980 - 1984",
        partidos: 150,
        goles: 0,
        bio: "El arquitecto del equipo campeón. Revolucionó el fútbol local con sus tácticas innovadoras y su enfoque en la disciplina física.",
        imagen: ""
    }
];

export default function LeyendasPage() {
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
                    <div key={leyenda.id} className={styles.card}>
                        <div className={styles.photoFrame}>
                            {/* Imágen simulada */}
                        </div>
                        <h2 className={styles.name}>{leyenda.nombre}</h2>
                        <div className={styles.role}>{leyenda.rol} ({leyenda.periodo})</div>
                        <p className={styles.bio}>{leyenda.bio}</p>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>{leyenda.partidos}</span>
                                <span className={styles.statValue}>PJ</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>{leyenda.goles}</span>
                                <span>Goles</span>
                            </div>
                        </div>
                    </div>
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
