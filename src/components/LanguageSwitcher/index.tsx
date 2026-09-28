import { useRef, type PointerEvent } from "react";
import { useLanguage, type Language } from "../../i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const lastSwipeAt = useRef(0);

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "touch") return;
    touchStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || start.id !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 16 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;

    lastSwipeAt.current = Date.now();
    setLanguage(deltaX > 0 ? "en" : "es");
  }

  return (
    <nav aria-label={language === "es" ? "Seleccionar idioma" : "Select language"} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { touchStart.current = null; }} className="fixed right-3 top-3 z-[200] touch-pan-y select-none rounded-full border border-white/25 bg-[#08080a] p-[3px] shadow-[0_8px_22px_rgba(0,0,0,.5)] sm:right-6 sm:top-5">
      <div className="relative flex items-center">
        <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full border border-violet-300/65 bg-[#211b2b] shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_2px_8px_rgba(0,0,0,.3)] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${language === "en" ? "translate-x-full" : "translate-x-0"}`} />
        {(["es", "en"] as Language[]).map((option) => (
          <button key={option} type="button" lang={option} onClick={() => { if (Date.now() - lastSwipeAt.current >= 500) setLanguage(option); }} aria-label={option === "es" ? "Español" : "English"} aria-pressed={language === option} className={`relative z-10 grid h-10 w-10 place-items-center rounded-full text-[11px] font-semibold tracking-wide transition-[color,transform] duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300 motion-reduce:transition-none sm:h-9 sm:w-10 ${language === option ? "text-white" : "text-gray-400 hover:text-white"}`}>
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
