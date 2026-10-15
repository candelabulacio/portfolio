// Utilidades de plantillas: escape, marcadores pendientes y enlaces.

const TODO = /^\s*\[COMPLETAR/i;

/** Registro de pendientes encontrados durante el build. */
export const pendientes = new Set();

export const esc = (v = '') =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const isTodo = (v) => typeof v === 'string' && TODO.test(v);

/** Tiene contenido real (no vacío, no pendiente). */
export const has = (v) =>
  Array.isArray(v) ? v.some(has) : v != null && v !== '' && !isTodo(v);

/** Texto escapado; si es un pendiente, lo marca visualmente. */
export const t = (v) => {
  if (isTodo(v)) {
    pendientes.add(v.replace(/^\s*\[|\]\s*$/g, ''));
    return `<mark class="todo">${esc(v)}</mark>`;
  }
  return esc(v);
};

/** Une fragmentos de HTML ignorando falsy. */
export const html = (strings, ...vals) =>
  strings.reduce((acc, s, i) => {
    const v = vals[i - 1];
    const out = Array.isArray(v) ? v.filter(Boolean).join('') : v === false || v == null ? '' : v;
    return acc + out + s;
  });

/** Enlace externo seguro y accesible. */
export const extLink = (url, label, cls = 'link') =>
  `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}<span class="sr-only"> (se abre en otra pestaña)</span></a>`;

/** Lista de valores como <li>, omitiendo vacíos. */
export const items = (arr = [], cls = '') =>
  arr.filter((x) => x != null && x !== '').map((x) => `<li${cls ? ` class="${cls}"` : ''}>${t(x)}</li>`).join('');
