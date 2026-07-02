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
        'components/accordion/index': fileURLToPath(new URL('./src/components/accordion/index.ts', import.meta.url)),
        'components/alert/index': fileURLToPath(new URL('./src/components/alert/index.ts', import.meta.url)),
        'components/avatar/index': fileURLToPath(new URL('./src/components/avatar/index.ts', import.meta.url)),
        'components/badge/index': fileURLToPath(new URL('./src/components/badge/index.ts', import.meta.url)),
        'components/breadcrumb/index': fileURLToPath(
          new URL('./src/components/breadcrumb/index.ts', import.meta.url),
        ),
        'components/button/index': fileURLToPath(new URL('./src/components/button/index.ts', import.meta.url)),
        'components/checkbox/index': fileURLToPath(new URL('./src/components/checkbox/index.ts', import.meta.url)),
        'components/code-block/index': fileURLToPath(new URL('./src/components/code-block/index.ts', import.meta.url)),
        'components/config-provider/index': fileURLToPath(
          new URL('./src/components/config-provider/index.ts', import.meta.url),
        ),
        'components/date-picker/index': fileURLToPath(
          new URL('./src/components/date-picker/index.ts', import.meta.url),
        ),
        'components/divider/index': fileURLToPath(new URL('./src/components/divider/index.ts', import.meta.url)),
        'components/drawer/index': fileURLToPath(new URL('./src/components/drawer/index.ts', import.meta.url)),
        'components/dropdown/index': fileURLToPath(new URL('./src/components/dropdown/index.ts', import.meta.url)),
        'components/featured-icon/index': fileURLToPath(
          new URL('./src/components/featured-icon/index.ts', import.meta.url),
        ),
        'components/icons/index': fileURLToPath(new URL('./src/components/icons/index.ts', import.meta.url)),
        'components/input/index': fileURLToPath(new URL('./src/components/input/index.ts', import.meta.url)),
        'components/loading/index': fileURLToPath(new URL('./src/components/loading/index.ts', import.meta.url)),
        'components/modal/index': fileURLToPath(new URL('./src/components/modal/index.ts', import.meta.url)),
        'components/radio/index': fileURLToPath(new URL('./src/components/radio/index.ts', import.meta.url)),
        'components/scroll-shadow/index': fileURLToPath(
          new URL('./src/components/scroll-shadow/index.ts', import.meta.url),
        ),
        'components/tag/index': fileURLToPath(new URL('./src/components/tag/index.ts', import.meta.url)),
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
