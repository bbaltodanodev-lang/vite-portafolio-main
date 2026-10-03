import { useEffect } from "react";
import type { Language } from "../../i18n/LanguageContext";

const SITE_URL = "https://bbaltodano-portafolio.vercel.app/";

const seoCopy = {
  es: {
    title: "Bernal Baltodano | Desarrollador Full Stack en Costa Rica",
    description: "Bernal Baltodano, desarrollador Full Stack en Costa Rica y fundador de Possible. Conoce su experiencia y proyectos web para empresas y organizaciones.",
    imageAlt: "Portafolio de Bernal Baltodano, desarrollador Full Stack",
    locale: "es_CR",
    language: "es-CR",
    jobTitle: "Desarrollador Full Stack",
    personDescription: "Desarrollador Full Stack en Costa Rica y fundador de Possible.",
    webDevelopment: "Desarrollo web",
  },
  en: {
    title: "Bernal Baltodano | Full Stack Developer in Costa Rica",
    description: "Bernal Baltodano is a Full Stack Developer in Costa Rica and founder of Possible. Explore his experience and web projects for businesses and organizations.",
    imageAlt: "Portfolio of Bernal Baltodano, Full Stack Developer",
    locale: "en_US",
    language: "en-US",
    jobTitle: "Full Stack Developer",
    personDescription: "Full Stack Developer in Costa Rica and founder of Possible.",
    webDevelopment: "Web development",
  },
} as const;

function updateMeta(selector: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}

export default function Seo({ language }: { language: Language }) {
  useEffect(() => {
    const copy = seoCopy[language];
    document.title = copy.title;
    updateMeta('meta[name="description"]', copy.description);
    updateMeta('meta[property="og:title"]', copy.title);
    updateMeta('meta[property="og:description"]', copy.description);
    updateMeta('meta[property="og:locale"]', copy.locale);
    updateMeta('meta[property="og:image:alt"]', copy.imageAlt);
    updateMeta('meta[name="twitter:title"]', copy.title);
    updateMeta('meta[name="twitter:description"]', copy.description);
    updateMeta('meta[name="twitter:image:alt"]', copy.imageAlt);

    const schema = document.getElementById("portfolio-schema");
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${SITE_URL}#bernal-baltodano`,
            name: "Bernal Baltodano",
            alternateName: "Bernal Baltodano Leiva",
            jobTitle: copy.jobTitle,
            description: copy.personDescription,
            url: SITE_URL,
            affiliation: { "@type": "Organization", name: "Possible", url: "https://possible.cr" },
            sameAs: [
              "https://github.com/bbaltodanodev-lang",
              "https://www.linkedin.com/in/bernal-baltodano",
            ],
            knowsAbout: [copy.webDevelopment, "React", "TypeScript", "PostgreSQL"],
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}#website`,
            name: "Bernal Baltodano",
            url: SITE_URL,
            inLanguage: copy.language,
            creator: { "@id": `${SITE_URL}#bernal-baltodano` },
          },
          {
            "@type": "WebPage",
            "@id": SITE_URL,
            url: SITE_URL,
            name: copy.title,
            description: copy.description,
            inLanguage: copy.language,
            isPartOf: { "@id": `${SITE_URL}#website` },
            about: { "@id": `${SITE_URL}#bernal-baltodano` },
            mainEntity: { "@id": `${SITE_URL}#bernal-baltodano` },
          },
        ],
      });
    }
  }, [language]);

  return null;
}
