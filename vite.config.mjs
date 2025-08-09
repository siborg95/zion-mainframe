// vite.config.mjs
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // 0.0.0.0
    allowedHosts: ['oracle-front-end-production.up.railway.app'],
  },
  preview: {
    host: true, // 0.0.0.0
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    strictPort: true,
    allowedHosts: ['oracle-front-end-production.up.railway.app'],
  },
})
