# Candela Bulacio — Personal Portfolio

Portfolio y CV online. Sitio estático generado con Node, sin dependencias: no hace falta instalar nada con npm.

## Ver el sitio en tu compu

Necesitás [Node.js](https://nodejs.org) 20 o superior.

```bash
npm run dev       # genera el sitio y abre una vista previa en http://localhost:4321
```

Cada vez que guardás un cambio en `content/`, `src/` o `public/`, el sitio se vuelve a generar. Recargá el navegador para verlo.

## Editar contenido

Todo el texto vive en `content/`. No hace falta tocar el diseño.

| Archivo | Qué contiene |
|---|---|
| `content/sitio.mjs` | Nombre, descriptor, titular, presentación, SEO, ruta del CV |
| `content/sobre-mi.mjs` | Perfil, datos destacados, forma de trabajo, foto opcional |
| `content/experiencia.mjs` | Puestos (del más reciente al más antiguo) |
| `content/formacion.mjs` | Estudios, cursos, certificaciones e idiomas |
| `content/habilidades.mjs` | Las cuatro áreas, herramientas e intereses |
| `content/servicios.mjs` | Áreas de trabajo para clientes |
| `content/contacto.mjs` | Correo y enlaces profesionales |
| `content/proyectos/` | Un archivo por caso de estudio + `index.mjs` con el orden |

### Datos pendientes

Cualquier texto que empiece con `[COMPLETAR` se muestra resaltado en la web y aparece listado al correr `npm run build`. Antes de publicar, revisá que la lista esté vacía.

### Sumar un proyecto

1. Copiá `content/proyectos/malvinizar.mjs` con otro nombre, por ejemplo `mi-caso.mjs`.
2. Cambiá `slug`, `titulo`, `categorias` y el resto de los campos.
3. Usá `estado: 'real'` para trabajos hechos o `estado: 'conceptual'` para ejercicios propios. Los conceptuales se etiquetan como tales en la web.
4. Importalo en `content/proyectos/index.mjs` y agregalo a la lista `proyectos`.
5. Poné las imágenes en `public/img/proyectos/mi-caso/` y referencialas desde el archivo, sin la palabra `public`.

El build avisa si falta una imagen, si un slug está repetido o si una categoría no existe.

### Subir el CV

Guardá el PDF como `public/cv/candela-bulacio-cv.pdf`. Mientras el archivo no exista, el botón muestra "CV en PDF: próximamente" y no simula una descarga.

## Publicar en GitHub Pages

1. Subí el proyecto a `main` en `github.com/candelabulacio/portfolio`.
2. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada push a `main` publica el sitio en `https://candelabulacio.github.io/portfolio/`.

Si más adelante usás un dominio propio, cambiá `url` en `content/sitio.mjs`.

## Estructura técnica

```
content/          Contenido editable
public/           Archivos que se copian tal cual (CV, imágenes, favicon)
src/build.mjs     Genera dist/ a partir de content/
src/dev.mjs       Servidor local de vista previa
src/components/   Plantillas HTML (layout, secciones, casos)
src/styles/       CSS por capas: tokens → base → layout → home → casos
src/scripts/      Interacciones (índice, carruseles, pestañas)
```

El sistema visual está en `src/styles/01-tokens.css`: paleta, escala tipográfica y espaciado.
