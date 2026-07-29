<script setup lang="ts">
import { computed } from 'vue'

import codeUrl from './assets/Type=code.svg'
import excelUrl from './assets/Type=excel.svg'
import folderUrl from './assets/Type=folder.svg'
import folderOpenedUrl from './assets/Type=folder_opened.svg'
import imageUrl from './assets/Type=image.svg'
import pdfUrl from './assets/Type=pdf.svg'
import pptUrl from './assets/Type=ppt.svg'
import textUrl from './assets/Type=text.svg'
import unknownUrl from './assets/Type=unknow.svg'
import videoUrl from './assets/Type=video.svg'
import wordUrl from './assets/Type=word.svg'
import zipUrl from './assets/Type=zip.svg'
import type { VisFileIconProps, VisFileIconType } from './file-icon.types'

defineOptions({ name: 'VisFileIcon' })

const props = withDefaults(defineProps<VisFileIconProps>(), {
  type: 'unknown',
  size: 16,
  label: undefined,
  decorative: true,
})

const fileIconUrls: Record<VisFileIconType, string> = {
  code: codeUrl,
  excel: excelUrl,
  folder: folderUrl,
  'folder-opened': folderOpenedUrl,
  image: imageUrl,
  pdf: pdfUrl,
  ppt: pptUrl,
  text: textUrl,
  unknown: unknownUrl,
  video: videoUrl,
  word: wordUrl,
  zip: zipUrl,
}

const resolvedSize = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  const value = props.size.trim()
  return /^[\d.]+$/.test(value) ? `${value}px` : value
})
</script>

<template>
  <span
    class="vis-file-icon"
    :style="{ width: resolvedSize, height: resolvedSize }"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : label ?? type"
    :role="decorative ? undefined : 'img'"
  >
    <img class="vis-file-icon__image" :src="fileIconUrls[type]" alt="">
  </span>
</template>

<style scoped>
.vis-file-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  line-height: 0;
  vertical-align: middle;
}

.vis-file-icon__image {
  inline-size: 100%;
  block-size: 100%;
  display: block;
  object-fit: contain;
}
</style>
