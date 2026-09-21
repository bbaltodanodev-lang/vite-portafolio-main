import { Banner } from "./components/Banner";
import Education from "./components/Education";
import { Experience } from "./components/Experience";
import Projects from "./components/Projects";
import Seo from "./components/Seo";
import Skills from "./components/Skills";
import BMSolution from "./components/BMSolution";
import Analytics from "./components/Analytics";

function App() {
  return (
    <main>
      <Analytics />
      <Seo
        title="Bernal Baltodano - Systems Engineer, Full Stack Developer & Freelancer"
        description="Systems Engineer, Full Stack Developer & Freelancer. +4 años en React, TypeScript, Docker y CI/CD."
      />
      {/* <Header /> */}
      <Banner />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <BMSolution />
    </main>
  );
}

export default App;
