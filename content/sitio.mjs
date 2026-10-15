// Datos generales del sitio.
// Todo lo que empiece con "[COMPLETAR" se muestra marcado en la web
// y aparece en la lista de pendientes al compilar (npm run build).

export default {
  nombre: 'Candela Bulacio',
  descriptor: 'Creativa en comunicación y marketing',

  // Dirección pública del sitio (GitHub Pages). Se usa para SEO y enlaces canónicos.
  url: 'https://candelabulacio.github.io/portfolio/',
  idioma: 'es-AR',

  seo: {
    titulo: 'Candela Bulacio — Creativa en comunicación y marketing',
    descripcion:
      'Portfolio y CV de Candela Bulacio: comunicación, marketing, branding, contenidos y desarrollo web.',
  },

  hero: {
    titular: ['Ideas con intención.', 'Comunicación con identidad.'],
    presentacion:
      'Soy Candela, creativa en comunicación y marketing. Me interesa explorar ideas, construir identidades y desarrollar estrategias que conecten marcas con personas.',
  },

  // Ubicación pública opcional. Dejar en null para no mostrarla.
  ubicacion: 'Pilar, Buenos Aires',

  // CV en PDF: poné el archivo en public/cv/ con este nombre.
  // Si el archivo no existe, el botón no se muestra como descarga.
  cv: 'cv/candela-bulacio-cv.pdf',
};
