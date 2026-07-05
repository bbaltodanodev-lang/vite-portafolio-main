export interface AcademicFormation {
  institution: string;
  degree: string;
  location: string;
  period: string;
  status: "completed" | "in-progress";
  logo?: string;
  description?: string;
}

export interface Course {
  institution: string;
  title: string;
  category?: string;
}

export const academicFormations: AcademicFormation[] = [
  {
    institution: "Universidad UACA",
    degree: "Ingeniería en Sistemas",
    location: "Nicoya, Costa Rica",
    period: "2024 - Presente",
    status: "in-progress",
    description:
      "Cursando la ingeniería con énfasis en software, procesamiento de datos, incluyendo metodologías y habilidades en análisis de datos.",
  },
];

export const complementaryCourses: Course[] = [
  {
    institution: "MIT",
    title: "Machine Learning with Python - From Linear Models to Deep Learning",
    category: "AI/ML",
  },
  {
    institution: "Harvard",
    title: "Web Development with Python and JavaScript",
    category: "Web Development",
  },
  {
    institution: "Harvard",
    title: "Introduction to Artificial Intelligence with Python",
    category: "AI/ML",
  },
  {
    institution: "Platzi",
    title: "Cursos de desarrollo WEB y relacionados",
    category: "Web Development",
  },
];
