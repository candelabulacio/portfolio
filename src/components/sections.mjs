import { esc, t, has, html, items, extLink, isTodo } from '../lib/html.mjs';
import { cvButton, sectionHead, SECCIONES, num } from './layout.mjs';
import { cover, estadoTag } from './project.mjs';

const idx = (id) => SECCIONES.findIndex((s) => s.id === id);

/* ---------- Inicio ---------- */

// Asterisco de marca (detalle en terracota junto al nombre)
export const asterisk = (cls = 'asterisk') =>
  `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${[0, 45, 90, 135]
    .map((r) => `<rect x="41" y="4" width="18" height="92" rx="9" transform="rotate(${r} 50 50)"/>`)
    .join('')}</svg>`;

export const hero = (ctx) => {
  const { sitio } = ctx;
  const [nombre, ...apellido] = sitio.nombre.split(' ');
  const foto = sitio.hero.foto;
  return html`
<section class="hero" id="inicio" aria-labelledby="hero-name">
  <div class="wrap hero__grid">
    <div class="hero__main">
      <p class="hero__descriptor">${esc(sitio.descriptor)}</p>
      <h1 class="hero__name" id="hero-name">
        <span class="hero__first">${esc(nombre)}${asterisk('asterisk hero__mark')}</span>
        <span class="hero__last">${esc(apellido.join(' '))}</span>
      </h1>
      <p class="hero__intro"><strong>${sitio.hero.titular.map(esc).join(' ')}</strong> ${t(sitio.hero.presentacion)}</p>
      <ul class="hero__actions" aria-label="Accesos rápidos">
        <li><a class="btn btn--solid btn--large" href="#contacto">Hablemos de tu proyecto</a></li>
        <li><a class="btn btn--large" href="#proyectos">Ver proyectos</a></li>
        <li><a class="link" href="#experiencia">Experiencia y CV</a></li>
      </ul>
    </div>
    <figure class="hero__photo">
      ${
        foto
          ? `<img src="${ctx.root}${esc(foto)}" alt="${esc(sitio.hero.fotoAlt || '')}" width="800" height="1000" fetchpriority="high">`
          : `<div class="hero__photo-empty">${asterisk('asterisk')}<mark class="todo">[COMPLETAR: foto de retrato]</mark></div>`
      }
    </figure>
  </div>
</section>`;
};

/* ---------- Sobre mí ---------- */
export const about = (ctx) => {
  const s = ctx.sobreMi;
  return html`
<section class="section about" id="sobre-mi" aria-labelledby="sobre-mi-title">
  <div class="wrap">
    ${sectionHead(idx('sobre-mi'), 'Sobre mí', '', 'sobre-mi-title')}
    <div class="about__grid">
      <div class="about__text">
        ${s.perfil.map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${t(p)}</p>`)}
      </div>
      <aside class="about__aside">
        ${s.foto ? `<img class="about__photo" src="${ctx.root}${esc(s.foto)}" alt="${esc(s.fotoAlt)}" width="480" height="600" loading="lazy">` : ''}
        <dl class="facts">
          ${s.datos.map((d) => `<div><dt>${esc(d.etiqueta)}</dt><dd>${t(d.valor)}</dd></div>`)}
        </dl>
      </aside>
    </div>
    <div class="approach">
      <h3 class="approach__title">Cómo encaro un proyecto</h3>
      <ol class="approach__list">
        ${s.enfoque.map(
          (e, i) => `<li><span class="approach__num" aria-hidden="true">${num(i)}</span><h4>${esc(e.titulo)}</h4><p>${t(e.texto)}</p></li>`
        )}
      </ol>
    </div>
  </div>
</section>`;
};

/* ---------- Experiencia ---------- */
const block = (titulo, arr) =>
  arr && arr.length ? `<div class="job__block"><h4>${titulo}</h4><ul>${items(arr)}</ul></div>` : '';

export const experience = (ctx) => html`
<section class="section experience" id="experiencia" aria-labelledby="experiencia-title">
  <div class="wrap">
    ${sectionHead(idx('experiencia'), 'Experiencia', '', 'experiencia-title')}
    <div class="timeline__tools">
      <button type="button" class="link link--button" data-expand-all aria-pressed="false">Abrir todas</button>
    </div>
    <ol class="timeline">
      ${ctx.experiencia.map(
        (j, i) => html`
      <li class="job">
        <details${i === 0 ? ' open' : ''}>
          <summary class="job__summary">
            <span class="job__dates">${j.desde === j.hasta ? `<time>${t(j.desde)}</time>` : `<time>${t(j.desde)}</time> – <time>${t(j.hasta)}</time>`}</span>
            <span class="job__head">
              <span class="job__role">${t(j.puesto)}</span>
              <span class="job__org">${t(j.organizacion)}</span>
            </span>
            <span class="job__resume">${t(j.resumen)}</span>
            <span class="job__icon" aria-hidden="true"></span>
          </summary>
          <div class="job__body">
            ${block('Responsabilidades', j.responsabilidades)}
            ${block('Proyectos relevantes', j.proyectos)}
            ${block('Herramientas', j.herramientas)}
            ${block('Competencias', j.competencias)}
            ${block('Aportes y resultados', j.aportes)}
          </div>
        </details>
      </li>`
      )}
    </ol>
  </div>
</section>`;

/* ---------- Proyectos ---------- */

const catName = (ctx, p) => ctx.categorias.find((c) => c.id === p.categorias[0])?.nombre ?? '';

// Tarjeta vertical: imagen (o portada tipográfica) con el título encima, datos debajo.
const tile = (ctx, p) => {
  if (p.estado === 'reservado') {
    return html`
<li class="tile tile--reserved" data-cat="${p.categorias[0]}">
  <div class="tile__media"><span class="tile__title">${esc(p.titulo)}</span></div>
  <div class="tile__info">
    <p class="tile__meta"><span class="tag tag--outline">Espacio reservado</span><span>${esc(catName(ctx, p))}</span></p>
    <p class="tile__text">${esc(p.bajada)}</p>
  </div>
</li>`;
  }
  return html`
<li class="tile${p.portada ? ' tile--image' : ''}" data-cat="${p.categorias[0]}">
  <a class="tile__link" href="${ctx.root}proyectos/${p.slug}/">
    <div class="tile__media">
      ${p.portada ? `<img src="${ctx.root}${esc(p.portada)}" alt="" loading="lazy" decoding="async">` : ''}
      <span class="tile__title">${esc(p.titulo)}</span>
    </div>
    <div class="tile__info">
      <p class="tile__meta">${estadoTag(p)}<span>${esc(catName(ctx, p))}</span></p>
      <p class="tile__text">${t(p.bajada)}</p>
      <span class="tile__cta">Ver caso de estudio</span>
    </div>
  </a>
</li>`;
};

export const projects = (ctx) => {
  // Orden: destacados primero, después por categoría. Cada proyecto aparece una sola vez.
  const destacados = ctx.proyectos.filter((p) => p.destacado && p.estado !== 'reservado');
  const resto = ctx.categorias.flatMap((c) => ctx.proyectos.filter((p) => !destacados.includes(p) && p.categorias[0] === c.id));
  const lista = [...destacados, ...resto];
  const cats = ctx.categorias.filter((c) => lista.some((p) => p.categorias[0] === c.id));
  return html`
<section class="section projects" id="proyectos" aria-labelledby="proyectos-title">
  <div class="wrap">
    ${sectionHead(
      idx('proyectos'),
      'Proyectos',
      'Casos reales y espacios reservados para los próximos. Los proyectos conceptuales siempre se indican como tales.',
      'proyectos-title'
    )}
  </div>
  <div class="shelf" data-shelf>
    <div class="wrap shelf__head">
      <div class="filters" role="group" aria-label="Filtrar por categoría" data-filters hidden>
        <button class="filters__btn" type="button" aria-pressed="true" data-cat="">Todos</button>
        ${cats.map((c) => `<button class="filters__btn" type="button" aria-pressed="false" data-cat="${c.id}">${esc(c.nombre)}</button>`)}
      </div>
      <div class="shelf__controls">
        <p class="shelf__pos" data-shelf-pos aria-live="polite"></p>
        <button class="shelf__btn" type="button" data-shelf-prev aria-controls="shelf-proyectos" aria-label="Proyectos anteriores"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
        <button class="shelf__btn" type="button" data-shelf-next aria-controls="shelf-proyectos" aria-label="Proyectos siguientes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
      </div>
    </div>
    <ul class="shelf__track shelf__track--tiles" id="shelf-proyectos" aria-label="Proyectos" data-shelf-track>
      ${lista.map((p) => tile(ctx, p))}
    </ul>
  </div>
</section>`;
};

/* ---------- Habilidades ---------- */
export const skills = (ctx) => {
  const h = ctx.habilidades;
  const proyecto = (slug) => ctx.proyectos.find((p) => p.slug === slug && p.estado !== 'reservado');
  return html`
<section class="section skills" id="habilidades" aria-labelledby="habilidades-title">
  <div class="wrap">
    ${sectionHead(idx('habilidades'), 'Habilidades y herramientas', '', 'habilidades-title')}
    <div class="skills__tabs" role="tablist" aria-label="Áreas" data-tabs hidden>
      ${h.areas.map(
        (a, i) =>
          `<button class="skills__tab" type="button" role="tab" id="tab-${a.id}" aria-controls="panel-${a.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(a.nombre)}</button>`
      )}
    </div>
    <div class="skills__panels">
      ${h.areas.map((a) => {
        const rel = a.proyectos.map(proyecto).filter(Boolean);
        return html`
      <div class="skills__panel" id="panel-${a.id}" role="tabpanel" aria-labelledby="tab-${a.id}" data-panel>
        <h3 class="skills__name">${esc(a.nombre)}</h3>
        <p class="skills__desc">${esc(a.descripcion)}</p>
        <div class="skills__cols">
          <div><h4>Competencias</h4><ul class="chips">${items(a.competencias)}</ul></div>
          ${a.herramientas.length ? `<div><h4>Herramientas</h4><ul class="chips chips--tools">${items(a.herramientas)}</ul></div>` : ''}
          ${rel.length ? `<div><h4>Proyectos relacionados</h4><ul class="plain">${rel.map((p) => `<li><a class="link" href="${ctx.root}proyectos/${p.slug}/">${esc(p.titulo)}</a></li>`).join('')}</ul></div>` : ''}
        </div>
      </div>`;
      })}
    </div>
    <div class="interests">
      <h3>Áreas de interés</h3>
      <p class="interests__note">Hacia dónde quiero seguir creciendo. No son especialidades.</p>
      <ul class="interests__list">${items(h.intereses)}</ul>
    </div>
  </div>
</section>`;
};

/* ---------- Formación ---------- */
const course = (c) => html`
<li class="edu__item">
  <span class="edu__period">${t(c.periodo)}</span>
  <div>
    <p class="edu__title">${t(c.titulo)}</p>
    <p class="edu__inst">${t(c.institucion)}${c.estado === 'en curso' ? ' <span class="tag tag--soft">En curso</span>' : ''}</p>
    ${has(c.credencial) ? extLink(c.credencial, 'Ver credencial') : ''}
  </div>
</li>`;

export const education = (ctx) => {
  const f = ctx.formacion;
  return html`
<section class="section education" id="formacion" aria-labelledby="formacion-title">
  <div class="wrap">
    ${sectionHead(idx('formacion'), 'Formación', '', 'formacion-title')}
    <div class="edu__grid">
      <div>
        <h3 class="edu__group">Estudios</h3>
        <ol class="edu__list">${f.estudios.map(course)}</ol>
      </div>
      <div>
        <h3 class="edu__group">Cursos y certificaciones</h3>
        <ol class="edu__list">${f.cursos.map(course)}</ol>
        <h3 class="edu__group">Idiomas</h3>
        <dl class="langs">${f.idiomas.map((l) => `<div><dt>${esc(l.idioma)}</dt><dd>${t(l.nivel)}</dd></div>`)}</dl>
      </div>
    </div>
  </div>
</section>`;
};

/* ---------- Servicios ---------- */
export const services = (ctx) => {
  const s = ctx.servicios;
  return html`
<section class="section services" id="servicios" aria-labelledby="servicios-title">
  <div class="wrap">
    ${sectionHead(-1, 'En qué puedo ayudarte', s.intro, 'servicios-title')}
    <ul class="services__list">
      ${s.areas.map((a) => `<li><h3>${esc(a.nombre)}</h3><p>${t(a.texto)}</p></li>`)}
    </ul>
    <p class="services__cta"><a class="btn btn--solid btn--large" href="#contacto">Hablemos de tu proyecto</a></p>
  </div>
</section>`;
};

/* ---------- Contacto ---------- */
export const contact = (ctx) => {
  const c = ctx.contacto;
  const mail = isTodo(c.email)
    ? `<p class="contact__mail">${t(c.email)}</p>`
    : `<a class="contact__mail" href="mailto:${esc(c.email)}">${esc(c.email)}</a>`;
  return html`
<section class="section contact" id="contacto" aria-labelledby="contacto-title">
  <div class="wrap">
    ${sectionHead(idx('contacto'), 'Contacto', '', 'contacto-title')}
    <p class="contact__title">${esc(c.invitacion.titulo)}</p>
    <p class="contact__text">${esc(c.invitacion.texto)}</p>
    ${mail}
    <ul class="contact__links">
      ${c.enlaces.filter((e) => has(e.url)).map((e) => `<li>${extLink(e.url, e.nombre, 'contact__link')}</li>`)}
      <li>${cvButton(ctx, 'contact__link')}</li>
    </ul>
    ${ctx.sitio.ubicacion ? `<p class="contact__place">${esc(ctx.sitio.ubicacion)}</p>` : ''}
  </div>
</section>`;
};
