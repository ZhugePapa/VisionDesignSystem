import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE ?? '/',
  appType: 'mpa',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: '/demo/',
    proxy: {
      '/api': {
        target: process.env.VISION_AI_API_URL ?? 'http://127.0.0.1:3100',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/embedded-assistant',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
    },
  },
})
