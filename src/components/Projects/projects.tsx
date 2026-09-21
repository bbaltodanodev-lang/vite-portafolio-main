import { DiReact } from "react-icons/di";
import { FaGolang, FaJava, FaNodeJs, FaPython } from "react-icons/fa6";
import { SiCss3, SiHtml5, SiJavascript, SiNextdotjs, SiPostgresql, SiSupabase, SiTailwindcss, SiTypescript, SiVite } from "react-icons/si";

const tech = {
  react: { icon: <DiReact size={26} />, name: "React" },
  vite: { icon: <SiVite size={26} />, name: "Vite" },
  next: { icon: <SiNextdotjs size={26} />, name: "Next.js" },
  ts: { icon: <SiTypescript size={26} />, name: "TypeScript" },
  tailwind: { icon: <SiTailwindcss size={26} />, name: "Tailwind CSS" },
  go: { icon: <FaGolang size={26} />, name: "Go" },
  postgres: { icon: <SiPostgresql size={26} />, name: "PostgreSQL" },
  node: { icon: <FaNodeJs size={26} />, name: "Node.js" },
  python: { icon: <FaPython size={26} />, name: "Python" },
  java: { icon: <FaJava size={26} />, name: "Java" },
  supabase: { icon: <SiSupabase size={26} />, name: "Supabase" },
  html: { icon: <SiHtml5 size={24} />, name: "HTML" },
  css: { icon: <SiCss3 size={24} />, name: "CSS" },
  javascript: { icon: <SiJavascript size={24} />, name: "JavaScript" },
};

export const listProjects = [
  { title: "ConnectUp", category: "Sistema administrativo", description: "Dashboard empresarial integral para la gestión de recursos humanos y operaciones corporativas. Incluye control de asistencia, gestión de vacaciones, asignación de roles, administración multi-empresa y módulos de IA para análisis y calificación de llamadas de operadores.", image: "/projects/proyecto-02.jpg", url: "#", domain: "ConnectUp", tech_icons: [tech.next, tech.go, tech.ts, tech.postgres] },
  { title: "CCDRS Admin", category: "Sistema administrativo", description: "Sistema web administrativo desarrollado para centralizar y digitalizar los procesos internos del Comité Cantonal de Deportes y Recreación de Santa Cruz, Guanacaste. Gestión de membresías, tiquetes, ingresos y agenda institucional.", image: "/projects/ccdr-admin.png", url: "#", domain: "CCDRS Admin", tech_icons: [tech.react, tech.vite, tech.tailwind, tech.ts, tech.postgres, tech.supabase] },
  { title: "CCDRS Santa Cruz", category: "Landing page", description: "Sitio web institucional del Comité Cantonal de Deportes y Recreación de Santa Cruz. Diseño impactante con estadísticas en tiempo real, agenda de eventos y sección de deportes y recreación disponibles en el cantón.", image: "/projects/proyecto-06.jpg", url: "#", domain: "CCDRS Santa Cruz", tech_icons: [tech.react, tech.vite, tech.tailwind, tech.ts] },
  { title: "Retri", category: "Landing page", description: "Plataforma web para el alquiler de maquinaria pesada. Como startup en producción, se enfrentó el desafío de desarrollar una solución escalable que se adaptara a los constantes cambios del negocio. +850 equipos disponibles con cotización en menos de 1 hora.", image: "/projects/proyecto-03.jpg", url: "https://www.retri.app/", domain: "www.retri.app", tech_icons: [tech.react, tech.vite, tech.tailwind, tech.ts, tech.postgres] },
  { title: "D'Mona Cafetería", category: "Landing page", description: "Landing page para Cafetería D'Mona, ubicada en Cartago, Costa Rica, con vista directa hacia la Basílica de los Ángeles. Diseño cálido y elegante que refleja la identidad del local, con menú, galería y contacto por WhatsApp.", image: "/projects/proyecto-07.jpg", url: "#", domain: "D'Mona Cafetería", tech_icons: [tech.html, tech.css, tech.javascript] },
  { title: "Gohan Onigiri", category: "Landing page", description: "Sitio web para Gohan, restaurante japonés especializado en onigiris premium hechos a mano en Plaza Mundo Escazú. Diseño minimalista con menú bilingüe (ES/EN), galería, historia y sistema de pedidos integrado.", image: "/projects/gohan-onigiri.png", url: "#", domain: "Gohan Onigiri", tech_icons: [tech.react, tech.vite, tech.ts, tech.tailwind] },
  { title: "bpoLabs", category: "Sitio web corporativo", description: "Sitio web corporativo para el área de desarrollo tecnológico de una empresa especializada en soluciones de recursos multifuncionales y consultoría para adquisición de clientes.", image: "/projects/bpolabs.png", url: "https://bpolabsolutions.com/", domain: "bpolabsolutions.com", tech_icons: [tech.react, tech.ts, tech.next, tech.tailwind] },
  { title: "Portafolio de Bernal Baltodano", category: "Fundador y propietario de BM Solutions", description: "Portafolio personal de Bernal Baltodano, fundador y propietario de BM Solutions, ingeniero de sistemas y desarrollador Full Stack. Presenta su experiencia, habilidades, proyectos destacados y las tecnologías que utiliza para crear sistemas empresariales, plataformas POS y sitios web profesionales.", image: "/projects/bernal-portfolio.png", url: "#", domain: "Portafolio de Bernal Baltodano", tech_icons: [tech.react, tech.ts, tech.vite, tech.tailwind] },
  { title: "Chicken Frito", category: "Sitio web para restaurante", description: "Sitio web para Chicken Frito con identidad visual vibrante, menú digital organizado, pedidos en línea, delivery, secciones informativas, navegación adaptable a móviles y llamados a la acción para convertir visitas en clientes.", image: "/projects/chicken-frito.png", url: "#", domain: "Chicken Frito", tech_icons: [tech.react, tech.ts, tech.next, tech.tailwind] },
];
