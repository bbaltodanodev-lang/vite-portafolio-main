import styles from "./styles.module.css";

interface Props {
  institution: string;
  title: string;
  category?: string;
}

const getCategoryStyle = (category?: string) => {
  switch (category) {
    case "AI/ML":
      return styles.categoryAI;
    case "Web Development":
      return styles.categoryWeb;
    case "Blockchain":
      return styles.categoryBlockchain;
    default:
      return styles.categoryWeb;
  }
};

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case "AI/ML":
      return "🤖";
    case "Web Development":
      return "💻";
    case "Blockchain":
      return "⛓️";
    default:
      return "📚";
  }
};

export const CourseCard = (props: Props) => {
  return (
    <div
      className={`${styles.courseCard} group/course block p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/60 hover:border-purple-400/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10`}
    >
      {/* Shimmer Effect */}
      <div className={styles.shimmer}></div>

      <div className="relative z-10">
        {/* Header with Category and Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
            {props.institution}
          </span>
          <span
            className={`${styles.categoryBadge} ${getCategoryStyle(
              props.category
            )}`}
          >
            <span>{getCategoryIcon(props.category)}</span>
            <span>{props.category}</span>
          </span>
        </div>

        {/* Course Title */}
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mt-2 group-hover/course:scale-125 transition-transform duration-200"></span>
          <p className="text-gray-300 leading-relaxed group-hover/course:text-gray-100 transition-colors duration-300 text-sm lg:text-base">
            {props.title}
          </p>
        </div>
      </div>
    </div>
  );
};
