import { esc, html } from '../lib/html.mjs';

// Menú principal. "pagina: true" = página propia (/experiencia/); si no, es una sección de Inicio.
// Servicios, Sobre mí y Habilidades están en Inicio, pero no en el menú.
export const SECCIONES = [
  { id: 'proyectos', nombre: 'Proyectos' },
  { id: 'experiencia', nombre: 'Experiencia', pagina: true },
  { id: 'formacion', nombre: 'Formación', pagina: true },
  { id: 'contacto', nombre: 'Contacto' },
];

/** Enlace a una sección del menú desde cualquier página. */
export const hrefSeccion = (ctx, id) => {
  const s = SECCIONES.find((x) => x.id === id);
  return s?.pagina ? `${ctx.root}${id}/` : `${ctx.root}#${id}`;
};

export const num = (i) => String(i + 1).padStart(2, '0');

/** Botón de CV: solo es un enlace de descarga si el PDF existe. */
export const cvButton = (ctx, cls = 'btn') =>
  ctx.cvDisponible
    ? `<a class="${cls}" href="${ctx.root}${esc(ctx.sitio.cv)}" download type="application/pdf">Descargar CV<span class="sr-only"> en PDF</span></a>`
    : `<span class="${cls} is-pending" title="El PDF todavía no está cargado">CV en PDF: próximamente</span>`;

const header = (ctx) => html`
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${ctx.root || './'}" aria-label="${esc(ctx.sitio.nombre)}, ir al inicio">${esc(ctx.sitio.nombre)}</a>
    <nav class="nav" aria-label="Secciones">
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-panel" data-nav-toggle>
        <span class="nav__toggle-label">Índice</span>
      </button>
      <div class="nav__panel" id="nav-panel" data-nav-panel>
        <ol class="nav__list">
          ${SECCIONES.map(
            (s, i) =>
              s.pagina
                ? `<li><a class="nav__link" href="${hrefSeccion(ctx, s.id)}"${ctx.pagina === s.id ? ' aria-current="page"' : ''}>${s.nombre}</a></li>`
                : `<li><a class="nav__link" href="${hrefSeccion(ctx, s.id)}" data-nav-link="${s.id}">${s.nombre}</a></li>`
          )}
        </ol>
        <div class="nav__cta">
          ${ctx.cvDisponible ? cvButton(ctx, 'btn btn--small') : ''}
          <a class="btn btn--solid btn--small" href="${ctx.root}#contacto">Hablemos</a>
        </div>
      </div>
    </nav>
  </div>
</header>`;

const footer = (ctx) => html`
<footer class="site-footer">
  <div class="wrap site-footer__inner">
    <p>© ${new Date().getFullYear()} ${esc(ctx.sitio.nombre)}</p>
    <a class="link" href="#top">Volver arriba</a>
  </div>
</footer>`;

export const layout = (ctx, { titulo, descripcion, ruta = '', main, tipo = 'website' }) => {
  const { sitio } = ctx;
  const canonical = new URL(ruta, sitio.url).href;
  const persona = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: sitio.nombre,
    jobTitle: sitio.descriptor,
    url: sitio.url,
    sameAs: ctx.contacto.enlaces.map((e) => e.url),
  };
  return html`<!doctype html>
<html lang="${sitio.idioma}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${tipo}">
<meta property="og:locale" content="es_AR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${esc(sitio.nombre)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#FBF9F2">
<link rel="icon" href="${ctx.root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=Cormorant+Garamond:wght@500;600&display=swap">
<link rel="stylesheet" href="${ctx.root}assets/site.css?v=${ctx.version}">
<script type="application/ld+json">${JSON.stringify(persona)}</script>
<script>document.documentElement.classList.add('js')</script>
</head>
<body id="top">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
${header(ctx)}
<main id="contenido" tabindex="-1">
${main}
</main>
${footer(ctx)}
<script src="${ctx.root}assets/main.js?v=${ctx.version}" defer></script>
</body>
</html>`;
};

/** Encabezado de sección numerado. */
export const sectionHead = (i, titulo, intro = '', id = '') => html`
<header class="section-head">
  <span class="section-head__num" aria-hidden="true">${i >= 0 ? num(i) : ''}</span>
  <h2 class="section-head__title"${id ? ` id="${id}"` : ''}>${esc(titulo)}</h2>
  ${intro ? `<p class="section-head__intro">${esc(intro)}</p>` : ''}
</header>`;
