// Generador del sitio: lee content/, arma HTML estático en dist/.
// Uso: node src/build.mjs   (sin dependencias externas)

import { readFile, writeFile, mkdir, rm, cp, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const load = async (p) => import(pathToFileURL(join(ROOT, p)).href);

const { pendientes } = await load('src/lib/html.mjs');
const { layout } = await load('src/components/layout.mjs');
const S = await load('src/components/sections.mjs');
const { casePage } = await load('src/components/project.mjs');

const ctx = {
  sitio: (await load('content/sitio.mjs')).default,
  contacto: (await load('content/contacto.mjs')).default,
  sobreMi: (await load('content/sobre-mi.mjs')).default,
  experiencia: (await load('content/experiencia.mjs')).default,
  formacion: (await load('content/formacion.mjs')).default,
  habilidades: (await load('content/habilidades.mjs')).default,
  servicios: (await load('content/servicios.mjs')).default,
  ...(await load('content/proyectos/index.mjs')),
  version: Date.now().toString(36),
};

const exists = (p) => access(p).then(() => true, () => false);
ctx.cvDisponible = await exists(join(ROOT, 'public', ctx.sitio.cv));

// Validaciones básicas de contenido
const errores = [];
const slugs = new Set();
for (const p of ctx.proyectos) {
  if (slugs.has(p.slug)) errores.push(`Proyecto con slug repetido: ${p.slug}`);
  slugs.add(p.slug);
  if (!['real', 'conceptual', 'reservado'].includes(p.estado)) errores.push(`Estado inválido en ${p.slug}: ${p.estado}`);
  for (const c of p.categorias) if (!ctx.categorias.some((x) => x.id === c)) errores.push(`Categoría desconocida en ${p.slug}: ${c}`);
  for (const img of [p.portada, ...(p.galeria || []).map((g) => g.src || g.video)].filter(Boolean))
    if (!(await exists(join(ROOT, 'public', img)))) errores.push(`Falta la imagen ${img} (${p.slug})`);
}
if (ctx.sitio.hero.foto && !(await exists(join(ROOT, 'public', ctx.sitio.hero.foto)))) errores.push(`Falta la foto ${ctx.sitio.hero.foto}`);
if (ctx.sobreMi.foto && !(await exists(join(ROOT, 'public', ctx.sobreMi.foto)))) errores.push(`Falta la foto ${ctx.sobreMi.foto}`);
if (errores.length) {
  console.error('\nNo se pudo generar el sitio:\n- ' + errores.join('\n- '));
  process.exit(1);
}

// Limpieza y estáticos
await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, 'assets'), { recursive: true });
await cp(join(ROOT, 'public'), DIST, { recursive: true });

// CSS: se concatenan los archivos de src/styles en orden alfabético
const styleDir = join(ROOT, 'src/styles');
const css = (await Promise.all((await readdir(styleDir)).filter((f) => f.endsWith('.css')).sort().map((f) => readFile(join(styleDir, f), 'utf8')))).join('\n');
await writeFile(join(DIST, 'assets/site.css'), css);
await cp(join(ROOT, 'src/scripts/main.js'), join(DIST, 'assets/main.js'));

const write = async (rel, content) => {
  const file = join(DIST, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
};

// Home
const home = [S.hero, S.projects, S.services, S.about, S.skills, S.contact].map((f) => f({ ...ctx, root: '' })).join('\n');
await write('index.html', layout({ ...ctx, root: '' }, { titulo: ctx.sitio.seo.titulo, descripcion: ctx.sitio.seo.descripcion, main: home }));

const rutas = [''];

// Páginas propias: Experiencia y Formación (con Contacto al final)
for (const [id, seccion, titulo, descripcion] of [
  ['experiencia', S.experience, 'Experiencia', 'Experiencia profesional de Candela Bulacio: puestos, responsabilidades y competencias.'],
  ['formacion', S.education, 'Formación', 'Formación de Candela Bulacio: estudios, cursos, certificaciones e idiomas.'],
]) {
  const c = { ...ctx, root: '../', pagina: id };
  const ruta = `${id}/`;
  rutas.push(ruta);
  await write(
    `${ruta}index.html`,
    layout(c, {
      titulo: `${titulo} — ${ctx.sitio.nombre}`,
      descripcion,
      ruta,
      main: `<div class="page">${seccion(c)}${S.contact(c)}</div>`,
    })
  );
}

// Casos de estudio
for (const p of ctx.proyectos.filter((x) => x.estado !== 'reservado')) {
  const c = { ...ctx, root: '../../' };
  const ruta = `proyectos/${p.slug}/`;
  rutas.push(ruta);
  await write(
    `${ruta}index.html`,
    layout(c, {
      titulo: `${p.titulo} — ${ctx.sitio.nombre}`,
      descripcion: p.bajada,
      ruta,
      tipo: 'article',
      main: casePage(c, p),
    })
  );
}

// 404 (GitHub Pages la sirve desde la raíz, con rutas absolutas al sitio)
const base = new URL(ctx.sitio.url).pathname;
await write(
  '404.html',
  layout({ ...ctx, root: base }, {
    titulo: `Página no encontrada — ${ctx.sitio.nombre}`,
    descripcion: 'La página que buscás no existe.',
    ruta: '404.html',
    main: `<section class="section notfound"><div class="wrap"><h1 class="case__title">Esta página no existe</h1><p class="case__lede">Puede que el enlace esté mal escrito o que el contenido se haya movido.</p><p><a class="btn btn--solid" href="${base}">Ir al inicio</a></p></div></section>`,
  })
);

// SEO
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rutas.map((r) => `  <url><loc>${new URL(r, ctx.sitio.url).href}</loc></url>`).join('\n')}\n</urlset>\n`);
await write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', ctx.sitio.url).href}\n`);
await write('.nojekyll', '');

// Resumen
console.log(`Sitio generado en dist/ (${rutas.length} páginas).`);
if (!ctx.cvDisponible) console.log(`· CV: falta public/${ctx.sitio.cv} (el botón se muestra como "próximamente").`);
if (pendientes.size) {
  console.log(`· ${pendientes.size} datos pendientes de completar:`);
  for (const p of pendientes) console.log(`   - ${p}`);
}
