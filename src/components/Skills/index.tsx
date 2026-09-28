import { useEffect, useRef, useState } from "react";
import { Meteors } from "../Animations/Meteors";
import { TECHNOLOGIES } from "./list";
import styles from "./styles.module.css";
import TechCube from "./TechCube";
import { useLanguage } from "../../i18n/LanguageContext";
import { content } from "../../i18n/content";
export default function Skills() {
  const { language } = useLanguage();
  const t = content[language];
  const haloRef = useRef<HTMLElement>(null);
  const [cubeReady, setCubeReady] = useState(false);

  useEffect(() => {
    const halo = haloRef.current;
    if (!halo) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCubeReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px" });
    observer.observe(halo);
    return () => observer.disconnect();
  }, []);
  // Función para verificar si dos posiciones se superponen

  return (
    <div className="grid max-w-screen mb-20 lg:mb-0">
      <div className="absolute grid max-w-screen min-h-40 ">
        <div className="max-w-screen">
          <Meteors />
        </div>
      </div>
      <section className="container  min-h-[100vh] z-[100] py-20">
        <h2 className="text-center pb-20 text-3xl lg:text-5xl xl:pt-10 font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {t.skillsTitle}
        </h2>
        <div className="grid gap-20 lg:grid-cols-2 items-center">
          <section className="grid">
            <div className="group relative bg-gradient-to-br from-purple-900/70 to-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-600/40 hover:border-purple-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="relative text-pretty z-10 grid gap-6 rounded-lg my-auto">
                <p className="text-2xl leading-relaxed text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
                  {t.skillsIntro[0]}{" "}
                  <span className="font-bold text-purple-300">
                    {t.skillsIntro[1]}
                  </span>{" "}
                  {t.skillsIntro[2]}{" "}
                  <strong className="text-purple-300 font-semibold">
                    DevOps
                  </strong>
                  {language === "es" ? ", " : ", "}{t.skillsIntro[3]}{" "}
                  <strong className="text-purple-300 font-semibold">
                    {t.skillsIntro[4]}
                  </strong>{" "}
                  {t.skillsIntro[5]}{" "}
                  <strong className="whitespace-nowrap text-purple-300 font-semibold">
                    {t.skillsIntro[6]}
                  </strong>
                  . {t.skillsIntro[7]}{" "}
                  <strong className="text-blue-300 font-semibold">
                    {t.skillsIntro[8]}
                  </strong>
                  .
                </p>

                <p className="text-lg leading-relaxed text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                  {t.skillsExperienceStart}{" "}
                  <strong className="text-purple-300 font-semibold">
                    {t.experienceYears}
                  </strong>{" "}
                  {t.skillsExperienceMiddle}{" "}
                  <em className="text-emerald-300 font-medium">
                    {t.skillsExperienceEmphasis}
                  </em>{" "}
                  {t.skillsExperienceEnd}
                </p>

                <div className="pt-4 border-t border-gray-600/30">
                  <p className="text-lg leading-relaxed text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                    {t.skillsStackStart}{" "}
                    <strong className="text-purple-300 font-medium">
                      {t.skillsStackFrontend}
                    </strong>{" "}
                    {t.skillsStackMiddle}{" "}
                    <strong className="text-purple-300 font-medium">
                      {t.skillsStackCloud}
                    </strong>
                    . {t.skillsStackEnd}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section ref={haloRef} className={styles.halo}>
            {cubeReady && <TechCube technologies={TECHNOLOGIES} />}
          </section>
        </div>
      </section>
    </div>
  );
}
