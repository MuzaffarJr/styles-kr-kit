import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three.js alohida chunk'larda: LCP'ni bloklamasin.
        // three128 — faqat ThreeUI Orbital Sphere uchun, o'sha sahna ochilgandagina yuklanadi.
        manualChunks: { three: ["three"], three128: ["three128"] },
      },
    },
  },
});
