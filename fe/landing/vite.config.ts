import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src"), "@assets": path.resolve(import.meta.dirname, "../../attached_assets") }, dedupe: ["react", "react-dom"] },
  build: { outDir: "dist/public", emptyOutDir: true },
  server: { host: "127.0.0.1", port: Number(process.env.PORT || 5173), strictPort: true },
});
