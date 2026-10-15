import { esc, t, has, html, extLink, items } from '../lib/html.mjs';
import { num } from './layout.mjs';

const ESTADOS = {
  real: { label: null },
  conceptual: { label: 'Proyecto conceptual' },
};

export const estadoTag = (p) => {
  const label = p.tipo || ESTADOS[p.estado]?.label;
  if (!label) return '';
  const cls = p.estado === 'conceptual' ? 'tag tag--accent' : 'tag tag--soft';
  return `<span class="${cls}">${esc(label)}</span>`;
};

/** Portada: imagen si existe, si no, una portada tipográfica. */
export const cover = (ctx, p, cls) =>
  p.portada
    ? `<img class="${cls}" src="${ctx.root}${esc(p.portada)}" alt="${esc(p.portadaAlt || '')}" width="1200" height="750" loading="lazy" decoding="async">`
    : `<div class="${cls} cover-type" aria-hidden="true"><span>${esc(p.titulo)}</span></div>`;

const SECCIONES_CASO = [
  ['contexto', 'Contexto y desafío'],
  ['objetivos', 'Objetivos'],
  ['alcance', 'Mi rol y alcance'],
  ['concepto', 'Concepto'],
  ['proceso', 'Proceso de trabajo'],
  ['decisiones', 'Decisiones de diseño y comunicación'],
  ['resultado', 'Resultado'],
  ['aprendizajes', 'Aprendizajes y resultados'],
];

const gallery = (ctx, p) => {
  if (!p.galeria?.length) {
    return `<div class="gallery-empty"><mark class="todo">[COMPLETAR: capturas o mockups del proyecto en public/img/proyectos/${esc(p.slug)}/]</mark></div>`;
  }
  return html`
<div class="shelf shelf--gallery" data-shelf>
  <div class="shelf__head">
    <h2 class="case__label">Galería</h2>
    <div class="shelf__controls">
      <p class="shelf__pos" data-shelf-pos aria-live="polite"></p>
      <button class="shelf__btn" type="button" data-shelf-prev aria-controls="galeria" aria-label="Imagen anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="shelf__btn" type="button" data-shelf-next aria-controls="galeria" aria-label="Imagen siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
  </div>
  <ul class="shelf__track shelf__track--gallery" id="galeria" data-shelf-track>
    ${p.galeria.map(
      (g) => `<li><figure>${
        g.video
          ? `<video src="${ctx.root}${esc(g.video)}" controls preload="metadata"></video>`
          : `<img src="${ctx.root}${esc(g.src)}" alt="${esc(g.alt || '')}" loading="lazy" decoding="async">`
      }${g.epigrafe ? `<figcaption>${esc(g.epigrafe)}</figcaption>` : ''}</figure></li>`
    )}
  </ul>
</div>`;
};

export const casePage = (ctx, p) => {
  const cats = p.categorias.map((id) => ctx.categorias.find((c) => c.id === id)?.nombre).filter(Boolean);
  const reales = ctx.proyectos.filter((x) => x.estado !== 'reservado');
  const siguiente = reales.length > 1 ? reales[(reales.indexOf(p) + 1) % reales.length] : null;
  let n = 0;
  return html`
<article class="case">
  <header class="case__hero wrap">
    <nav class="crumbs" aria-label="Ruta">
      <a class="link" href="${ctx.root}#proyectos">Proyectos</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(p.titulo)}</span>
    </nav>
    <p class="case__tags">${estadoTag(p)}${cats.map((c) => `<span class="tag tag--outline">${esc(c)}</span>`)}</p>
    <h1 class="case__title">${esc(p.titulo)}</h1>
    <p class="case__lede">${t(p.bajada)}</p>
    <dl class="case__meta">
      <div><dt>Año</dt><dd>${t(p.anio)}</dd></div>
      <div><dt>Rol</dt><dd>${t(p.rol)}</dd></div>
      <div><dt>Equipo</dt><dd>${t(p.equipo)}</dd></div>
      <div><dt>Herramientas</dt><dd><ul class="plain">${items(p.herramientas)}</ul></dd></div>
    </dl>
    ${p.enlaces?.length ? `<ul class="case__links">${p.enlaces.filter((e) => has(e.url)).map((e) => `<li>${extLink(e.url, e.nombre, 'btn')}</li>`).join('')}</ul>` : ''}
  </header>

  <div class="case__cover wrap">${cover(ctx, p, 'case__cover-media')}</div>

  <div class="case__body wrap">
    ${SECCIONES_CASO.filter(([k]) => p.secciones?.[k]?.length).map(
      ([k, titulo]) => html`
    <section class="case__section" aria-labelledby="caso-${k}">
      <span class="case__num" aria-hidden="true">${num(n++)}</span>
      <h2 class="case__label" id="caso-${k}">${titulo}</h2>
      <div class="case__text">${p.secciones[k].map((x) => `<p>${t(x)}</p>`)}</div>
    </section>`
    )}
  </div>

  <div class="wrap case__gallery">${gallery(ctx, p)}</div>

  <nav class="case__next wrap" aria-label="Más proyectos">
    <a class="link" href="${ctx.root}#proyectos">Volver a proyectos</a>
    ${siguiente ? `<a class="case__next-link" href="${ctx.root}proyectos/${siguiente.slug}/"><span>Siguiente caso</span>${esc(siguiente.titulo)}</a>` : ''}
  </nav>
</article>`;
};
