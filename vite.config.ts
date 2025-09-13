import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    port: 4000,
    proxy: {
      // Proxies requests to the NPI registry
      "/api/npi": {
        target: "https://npiregistry.cms.hhs.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/npi/, "/api"),
      },
      // Proxies all other /api requests to the DoseSpot staging server
      "/api": {
        target: "https://my.staging.dosespot.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/webapi/v2/api"),
      },
    },
  },
});
