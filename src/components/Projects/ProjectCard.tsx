import { useState } from "react";
import { motion } from "framer-motion";
import { ImageViewer } from "./ImageViewer";
import { useLanguage } from "../../i18n/LanguageContext";
import { content } from "../../i18n/content";
import { projectsEn } from "../../i18n/projects.en";

interface ProjectCardProps {
  project: {
    title: string;
    category?: string;
    description: string;
    development?: string;
    scalability?: string;
    url: string;
    domain: string;
    logo?: React.ReactNode;
    image: string;
    tech_icons?: { icon: React.ReactNode; name: string }[];
  };
  index: number;
  compact?: boolean;
}

const ProjectCard = (props: ProjectCardProps) => {
  const { project, index } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useLanguage();

  function openModal(e: React.MouseEvent) {
    e.stopPropagation();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      {isModalOpen && <ImageViewer project={project} closeModal={closeModal} />}
      <motion.article
        key={index}
        className="group relative flex h-full min-h-[570px] flex-col overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-md rounded-2xl p-5 border border-gray-600/40 hover:border-purple-400/60 transition-shadow duration-500 hover:shadow-xl hover:shadow-purple-500/25 max-w-sm mx-auto"
      >
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

        <div className="relative z-10 flex h-full flex-col">
          {/* Image section más pequeña */}
          <div
            className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl bg-black/30 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300 cursor-zoom-in"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={openModal}
          >
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              style={{ imageRendering: "auto" }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Icono de zoom */}
            <button
              type="button"
              aria-label={`${content[language].zoom} ${project.title}`}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => { event.stopPropagation(); setIsModalOpen(true); }}
              onClick={(event) => { event.stopPropagation(); openModal(event); }}
              className="absolute right-2.5 top-2.5 z-20 grid size-9 place-items-center rounded-full bg-black/75 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-purple-600"
            >
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">{language === "es" ? project.category : projectsEn[index].category}</p>
          <h3 className="mb-3 text-xl font-bold text-white">{project.title}</h3>

          <div className="mb-5 flex-1">
            <p className="text-[15px] text-gray-300 text-pretty leading-7 group-hover:text-gray-100 transition-colors duration-300">
              {language === "es" ? project.description : projectsEn[index].description}
            </p>
          </div>

          {/* Info section más compacta */}
          <section className="relative mt-auto pt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {project?.tech_icons?.map((tech, iconIndex) => (
                <div
                  key={iconIndex}
                  className="group/tech relative rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-200 ring-1 ring-inset ring-white/10 transition-colors duration-200 hover:ring-purple-400/50"
                  title={tech.name}
                >
                  <span className="flex items-center gap-1.5">{tech.icon}<span>{tech.name}</span></span>
                  {/* Tooltip */}
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.article>
    </>
  );
};

export default ProjectCard;
