import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  build: {
    minify: "esbuild",
    lib: {
      entry: "src/main.tsx",
      name: "App",
      fileName: () => `grippi-post-engine.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        format: "iife",
        name: "App",
      },
    },
    outDir: "D:\\KBs\\Grippi\\NETPostgreSQL002\\Web\\Resources\\grippi-post-engine",
  },
});
