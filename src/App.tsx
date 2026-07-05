import { useEffect } from "react";
import Lenis from "lenis";
import { Banner } from "./components/Banner";
import Education from "./components/Education";
import { Experience } from "./components/Experience";
import Projects from "./components/Projects";
import Seo from "./components/Seo";
import Skills from "./components/Skills";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Deceleración exponencial (easeOutExpo)
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <Seo
        title="Bernal Baltodano - DevOps Engineer | Full Stack Developer | AWS Cloud Architect"
        description="Portafolio de Bernal Baltodano: Ingeniero DevOps/SRE con +4 años de experiencia diseñando arquitecturas cloud-native en AWS con Terraform, implementando CI/CD con Docker y GitHub Actions, y desarrollando aplicaciones full-stack con React y TypeScript."
      />
      {/* <Header /> */}
      <Banner />
      <Experience />
      <Skills />
      <Projects />
      <Education />
    </main>
  );
}

export default App;
