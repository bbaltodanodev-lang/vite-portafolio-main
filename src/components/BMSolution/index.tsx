import { motion } from "framer-motion";

const BM_URL = "https://bm-solutionscr.vercel.app/";

const BMSolution = () => {
  return (
    <section className="container pb-24 pt-24" aria-labelledby="bm-solution-title">
      <motion.a
        href={BM_URL}
        target="_blank"
        rel="noreferrer"
        className="group relative mx-auto block max-w-6xl overflow-hidden rounded-3xl border border-violet-300/25 bg-[radial-gradient(circle_at_12%_20%,rgba(103,211,234,.12),transparent_25%),radial-gradient(circle_at_88%_80%,rgba(168,85,247,.14),transparent_30%),#020207] p-[1px] shadow-[0_0_50px_rgba(103,211,234,.08)] transition-all duration-500 hover:-translate-y-1 hover:border-violet-300/70 hover:shadow-[0_0_65px_rgba(139,92,246,.24)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl transition-all duration-700 group-hover:bg-violet-300/25" />
        <div className="relative flex min-h-64 flex-col items-center justify-between gap-8 rounded-[22px] border border-white/5 px-7 py-9 sm:px-12 lg:flex-row lg:gap-12 lg:py-12">
          <div className="flex w-full shrink-0 items-center justify-center lg:w-[30%] lg:justify-start">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-3 shadow-[0_0_35px_rgba(168,85,247,.18)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[-3deg] sm:h-36 sm:w-36">
              <img
                src="/bm-logo-transparent.png"
                alt="Logo de BM Solutions"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">Mi emprendimiento</p>
            <h2 id="bm-solution-title" className="bg-gradient-to-r from-cyan-200 via-white to-purple-300 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl">BM Solutions</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">Sistemas web y páginas web profesionales para llevar negocios al siguiente nivel.</p>
            <div className="mt-5 grid max-h-0 grid-cols-1 gap-2 overflow-hidden text-xs text-gray-400 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 sm:grid-cols-3">
              <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">Diseño a medida</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">Sistemas escalables</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">Soporte cercano</span>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition-all duration-300 group-hover:bg-cyan-300/20 group-hover:gap-3">
            Ir a ver <span aria-hidden="true">↗</span>
          </span>
        </div>
      </motion.a>
    </section>
  );
};

export default BMSolution;
