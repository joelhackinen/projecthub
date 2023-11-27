import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) =>
  command === "serve"
    ? {
        plugins: [react()],
        server: {
          watch: {
            usePolling: true,
          },
          host: true,
          port: 3000,
          strictPort: true,
        },
      }
    : {
        plugins: [react()],
        server: {
          port: 3000,
          strictPort: true,
        },
        build: {
          assetsDir: ".",
        },
      },
);
