import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import Button from '@/components/ui/Button';
import styles from './page.module.css';
import { getNotas, getLatestLeyendas } from '@/lib/db';
import { urlFor } from '@/sanity/lib/image';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  const notas = await getNotas();
  const latestLeyendas = await getLatestLeyendas();
  const [notaPrincipal, ...otrasNotas] = notas;

  return (
    <div className={styles.main}>
      {notaPrincipal && (
        <section className={`${styles.hero} ${(notaPrincipal.imagenPortada || notaPrincipal.imagen) ? styles.hasImage : styles.noImage}`}>
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
          {/* Only render image column if image exists */}
          {(notaPrincipal.imagenPortada || notaPrincipal.imagen) && (
            <div className={styles.heroImage}>
              <div className={styles.heroImageContainer}>
                {(() => {
                  const img = notaPrincipal.imagenPortada || notaPrincipal.imagen;
                  return img && (
                    <Image
                      src={urlFor(img).height(800).url()}
                      alt={notaPrincipal.titulo}
                      width={800}
                      height={600}
                      className={styles.featuredImage}
                      priority
                    />
                  );
                })()}
              </div>
              {(() => {
                const epigrafe = notaPrincipal.imagenPortada?.epigrafe || notaPrincipal.imagen?.epigrafe;
                return epigrafe && <p className={styles.imageCaption}>{epigrafe}</p>;
              })()}
            </div>
          )}
        </section>
      )}

      {/* ÚLTIMAS NOTICIAS GRID */}
      {otrasNotas.length > 0 && (
        <section className={styles.newsSection}>
          <h2 className={styles.centeredTitle}>
            Últimas Noticias
          </h2>
          <div className={styles.grid}>
            {otrasNotas.map((nota) => (
              <div key={nota._id} className={styles.card}>
                {(() => {
                  const img = nota.imagenPortada || nota.imagen;
                  return img && (
                    <div className={styles.cardImageContainer}>
                      <Image
                        src={urlFor(img).width(400).height(300).url()}
                        alt={nota.titulo}
                        fill
                        className={styles.cardImage}
                      />
                    </div>
                  );
                })()}
                <h3 className={styles.cardTitle}>{nota.titulo}</h3>
                <p className={`${styles.cardText} ${styles.cardExcerpt}`}>
                  {nota.bajada}
                </p>
                {nota.slug?.current && (
                  <Link href={`/nota/${nota.slug.current}`} className={styles.readMore}>
                    LEER MÁS &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ÚLTIMAS LEYENDAS GRID */}
      {latestLeyendas && latestLeyendas.length > 0 && (
        <section className={styles.newsSection}>
          <h2 className={styles.centeredTitle}>
            Nuevas Leyendas en el Salón de la Fama
          </h2>
          <div className={styles.grid}>
            {latestLeyendas.map((leyenda) => (
              <div key={leyenda._id} className={styles.card}>
                <h3 className={styles.cardTitle}>{leyenda.nombre}</h3>
                <p className={`${styles.cardText} ${styles.cardExcerpt}`}>
                  {leyenda.bio}
                </p>
                {leyenda.slug?.current && (
                  <Link href={`/leyendas/${leyenda.slug.current}`} className={styles.readMore}>
                    VER PERFIL &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECCIONES / ACCESOS RÁPIDOS (Static) */}
      <section className={`${styles.grid} ${styles.quickAccessSection}`}>
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
