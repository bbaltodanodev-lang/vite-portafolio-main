import { Helmet } from "react-helmet";
//import { useLocation } from 'react-router-dom'
import defaultImage from "../../assets/images/bcat-logo.png";

interface SeoProps {
  language?: "es" | "en";
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
}

interface Seo {
  title: string;
  description: string;
  titleTemplate: string;
  image: string;
  url: string;
}

export default function Seo({
  language = "es",
  title = "Bernal Baltodano - Systems Engineer, Full Stack Developer & Freelancer",
  description = "Systems Engineer, Full Stack Developer & Freelancer. +4 años en React, TypeScript, Docker y CI/CD.",
  imageUrl,
  keywords,
}: SeoProps) {
  //const { pathname } = useLocation()
  const url = "https://bbaltodano-portafolio.vercel.app";

  const seo: Seo = {
    title,
    description,
    titleTemplate: "%s",
    image: imageUrl || defaultImage,
    // url: `${url}${pathname}`
    url: `${url}`,
  };
  const defaultKeywords = [
    "Bernal Baltodano",
    "DevOps Engineer",
    "SRE",
    "Full Stack Developer",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "GitHub Actions",
    "React Developer",
    "TypeScript",
    "Node.js",
    "Microservicios",
    "Arquitectura de Software",
    "Linux",
    "Administración de Sistemas",
    "Web3",
    "Blockchain",
    "Ingeniero Electrónica",
    "Máster Ingeniería Software",
  ];

  // Schema.org JSON-LD para SEO estructurado
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bernal Baltodano",
    jobTitle: "Systems Engineer, Full Stack Developer & Freelancer",
    url: url,
    sameAs: [
      "https://github.com/bbaltodanodev-lang",
      "https://www.linkedin.com/in/bernal-baltodano",
    ],
    knowsAbout: [
      "DevOps",
      "Docker",
      "CI/CD",
      "React",
      "TypeScript",
      "Arquitectura de Software",
      "Microservices",
    ],
    alumniOf: [
      {
        "@type": "Organization",
        name: "Universidad del Cauca",
      },
      {
        "@type": "Organization",
        name: "Universidad Internacional de la Rioja",
      },
    ],
    description: description,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bernal Baltodano - Portafolio",
    url: url,
    description: description,
    author: {
      "@type": "Person",
      name: "Bernal Baltodano",
    },
    inLanguage: language === "es" ? "es-CR" : "en-US",
  };

  return (
    <Helmet title={seo.title} titleTemplate={seo.titleTemplate}>
      <html lang={language} />
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />
      <meta
        name="keywords"
        content={keywords ? keywords.join(", ") : defaultKeywords.join(", ")}
      />

      {/* Datos estructurados Schema.org */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Metadatos adicionales */}
      <meta name="author" content="Bernal Baltodano" />
      <meta name="language" content={language === "es" ? "Spanish" : "English"} />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      <OpenGraph seo={seo} language={language}></OpenGraph>
      <TwitterCard seo={seo} tagUser="@723Cartman"></TwitterCard>
      <LinkedIn />
    </Helmet>
  );
}

const OpenGraph = (props: { seo: Seo; language: "es" | "en"; appFbId?: string }) => {
  const { seo, language, appFbId } = props;
  return (
    <>
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta
        property="og:site_name"
        content="Bernal Baltodano - Systems Engineer, Full Stack Developer & Freelancer"
      />
      <meta property="og:locale" content={language === "es" ? "es_CR" : "en_US"} />
      <meta property="og:locale:alternate" content={language === "es" ? "en_US" : "es_CR"} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:secure_url" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Bernal Baltodano - Systems Engineer, Full Stack Developer & Freelancer"
      />
      <meta property="og:type" content="website" />
      {appFbId && <meta property="fb:app_id" content={appFbId} />}
    </>
  );
};

const TwitterCard = (props: { seo: Seo; tagUser: string }) => {
  const { seo, tagUser } = props;
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={tagUser} />
      <meta name="twitter:creator" content={tagUser} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta
        name="twitter:image:alt"
        content="Bernal Baltodano - Systems Engineer, Full Stack Developer & Freelancer"
      />
      <meta property="twitter:url" content={seo.url} />
    </>
  );
};

const LinkedIn = () => {
  return (
    <>
      {/* LinkedIn específico - evita duplicar meta tags de OpenGraph */}
      <meta
        property="article:author"
        content="https://www.linkedin.com/in/bernal-baltodano"
      />
      <meta name="author" content="Bernal Baltodano" />
    </>
  );
};
