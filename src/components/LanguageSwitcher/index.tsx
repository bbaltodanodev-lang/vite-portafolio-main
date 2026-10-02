import { useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useLanguage, type Language } from "../../i18n/LanguageContext";
import styles from "./styles.module.css";

const OPTIONS: { value: Language; code: string; name: string; label: string }[] = [
  { value: "es", code: "ES", name: "Español", label: "Español" },
  { value: "en", code: "EN", name: "English", label: "English" },
];

const SWIPE_THRESHOLD = 16;

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const reduceMotion = useReducedMotion();
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const lastSwipeAt = useRef(0);
  const [pressed, setPressed] = useState<string | null>(null);

  function commit(option: Language) {
    // El swipe táctil dispara el mismo handler que el click; este bloqueo evita
    // un cambio de idioma doble cuando el gesto termina sobre un botón.
    if (Date.now() - lastSwipeAt.current < 500) return;
    setLanguage(option);
  }

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
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;

    lastSwipeAt.current = Date.now();
    setLanguage(deltaX > 0 ? "en" : "es");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();

    const index = OPTIONS.findIndex((option) => option.value === language);
    const next = OPTIONS[(index + (event.key === "ArrowRight" ? 1 : -1) + OPTIONS.length) % OPTIONS.length];

    setLanguage(next.value);
    // Mantiene el foco en la opción recién activa para poder seguir alternando.
    event.currentTarget
      .querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)
      ?.focus();
  }

  const active = OPTIONS.find((option) => option.value === language) ?? OPTIONS[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] flex justify-end px-5 pt-3 md:px-10 md:pt-5 2xl:px-20">
      <div className="w-full max-w-[1280px] flex justify-end xl:max-w-[1536px]">
        <nav
          aria-label={active.label === "Español" ? "Seleccionar idioma" : "Select language"}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { touchStart.current = null; }}
          onKeyDown={handleKeyDown}
          className={`${styles.switcher} pointer-events-auto select-none touch-pan-y`}
        >


          <div className={styles.track} role="group">
            {OPTIONS.map((option) => {
              const isActive = option.value === language;
              return (
                <button
                  key={option.value}
                  type="button"
                  data-value={option.value}
                  data-active={isActive}
                  lang={option.value}
                  aria-label={option.label}
                  aria-pressed={isActive}
                  onPointerDown={() => setPressed(option.value)}
                  onPointerUp={() => setPressed(null)}
                  onPointerLeave={() => setPressed(null)}
                  onClick={() => commit(option.value)}
                  className={styles.option}
                >
                  {isActive && (
                    <motion.span
                      layoutId="language-thumb"
                      className={styles.thumb}
                      aria-hidden="true"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 }
                      }
                      style={
                        pressed === option.value && !reduceMotion
                          ? { scale: 0.97 }
                          : undefined
                      }
                    />
                  )}

                  <span className={styles.code}>{option.code}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
