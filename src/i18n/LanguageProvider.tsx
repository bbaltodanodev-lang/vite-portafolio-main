import { useEffect, useState, type ReactNode } from "react";
import { LanguageContext, type Language } from "./LanguageContext";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return window.localStorage.getItem("portfolio-language") === "en" ? "en" : "es"; }
    catch { return "es"; }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try { window.localStorage.setItem("portfolio-language", language); } catch { /* Storage can be unavailable. */ }
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
