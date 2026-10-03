export type Technology =
  | "React"
  | "Vite"
  | "Next.js"
  | "TypeScript"
  | "Tailwind CSS"
  | "Go"
  | "PostgreSQL"
  | "Supabase"
  | "HTML"
  | "CSS"
  | "JavaScript";

export interface Project {
  id: string;
  name: string;
  url?: string;
  image: string;
  category: { es: string; en: string };
  description: { es: string; en: string };
  technologies: Technology[];
}

export const projects: Project[] = [
  {
    id: "connectup",
    name: "ConnectUp",
    url: "https://connectup.cloud/",
    image: "/projects/proyecto-02.jpg",
    category: { es: "Sistema administrativo", en: "Administrative system" },
    description: {
      es: "Dashboard empresarial integral para la gestión de recursos humanos y operaciones corporativas. Incluye control de asistencia, gestión de vacaciones, asignación de roles, administración multi-empresa y módulos de IA para análisis y calificación de llamadas de operadores.",
      en: "An integrated business dashboard for managing human resources and corporate operations. Features attendance tracking, leave management, role assignments, multi-company administration and AI modules for call analysis and operator evaluation.",
    },
    technologies: ["Next.js", "Go", "TypeScript", "PostgreSQL"],
  },
  {
    id: "ccdrs-admin",
    name: "CCDRS Admin",
    image: "/projects/ccdr-admin.png",
    category: { es: "Sistema administrativo", en: "Administrative system" },
    description: {
      es: "Sistema web administrativo desarrollado para centralizar y digitalizar los procesos internos del Comité Cantonal de Deportes y Recreación de Santa Cruz, Guanacaste. Gestión de membresías, tiquetes, ingresos y agenda institucional.",
      en: "An administrative web system built to centralize and digitize internal processes for the Santa Cruz Cantonal Sports and Recreation Committee in Guanacaste. It manages memberships, tickets, revenue and the institutional calendar.",
    },
    technologies: ["React", "Vite", "Tailwind CSS", "TypeScript", "PostgreSQL", "Supabase"],
  },
  {
    id: "ccdrs-santa-cruz",
    name: "CCDRS Santa Cruz",
    image: "/projects/proyecto-06.jpg",
    category: { es: "Landing page", en: "Institutional website" },
    description: {
      es: "Sitio web institucional del Comité Cantonal de Deportes y Recreación de Santa Cruz. Diseño impactante con estadísticas en tiempo real, agenda de eventos y sección de deportes y recreación disponibles en el cantón.",
      en: "The institutional website for the Santa Cruz Cantonal Sports and Recreation Committee. It features live statistics, an event calendar and information about sports and recreational activities available in the canton.",
    },
    technologies: ["React", "Vite", "Tailwind CSS", "TypeScript"],
  },
  {
    id: "retri",
    name: "Retri",
    url: "https://www.retri.app/",
    image: "/projects/proyecto-03.jpg",
    category: { es: "Landing page", en: "Web platform" },
    description: {
      es: "Plataforma web para el alquiler de maquinaria pesada. Como startup en producción, se enfrentó el desafío de desarrollar una solución escalable que se adaptara a los constantes cambios del negocio. +850 equipos disponibles con cotización en menos de 1 hora.",
      en: "A heavy equipment rental platform. Built for a growing startup, the scalable solution adapts to changing business needs. It lists more than 850 machines and offers quotes in under an hour.",
    },
    technologies: ["React", "Vite", "Tailwind CSS", "TypeScript", "PostgreSQL"],
  },
  {
    id: "dmona",
    name: "D'Mona Cafetería",
    url: "https://cafeteria-dmona.vercel.app/",
    image: "/projects/proyecto-07.jpg",
    category: { es: "Landing page", en: "Landing page" },
    description: {
      es: "Landing page para Cafetería D'Mona, ubicada en Cartago, Costa Rica, con vista directa hacia la Basílica de los Ángeles. Diseño cálido y elegante que refleja la identidad del local, con menú, galería y contacto por WhatsApp.",
      en: "A landing page for D'Mona Café in Cartago, Costa Rica, overlooking the Basilica of Our Lady of the Angels. Its warm, elegant design reflects the café's identity and includes a menu, gallery and WhatsApp contact.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "gohan-onigiri",
    name: "Gohan Onigiri",
    url: "https://gohan-cr.vercel.app/",
    image: "/projects/gohan-onigiri.png",
    category: { es: "Landing page", en: "Landing page" },
    description: {
      es: "Sitio web para Gohan, restaurante japonés especializado en onigiris premium hechos a mano en Plaza Mundo Escazú. Diseño minimalista con menú bilingüe (ES/EN), galería, historia y sistema de pedidos integrado.",
      en: "A website for Gohan, a Japanese restaurant serving handmade premium onigiri at Plaza Mundo Escazú. Its minimalist design includes a bilingual menu (ES/EN), gallery, story and integrated ordering system.",
    },
    technologies: ["React", "Vite", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "bpolabs",
    name: "bpoLabs",
    url: "https://bpolabsolutions.com/",
    image: "/projects/bpolabs.png",
    category: { es: "Sitio web corporativo", en: "Corporate website" },
    description: {
      es: "Sitio web corporativo para el área de desarrollo tecnológico de una empresa especializada en soluciones de recursos multifuncionales y consultoría para adquisición de clientes.",
      en: "A corporate website for the technology development division of a company specializing in multifunctional resource solutions and customer acquisition consulting.",
    },
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    id: "bernal-portfolio",
    name: "Portafolio de Bernal Baltodano",
    url: "https://bbaltodano-portafolio.vercel.app/",
    image: "/projects/bernal-portfolio.png",
    category: { es: "Fundador y propietario de Possible", en: "Founder and owner of Possible" },
    description: {
      es: "Portafolio personal de Bernal Baltodano, fundador y propietario de Possible, ingeniero de sistemas y desarrollador Full Stack. Presenta su experiencia, habilidades, proyectos destacados y las tecnologías que utiliza para crear sistemas empresariales, plataformas POS y sitios web profesionales.",
      en: "Bernal Baltodano's personal portfolio. As a Systems Engineer and Full Stack Developer, he showcases his experience, skills, featured projects and the technologies he uses to build business systems, POS platforms and professional websites.",
    },
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  },
  {
    id: "chicken-frito",
    name: "Chicken Frito",
    url: "https://www.chickenfritocr.com/",
    image: "/projects/chicken-frito.png",
    category: { es: "Sitio web para restaurante", en: "Restaurant website" },
    description: {
      es: "Sitio web para Chicken Frito con identidad visual vibrante, menú digital organizado, pedidos en línea, delivery, secciones informativas, navegación adaptable a móviles y llamados a la acción para convertir visitas en clientes.",
      en: "A website for Chicken Frito with a vibrant visual identity, organized digital menu, online ordering, delivery information, mobile-friendly navigation and clear calls to action.",
    },
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
];
