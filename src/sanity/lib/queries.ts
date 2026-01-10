import { defineQuery } from "next-sanity";

export const NOTAS_QUERY = defineQuery(`
  *[_type == "nota"] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    fecha,
    bajada,
    categoria,
    autor,
    imagenPortada {
        asset->{
            _id,
            url
        },
        hotspot,
        epigrafe
    },
    imagen {
        asset->{
            _id,
            url
        },
        epigrafe
    },
    cuerpo,
    detallesPartido
  }
`);

export const NOTA_BY_ID_QUERY = defineQuery(`
  *[_type == "nota" && (_id == $id || slug.current == $id)][0] {
    _id,
    titulo,
    slug,
    fecha,
    bajada,
    categoria,
    autor,
    imagenPortada {
        asset->{
            _id,
            url
        },
        hotspot,
        epigrafe
    },
    imagen {
        asset->{
            _id,
            url
        },
        epigrafe
    },
    cuerpo,
    detallesPartido
  }
`);

export const LEYENDAS_QUERY = defineQuery(`

  *[_type == "leyenda"] | order(nombre asc) {
    _id,
    nombre,
    slug,
    roles,
    rol,
    periodo,
    partidos,
    goles,
    bio,
    imagen {
        asset->{
            _id,
            url
        },
        alt
    }
  }
`);

export const LEYENDA_BY_SLUG_QUERY = defineQuery(`
  *[_type == "leyenda" && slug.current == $slug][0] {
    _id,
    nombre,
    slug,
    roles,
    rol,
    periodo,
    partidos,
    goles,
    bio,
    bioCompleta,
    imagen {
        asset->{
            _id,
            url,
            metadata {
                dimensions {
                    width,
                    height
                }
            }
        },
        alt
    }
  }
`);
