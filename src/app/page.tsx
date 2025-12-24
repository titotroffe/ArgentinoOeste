import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import Button from '@/components/ui/Button';
import styles from './page.module.css';
import { getNotas } from '@/lib/db';
import { urlFor } from '@/sanity/lib/image';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  const notas = await getNotas();
  const [notaPrincipal, ...otrasNotas] = notas;

  return (
    <div className={styles.main}>
      {/* HERO SECTION: Nota Principal (Más reciente) */}
      {notaPrincipal && (
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{notaPrincipal.titulo}</h1>
            <p className={styles.subtitle}>
              {notaPrincipal.bajada}
            </p>
            <div className={styles.ctaGroup}>
              {notaPrincipal.slug?.current ? (
                <Link href={`/nota/${notaPrincipal.slug.current}`}>
                  <Button size="lg" variant="primary">LEER NOTA</Button>
                </Link>
              ) : (
                <Button size="lg" variant="primary" disabled>LEER NOTA</Button>
              )}
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageContainer}>
              {(() => {
                const img = notaPrincipal.imagenPortada || notaPrincipal.imagen;
                return img ? (
                  <Image
                    src={urlFor(img).height(800).url()} // Fetch higher res for height
                    alt={notaPrincipal.titulo}
                    width={800} // Aspect ratio placeholder
                    height={600}
                    style={{ width: 'auto', height: '400px', maxWidth: '100%', objectFit: 'contain' }}
                    priority
                  />
                ) : (
                  <div style={{ width: '300px', height: '400px', backgroundColor: '#555' }}></div>
                );
              })()}
            </div>
            {(() => {
              const epigrafe = notaPrincipal.imagenPortada?.epigrafe || notaPrincipal.imagen?.epigrafe;
              return epigrafe && <p className={styles.imageCaption}>{epigrafe}</p>;
            })()}
          </div>
        </section>
      )}

      {/* ÚLTIMAS NOTICIAS GRID */}
      {otrasNotas.length > 0 && (
        <section className={styles.grid}>
          <h2 style={{ width: '100%', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', fontSize: '2rem', textTransform: 'uppercase' }}>
            Últimas Noticias
          </h2>
          {otrasNotas.map((nota) => (
            <div key={nota._id} className={styles.card}>
              {(() => {
                const img = nota.imagenPortada || nota.imagen;
                return img && (
                  <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '1rem', borderRadius: '4px', overflow: 'hidden' }}>
                    <Image
                      src={urlFor(img).width(400).height(300).url()}
                      alt={nota.titulo}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                );
              })()}
              <h3 className={styles.cardTitle}>{nota.titulo}</h3>
              <p className={styles.cardText} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {nota.bajada}
              </p>
              {nota.slug?.current && (
                <Link href={`/nota/${nota.slug.current}`} className={styles.readMore}>
                  LEER MÁS &rarr;
                </Link>
              )}
            </div>
          ))}
        </section>
      )}

      {/* SECCIONES / ACCESOS RÁPIDOS (Static) */}
      <section className={styles.grid} style={{ marginTop: '3rem', borderTop: '1px solid var(--border-thin)', paddingTop: '3rem' }}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Navegar por la Historia</h3>
          <p className={styles.cardText}>
            Consulte nuestra hemeroteca digital temporada por temporada. Reviva cada partido, cada gol y cada emoción.
          </p>
          <Link href="/historia/2023" className={styles.readMore}>
            IR A LA HEMEROTECA &rarr;
          </Link>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Archivo de Estadísticas</h3>
          <p className={styles.cardText}>
            Base de datos completa de rivales, árbitros y canchas. Busque información específica en nuestros registros.
          </p>
          <Link href="/buscador" className={styles.readMore}>
            CONSULTAR ARCHIVO &rarr;
          </Link>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Leyendas del Club</h3>
          <p className={styles.cardText}>
            Homenaje a los grandes jugadores que vistieron nuestra camiseta. Perfiles, fotos y anécdotas.
          </p>
          <Link href="/leyendas" className={styles.readMore}>
            VER LEYENDAS &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
