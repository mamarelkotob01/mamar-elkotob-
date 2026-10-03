import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Standard Vite config for Production (Hostinger/GitHub Ready)
export default defineConfig({
  // Set to '/' for root domains or '/repo-name/' for GitHub Pages
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@workspace/api-client-react": path.resolve(import.meta.dirname, "../../lib/api-client-react/src/index.ts"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — stable, cached forever
          "vendor-react": ["react", "react-dom"],
          // Routing
          "vendor-router": ["wouter"],
          // Supabase SDK
          "vendor-supabase": ["@supabase/supabase-js"],
          // Animations — heavy, load separately
          "vendor-animations": ["framer-motion"],
          // TanStack Query — data layer
          "vendor-query": ["@tanstack/react-query"],
          // Icons
          "vendor-icons": ["lucide-react"],
          // Heavy utils only used in admin
          "vendor-xlsx": ["xlsx"],
        },
      },
    },
  },
  // Strip console.log and debugger statements from production build
  // (top-level esbuild config — this is the correct location in Vite)
  esbuild: {
    drop: ["console", "debugger"],
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  }
});
