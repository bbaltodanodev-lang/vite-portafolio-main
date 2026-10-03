import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 4050,
    fs: { strict: true },
  },
  preview: { host: "127.0.0.1" },
  build: {
    // Partir el bundle en chunks separados para que el navegador:
    // 1. Descargue chunks en paralelo
    // 2. Cachee librerías pesadas entre deploys
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js ~600 KB — cargado solo cuando el cubo entra en viewport
          "vendor-three": ["three"],
          // React core — crítico, pero separado del resto
          "vendor-react": ["react", "react-dom"],
          // Framer Motion — animaciones, se puede cachear aparte
          "vendor-framer": ["framer-motion"],
          // Lenis — scroll suave, muy ligero pero mejor separado
          "vendor-lenis": ["lenis"],
          // react-icons — puede ser grande si se importa mucho
          "vendor-icons": ["react-icons"],
        },
      },
    },
  },
});
