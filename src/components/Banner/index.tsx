import { motion } from "framer-motion";

import { GithubIcon, LinkedinIcon } from "../Icons";
import StarsBg from "./Stars";
import styles from "./styles.module.css";
import { useParallax } from "./useParallax";
import { useLanguage } from "../../i18n/LanguageContext";
import { content } from "../../i18n/content";

export const Banner = () => {
  const { language } = useLanguage();
  const { homeBannerRef, textStyles, backgroundStyles, sphereStyles } =
    useParallax();

  return (
    <>
      {/* Encabezado principal único con animación parallax */}
      <div
        className="relative z-30"
        id="animated-content"
      >
        <section ref={homeBannerRef} className="container h-[900px] relative">
          <div className="sticky top-20 max-w-[800px] text-center mx-auto grid gap-18">
            <motion.div
              style={{
                color: textStyles.color,
              }}
            >
              <h1 className="font-extrabold mb-3 text-4xl sm:text-5xl break-words">Bernal Baltodano</h1>
              <p className="text-xl sm:text-2xl font-bold">
                {content[language].heroSubtitle}
              </p>
            </motion.div>
            <motion.div
              style={{
                color: textStyles.color,
              }}
              className="flex items-center justify-center gap-8"
            >
              <a
                href="https://github.com/bbaltodanodev-lang"
                className="size-20 p-1 rounded-full hover:scale-110 transition-transform hover:shadow-md hover:shadow-gray-300"
                aria-label="Github"
              >
                <GithubIcon className="size-full" />
              </a>
              <a
                href="https://www.linkedin.com/in/bernal-baltodano"
                className="size-20 p-1 rounded-sm hover:scale-110 transition-transform hover:shadow-md hover:shadow-gray-300"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="size-full" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Elementos de fondo y efectos visuales */}
      <motion.div
        className="w-full h-full absolute top-0 left-0 z-[-2]"
        style={{
          backgroundColor: backgroundStyles.color,
        }}
      />
      <StarsBg color={textStyles.starColor} />

      {/* Sphere como efecto visual */}
      <div className="absolute -z-1 top-0 w-full overflow-hidden h-[1500px] lg:h-[2200px] flex items-center">
        <motion.div style={sphereStyles} className={styles.sphere} />
      </div>
    </>
  );
};
