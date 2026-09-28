import { useLayoutEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../../data/projects";
import { useLanguage } from "../../i18n/LanguageContext";
import { content } from "../../i18n/content";

const COPIES = [0, 1, 2];

export default function Projects() {
  const { language } = useLanguage();
  const t = content[language];
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const step = useRef(0);
  const drag = useRef<{ id: number; startX: number; startY: number; lastX: number; moved: boolean } | null>(null);
  const paused = useRef(false);
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!viewport || !track || !first) return;
    let frame = 0;
    let previous = 0;
    let inView = false;
    let cardWidth = 0;
    const paint = () => {
      const cycle = step.current * projects.length;
      if (!cycle) return;
      const offset = ((position.current % cycle) + cycle) % cycle;
      track.style.transform = `translate3d(${-cycle - offset}px,0,0)`;
    };
    const measure = () => {
      cardWidth = first.getBoundingClientRect().width;
      step.current = cardWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
      paint();
    };
    const tick = (time: number) => {
      frame = 0;
      const elapsed = previous ? Math.min(time - previous, 50) : 0;
      previous = time;
      if (!paused.current && !drag.current) position.current += 18 * elapsed / 1000;
      paint();
      frame = requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      if (inView && !document.hidden) {
        if (!frame) { previous = 0; frame = requestAnimationFrame(tick); }
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
    };
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }, { rootMargin: "120px" });
    const resize = new ResizeObserver(measure);
    resize.observe(viewport); resize.observe(first); measure(); visibility.observe(viewport);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); document.removeEventListener("visibilitychange", updatePlayback); };
  }, []);

  const move = (direction: 1 | -1) => { position.current += direction * step.current; };
  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, moved: false };
    paused.current = true;
    if (event.pointerType !== "touch") event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    if (!state.moved) {
      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      if (event.pointerType === "touch" && Math.abs(deltaY) > Math.abs(deltaX)) {
        drag.current = null;
        paused.current = false;
        return;
      }
      if (Math.abs(deltaX) < 8) return;
      state.moved = true;
      setDragging(true);
      if (event.pointerType === "touch") event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    position.current -= event.clientX - state.lastX;
    state.lastX = event.clientX;
  };
  const pointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null; paused.current = false; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const wheelMove = (event: React.WheelEvent<HTMLDivElement>) => {
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
    if (!horizontal) return;
    event.preventDefault();
    paused.current = true;
    position.current += horizontal;
    window.setTimeout(() => { paused.current = false; }, 250);
  };

  return <section id="proyectos" className="w-full overflow-hidden py-20" aria-labelledby="projects-title"><div className="container"><h2 id="projects-title" className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent lg:text-5xl">{t.projectsTitle}</h2><p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">{t.projectsDescription}</p><div ref={viewportRef} tabIndex={0} className={`-mx-5 overflow-hidden px-5 outline-none select-none sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 ${dragging ? "cursor-grabbing" : "cursor-grab"}`} style={{ touchAction: "pan-y", WebkitUserSelect: "none" }} onWheel={wheelMove} onPointerEnter={() => { paused.current = true; }} onPointerLeave={() => { if (!drag.current) paused.current = false; }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}><div ref={trackRef} className="flex gap-6 will-change-transform">{COPIES.flatMap((copy) => projects.map((project, index) => <div key={`${copy}-${project.id}`} className="w-[88vw] max-w-[430px] shrink-0 sm:w-[430px]"><ProjectCard project={project} index={index} /></div>))}</div></div><div className="mt-7 flex items-center justify-between gap-4"><p className="text-xs text-gray-500">{t.projectsHint}</p><div className="flex shrink-0 gap-2"><button type="button" aria-label={t.previousProject} onClick={() => move(-1)} className="grid size-10 place-items-center rounded-full bg-white/5 text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">←</button><button type="button" aria-label={t.nextProject} onClick={() => move(1)} className="grid size-10 place-items-center rounded-full bg-white/5 text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">→</button></div></div></div></section>;
}
