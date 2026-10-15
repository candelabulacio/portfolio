// Caso de estudio: MalvinizAR.
// estado: 'real' (trabajo realizado), 'conceptual' (ejercicio propio, no para un cliente)
//         o 'reservado' (espacio para un proyecto futuro; no tiene página).

export default {
  slug: 'malvinizar',
  estado: 'real',
  tipo: 'Proyecto académico',
  titulo: 'MalvinizAR',
  categorias: ['diseno-web', 'comunicacion-marketing'],
  bajada: 'Sitio web educativo sobre la memoria histórica de Malvinas.',
  anio: '[COMPLETAR: año]',
  rol: '[COMPLETAR: tu rol, por ejemplo comunicación digital y desarrollo web]',
  equipo: '[COMPLETAR: si fue individual o en equipo, y con quiénes]',

  // Portada. Mientras no haya imagen se usa una portada tipográfica.
  portada: null, // ej. 'img/proyectos/malvinizar/portada.jpg'
  portadaAlt: 'Captura de la portada del sitio MalvinizAR',

  enlaces: [
    { nombre: 'Ver el sitio', url: 'https://malvinizar.github.io/malvinizar/' },
    { nombre: 'Ver el repositorio', url: 'https://github.com/malvinizar/malvinizar' },
  ],

  herramientas: ['GitHub Pages', '[COMPLETAR: otras herramientas]'],

  // Secciones del caso. Cada una admite varios párrafos.
  secciones: {
    contexto: [
      'MalvinizAR es un proyecto educativo de comunicación digital que busca acercar la memoria histórica de Malvinas a través de un sitio web.',
      '[COMPLETAR: en qué materia o marco surgió y cuál era el desafío]',
    ],
    objetivos: ['[COMPLETAR: qué tenía que lograr el sitio]'],
    alcance: ['[COMPLETAR: qué partes hiciste vos (contenido, organización de la información, desarrollo, diseño)]'],
    concepto: ['[COMPLETAR: idea central del proyecto]'],
    proceso: ['[COMPLETAR: cómo trabajaron, de la investigación a la publicación]'],
    decisiones: [
      'El sitio se desarrolló sobre una identidad visual existente: el trabajo consistió en respetarla y adaptarla al formato web.',
      '[COMPLETAR: decisiones de estructura, navegación o tono que tomaste]',
    ],
    resultado: ['El sitio está publicado y accesible en GitHub Pages.', '[COMPLETAR: qué quedó resuelto]'],
    aprendizajes: ['[COMPLETAR: qué aprendiste y resultados verificables, si los hay]'],
  },

  // Galería: imágenes en public/img/proyectos/malvinizar/
  galeria: [
    // { src: 'img/proyectos/malvinizar/home.jpg', alt: 'Página de inicio', epigrafe: 'Inicio del sitio' },
  ],
};
