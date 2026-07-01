import { computed, defineComponent, h } from 'vue'

import './icon.css'
import type { IconName } from './generated/registry.generated'

export type IconComponentProps = {
  size?: number | string
  strokeWidth?: number | string
  label?: string
  decorative?: boolean
}

const ICON_VIEWBOX_SIZE = 16
const ICON_BASE_STROKE_WIDTH = 1

export function normalizeIconSize(size: number | string): string {
  if (typeof size === 'number') return `${size}px`
  const trimmed = size.trim()
  if (/^[\d.]+$/.test(trimmed)) return `${trimmed}px`
  return trimmed
}

export function normalizeIconStrokeWidth(strokeWidth: number | string): string {
  return typeof strokeWidth === 'number' ? String(strokeWidth) : strokeWidth.trim()
}

function formatIconStrokeWidth(strokeWidth: number): string {
  return Number(strokeWidth.toFixed(6)).toString()
}

export function getNumericIconSize(size: number | string): number | undefined {
  if (typeof size === 'number') return size

  const trimmed = size.trim()
  const rawSize = trimmed.match(/^(\d+(?:\.\d+)?)(?:px)?$/)
  if (rawSize) return Number(rawSize[1])

  const spacingToken = trimmed.match(/^var\(--space-(\d+(?:\.\d+)?)\)$/)
  if (spacingToken) return Number(spacingToken[1])

  return undefined
}

export function resolveIconStrokeWidth(size: number | string, strokeWidth?: number | string): string {
  if (strokeWidth != null) return normalizeIconStrokeWidth(strokeWidth)

  const numericSize = getNumericIconSize(size)
  if (!numericSize || numericSize <= 0) return String(ICON_BASE_STROKE_WIDTH)

  const renderedStrokeWidth =
    numericSize <= ICON_VIEWBOX_SIZE ? ICON_BASE_STROKE_WIDTH : numericSize / ICON_VIEWBOX_SIZE

  return formatIconStrokeWidth((renderedStrokeWidth * ICON_VIEWBOX_SIZE) / numericSize)
}

export function sanitizeSvgMarkup(markup: string): string {
  const trimmed = markup.trim()
  if (!trimmed.startsWith('<svg ') || !trimmed.endsWith('</svg>')) return ''

  return trimmed
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(?:href|xlink:href)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '')
}

export function createIconComponent(name: IconName, componentName: string, svgMarkup: string) {
  const safeSvgMarkup = sanitizeSvgMarkup(svgMarkup)

  return defineComponent({
    name: componentName,
    props: {
      size: {
        type: [Number, String],
        default: 16,
      },
      strokeWidth: {
        type: [Number, String],
        default: undefined,
      },
      label: {
        type: String,
        default: undefined,
      },
      decorative: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const resolvedSize = computed(() => normalizeIconSize(props.size))
      const resolvedStrokeWidth = computed(() => resolveIconStrokeWidth(props.size, props.strokeWidth))
      const iconStyle = computed(() => ({
        width: resolvedSize.value,
        height: resolvedSize.value,
        '--vis-icon-stroke-width': resolvedStrokeWidth.value,
      }))

      return () =>
        h('span', {
          class: 'vis-icon',
          style: iconStyle.value,
          'aria-hidden': props.decorative ? 'true' : undefined,
          'aria-label': props.decorative ? undefined : props.label ?? name,
          role: props.decorative ? undefined : 'img',
          innerHTML: safeSvgMarkup,
        })
    },
  })
}
