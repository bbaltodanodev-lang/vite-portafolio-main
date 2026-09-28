import { motion } from "framer-motion";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { useLanguage } from "../../i18n/LanguageContext";
import { content } from "../../i18n/content";

const Education = () => {
  const { language } = useLanguage();
  const t = content[language];
  return (
    <section className="py-20">
      <div className="container">
        {/* Section Title */}
        <h2 className="text-center mb-16 text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t.educationTitle}
        </h2>

        <div className="max-w-4xl mx-auto w-full px-4 lg:px-0">
          {/* Academic Education Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <section className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-gray-600/40 hover:border-blue-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 w-full">
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

              {/* Section Header */}
              <div className="relative z-10 flex gap-4 items-center mb-8">
                <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-all duration-300 group-hover:scale-110">
                  <HiOutlineAcademicCap className="text-blue-400" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {t.formalEducation}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{t.educationSubtitle}</p>
                </div>
              </div>

              {/* University Details */}
              <div className="relative z-10 mt-8 border-l-2 border-blue-500/50 pl-6 ml-4">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/30 mb-2">
                      {t.inProgress}
                    </span>
                    <h4 className="text-xl font-bold text-white">{t.degree} — UACA</h4>
                    <p className="text-blue-300 font-medium">{t.degree}</p>
                  </div>
                  <div className="text-gray-400 text-sm font-medium whitespace-nowrap bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                    {t.finalStage}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>
                  Nicoya, Costa Rica
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t.educationDescription}
                </p>
                <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                  <p className="text-sm text-gray-300"><strong className="text-white">{t.spanish}</strong><br />{t.native}</p>
                  <p className="text-sm text-gray-300"><strong className="text-white">{t.english}</strong><br />B2</p>
                  <p className="text-sm text-gray-300"><strong className="text-white">{t.portuguese}</strong><br />C2</p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
