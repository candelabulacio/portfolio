// Orden de los proyectos y categorías de la galería.
// Para sumar un caso: creá content/proyectos/mi-caso.mjs (copiá malvinizar.mjs)
// e importalo acá.

import malvinizar from './malvinizar.mjs';

export const categorias = [
  { id: 'branding', nombre: 'Branding e identidad' },
  { id: 'comunicacion-marketing', nombre: 'Comunicación y marketing' },
  { id: 'diseno-web', nombre: 'Diseño web y proyectos digitales' },
  { id: 'audiovisual', nombre: 'Contenido audiovisual' },
];

// Espacios reservados: se muestran como lugares vacíos, sin enlace,
// para no presentarlos como trabajos realizados.
const reservados = [
  { slug: 'reservado-branding', estado: 'reservado', titulo: 'Caso de branding', categorias: ['branding'], bajada: 'Espacio para un proyecto de identidad visual.' },
  { slug: 'reservado-estrategia', estado: 'reservado', titulo: 'Estrategia de marketing y comunicación', categorias: ['comunicacion-marketing'], bajada: 'Espacio para un plan de comunicación.' },
  { slug: 'reservado-redes', estado: 'reservado', titulo: 'Contenido para redes sociales', categorias: ['comunicacion-marketing'], bajada: 'Espacio para una propuesta de contenidos.' },
  { slug: 'reservado-web', estado: 'reservado', titulo: 'Proyecto de diseño web', categorias: ['diseno-web'], bajada: 'Espacio para un nuevo sitio.' },
  { slug: 'reservado-audiovisual', estado: 'reservado', titulo: 'Pieza audiovisual', categorias: ['audiovisual'], bajada: 'Espacio para un proyecto audiovisual.' },
];

export const proyectos = [malvinizar, ...reservados];
