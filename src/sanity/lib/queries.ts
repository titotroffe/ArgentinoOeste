import { defineQuery } from "next-sanity";

export const NOTAS_QUERY = defineQuery(`
  *[_type == "nota"] | order(fecha desc) {
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
