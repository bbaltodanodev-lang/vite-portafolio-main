import { useEffect } from "react";
import { googleAnalyticsId } from "../../data/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? (import.meta.env.PROD ? googleAnalyticsId : "");

export default function Analytics() {
  useEffect(() => {
    if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId) || document.querySelector(`script[data-ga4="${measurementId}"]`)) return;

    window.dataLayer = window.dataLayer || [];
    // Google's command queue uses the Arguments object from its standard snippet.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer?.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: true, allow_google_signals: false, allow_ad_personalization_signals: false });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.ga4 = measurementId;
    document.head.appendChild(script);
  }, []);

  return null;
}
