export interface AcademicFormation {
  institution: string;
  degree: string;
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
    institution: "Universidad Nacional (UNA)",
    degree: "Ingeniería en Sistemas",
    period: "2024 - Presente",
    status: "in-progress",
    description:
      "Cursando la ingeniería con énfasis en software, procesamiento de datos, incluyendo metodologías y habilidades en análisis de datos.",
  },
];