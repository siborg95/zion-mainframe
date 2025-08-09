// vite.config.mjs
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    allowedHosts: ['oracle-front-end-production.up.railway.app']
  },
  preview: {
    host: true,
    allowedHosts: ['oracle-front-end-production.up.railway.app']
  }
})

