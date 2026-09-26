import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three.js alohida chunk: LCP'ni bloklamasin
        manualChunks: { three: ["three"] },
      },
    },
  },
});
