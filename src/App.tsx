import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";

// Críticos para LCP — carga inmediata
import { Banner } from "./components/Banner";
import Analytics from "./components/Analytics";
import Seo from "./components/Seo";

// Below the fold — lazy load para reducir el bundle inicial
// Three.js (Skills) pesa ~600 KB y solo se descarga cuando el usuario llega
const Experience = lazy(() => import("./components/Experience"));
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const Education = lazy(() => import("./components/Education"));
const BMSolution = lazy(() => import("./components/BMSolution"));

function App() {
  useEffect(() => {
    // Inicializar Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      // Función de easing suave — deceleración exponencial
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // syncTouch: false → mantiene scroll nativo en móvil (más fluido en iOS/Android)
      syncTouch: false,
      touchMultiplier: 2,
    });

    // Loop RAF — Lenis necesita .raf() en cada frame para calcular la interpolación
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <Analytics />
      <Seo
        title="Bernal Baltodano - Systems Engineer, Full Stack Developer & Freelancer"
        description="Systems Engineer, Full Stack Developer & Freelancer. +4 años en React, TypeScript, Docker y CI/CD."
      />
      {/* Sección hero — carga inmediata para LCP */}
      <Banner />

      {/* Secciones below-the-fold — se descargan al hacer scroll */}
      <Suspense fallback={null}>
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <BMSolution />
      </Suspense>
    </main>
  );
}

export default App;
