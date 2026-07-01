import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist/lib',
    emptyOutDir: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'components/button/index': fileURLToPath(new URL('./src/components/button/index.ts', import.meta.url)),
        'components/code-block/index': fileURLToPath(new URL('./src/components/code-block/index.ts', import.meta.url)),
        'components/config-provider/index': fileURLToPath(
          new URL('./src/components/config-provider/index.ts', import.meta.url),
        ),
        'components/featured-icon/index': fileURLToPath(
          new URL('./src/components/featured-icon/index.ts', import.meta.url),
        ),
        'components/icons/index': fileURLToPath(new URL('./src/components/icons/index.ts', import.meta.url)),
        'components/input/index': fileURLToPath(new URL('./src/components/input/index.ts', import.meta.url)),
        'components/modal/index': fileURLToPath(new URL('./src/components/modal/index.ts', import.meta.url)),
        'components/scroll-shadow/index': fileURLToPath(
          new URL('./src/components/scroll-shadow/index.ts', import.meta.url),
        ),
      },
      name: 'VisionDesignSystem',
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },
})
