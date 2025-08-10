import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  preview: {
    allowedHosts: ["oracle-front-end-production.up.railway.app"],
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 4173
  }
});
