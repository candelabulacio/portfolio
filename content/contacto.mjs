// Vías de contacto. Un enlace solo se publica si tiene un valor real;
// mientras diga "[COMPLETAR…]" se muestra como pendiente, sin link.

export default {
  invitacion: {
    titulo: '¿Tenés un proyecto o una propuesta?',
    texto:
      'Estoy abierta a proyectos freelance de comunicación, marketing, branding, contenido y desarrollo web, y a oportunidades laborales en equipos de marketing y comunicación.',
  },

  email: '[COMPLETAR: correo profesional]',

  enlaces: [
    {
      nombre: 'LinkedIn',
      url: 'https://www.linkedin.com/in/candelabulacio-comunicacion-marketing',
    },
    {
      nombre: 'GitHub',
      url: 'https://github.com/candelabulacio',
    },
    // Ejemplo para sumar otro:
    // { nombre: 'Behance', url: 'https://www.behance.net/…' },
  ],
};
