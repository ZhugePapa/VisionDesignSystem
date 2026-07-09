<script lang="ts">
import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify'
import { Marked, type MarkedExtension } from 'marked'
import {
  computed,
  defineComponent,
  h,
  Text,
  type Component,
  type PropType,
  type VNodeChild,
} from 'vue'

export type VisMarkdownTheme = 'light' | 'dark'
export type VisMarkdownStreamStatus = 'loading' | 'done'
export type VisMarkdownIncompleteType =
  | 'link'
  | 'image'
  | 'html'
  | 'emphasis'
  | 'list'
  | 'table'
  | 'inline-code'
  | 'code'

export interface VisMarkdownTailConfig {
  content?: string
  component?: Component
}

export interface VisMarkdownStreamingOption {
  hasNextChunk?: boolean
  enableAnimation?: boolean
  tail?: boolean | VisMarkdownTailConfig
  incompleteMarkdownComponentMap?: Partial<Record<VisMarkdownIncompleteType, string>>
}

export type VisMarkdownComponentMap = Record<string, Component | string>

interface PreparedMarkdown {
  source: string
  incompleteTypes: VisMarkdownIncompleteType[]
}

type SyntaxTokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'constant'
  | 'function'
  | 'property'
  | 'operator'
  | 'punctuation'
  | 'tag'
  | 'attribute'
  | 'builtin'

interface SyntaxToken {
  kind: SyntaxTokenKind
  value: string
}

const placeholderTagByType: Record<VisMarkdownIncompleteType, string> = {
  link: 'vis-md-incomplete-link',
  image: 'vis-md-incomplete-image',
  html: 'vis-md-incomplete-html',
  emphasis: 'vis-md-incomplete-emphasis',
  list: 'vis-md-incomplete-list',
  table: 'vis-md-incomplete-table',
  'inline-code': 'vis-md-incomplete-inline-code',
  code: 'vis-md-incomplete-code',
}

const placeholderTypeByTag = Object.fromEntries(
  Object.entries(placeholderTagByType).map(([type, tag]) => [tag, type]),
) as Record<string, VisMarkdownIncompleteType>

function escapeHtml(source: string): string {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function countMatches(source: string, pattern: RegExp): number {
  return source.match(pattern)?.length ?? 0
}

function buildPlaceholder(type: VisMarkdownIncompleteType, streaming: VisMarkdownStreamingOption): string {
  const tagName = streaming.incompleteMarkdownComponentMap?.[type] ?? placeholderTagByType[type]
  return `<${tagName}></${tagName}>`
}

function prepareStreamingMarkdown(
  source: string,
  streaming: VisMarkdownStreamingOption,
): PreparedMarkdown {
  if (!streaming.hasNextChunk) {
    return { source, incompleteTypes: [] }
  }

  let nextSource = source
  const incompleteTypes: VisMarkdownIncompleteType[] = []

  const addPlaceholder = (type: VisMarkdownIncompleteType): void => {
    if (!incompleteTypes.includes(type)) {
      incompleteTypes.push(type)
      nextSource = `${nextSource}\n\n${buildPlaceholder(type, streaming)}`
    }
  }

  const fenceMatches = nextSource.match(/(^|\n)(```|~~~)/g) ?? []
  if (fenceMatches.length % 2 === 1) {
    const lastFence = fenceMatches[fenceMatches.length - 1]
    const fence = lastFence.includes('~~~') ? '~~~' : '```'
    nextSource = `${nextSource}\n${fence}`
    addPlaceholder('code')
  }

  if (countMatches(nextSource, /(^|[^\\])`/g) % 2 === 1) {
    nextSource = `${nextSource}\``
    addPlaceholder('inline-code')
  }

  if (/!\[[^\]\n]*(?:\]\([^\)\n]*)?$/.test(nextSource)) {
    nextSource = nextSource.replace(/!\[[^\]\n]*(?:\]\([^\)\n]*)?$/, '')
    addPlaceholder('image')
  } else if (/(^|[^!])\[[^\]\n]*(?:\]\([^\)\n]*)?$/.test(nextSource)) {
    nextSource = nextSource.replace(/(^|[^!])\[[^\]\n]*(?:\]\([^\)\n]*)?$/, '$1')
    addPlaceholder('link')
  }

  if (/<[a-z][\w-]*(?:\s[^<>]*)?$/i.test(nextSource)) {
    nextSource = nextSource.replace(/<[a-z][\w-]*(?:\s[^<>]*)?$/i, '')
    addPlaceholder('html')
  }

  const lines = nextSource.trimEnd().split('\n')
  const lastLine = lines[lines.length - 1] ?? ''
  if (lastLine.includes('|') && !/^\s*\|?[\s:-]+\|[\s|:-]*$/.test(lastLine)) {
    addPlaceholder('table')
  }

  return { source: nextSource, incompleteTypes }
}

function mergeSanitizeConfig(
  customTags: string[],
  config?: DOMPurifyConfig,
): DOMPurifyConfig {
  const defaultTags = Object.values(placeholderTagByType)
  const extraTags = Array.isArray(config?.ADD_TAGS) ? config.ADD_TAGS : []
  const extraAttrs = Array.isArray(config?.ADD_ATTR) ? config.ADD_ATTR : []

  return {
    ...config,
    ADD_TAGS: [...new Set([...defaultTags, ...customTags, ...extraTags])],
    ADD_ATTR: [...new Set(['target', 'rel', 'class', 'data-language', ...extraAttrs])],
  }
}

function attributesFor(element: Element): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {}

  for (const attribute of Array.from(element.attributes)) {
    if (attribute.name === 'class') {
      attrs.class = attribute.value
      continue
    }

    if (attribute.name === 'checked') {
      attrs.checked = true
      continue
    }

    attrs[attribute.name] = attribute.value
  }

  return attrs
}

const syntaxPattern =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n\r]*|#[^\n\r]*|<!--[\s\S]*?-->)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')|(<\/?[a-zA-Z][\w:-]*|\/?>)|(\b[a-zA-Z_][\w:-]*(?=\s*=))|(\b(?:abstract|as|async|await|break|case|catch|class|const|continue|debugger|declare|def|default|delete|do|elif|else|enum|export|extends|final|finally|for|from|function|if|implements|import|in|interface|is|lambda|let|match|new|of|package|private|protected|public|raise|readonly|return|static|super|switch|this|throw|try|type|var|void|while|with|yield)\b)|(\b(?:true|false|null|undefined|None|True|False|NaN|Infinity)\b)|(\b(?:Array|Boolean|Date|Dict|Error|JSON|List|Map|Math|Number|Object|Promise|Record|RegExp|Set|String|Tuple|console|document|print|window)\b)|(\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b)|(\b[a-zA-Z_$][\w$-]*(?=\s*\())|([+\-*/%=&|!<>?~^]+)|([{}()[\],.;:])/g

function kindForSyntaxMatch(match: RegExpExecArray): SyntaxTokenKind {
  if (match[1]) return 'comment'
  if (match[2]) return 'string'
  if (match[3]) return 'tag'
  if (match[4]) return 'attribute'
  if (match[5]) return 'keyword'
  if (match[6]) return 'constant'
  if (match[7]) return 'builtin'
  if (match[8]) return 'number'
  if (match[9]) return 'function'
  if (match[10]) return 'operator'
  if (match[11]) return 'punctuation'
  return 'plain'
}

function highlightCode(source: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = []
  let cursor = 0

  syntaxPattern.lastIndex = 0

  for (const match of source.matchAll(syntaxPattern)) {
    const index = match.index ?? 0
    if (index > cursor) {
      tokens.push({ kind: 'plain', value: source.slice(cursor, index) })
    }
    tokens.push({ kind: kindForSyntaxMatch(match), value: match[0] })
    cursor = index + match[0].length
  }

  if (cursor < source.length) {
    tokens.push({ kind: 'plain', value: source.slice(cursor) })
  }

  return tokens
}

export default defineComponent({
  name: 'VisMarkdown',
  props: {
    content: {
      type: String,
      default: undefined,
    },
    components: {
      type: Object as PropType<VisMarkdownComponentMap>,
      default: () => ({}),
    },
    streaming: {
      type: Object as PropType<VisMarkdownStreamingOption>,
      default: () => ({}),
    },
    config: {
      type: Object as PropType<MarkedExtension>,
      default: () => ({ gfm: true }),
    },
    className: {
      type: String,
      default: '',
    },
    rootClassName: {
      type: String,
      default: '',
    },
    theme: {
      type: String as PropType<VisMarkdownTheme>,
      default: 'light',
    },
    openLinksInNewTab: {
      type: Boolean,
      default: false,
    },
    dompurifyConfig: {
      type: Object as PropType<DOMPurifyConfig>,
      default: undefined,
    },
    customTags: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    escapeRawHtml: {
      type: Boolean,
      default: false,
    },
    debug: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const markdownSource = computed(() => props.content ?? String(slots.default?.()[0]?.children ?? ''))

    const preparedMarkdown = computed(() => {
      const source = props.escapeRawHtml ? escapeHtml(markdownSource.value) : markdownSource.value
      return prepareStreamingMarkdown(source, props.streaming)
    })

    const sanitizedHtml = computed(() => {
      const marked = new Marked({ gfm: true }, props.config)
      const parsed = marked.parse(preparedMarkdown.value.source, { async: false })
      return DOMPurify.sanitize(
        parsed,
        mergeSanitizeConfig(props.customTags, props.dompurifyConfig),
      )
    })

    const parsedNodes = computed(() => {
      if (typeof document === 'undefined') return []

      const template = document.createElement('template')
      template.innerHTML = sanitizedHtml.value
      return Array.from(template.content.childNodes)
    })

    const streamStatus = computed<VisMarkdownStreamStatus>(() =>
      props.streaming.hasNextChunk ? 'loading' : 'done',
    )

    function renderNode(node: ChildNode, index: number): VNodeChild {
      if (node.nodeType === Node.TEXT_NODE) {
        return h(Text, String(node.textContent ?? ''))
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null
      }

      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      const placeholderType = placeholderTypeByTag[tagName]

      if (placeholderType) {
        return h(
          placeholderType === 'table' || placeholderType === 'code' ? 'div' : 'span',
          {
            key: `${tagName}-${index}`,
            class: ['vis-markdown__incomplete', `vis-markdown__incomplete--${placeholderType}`],
            'data-type': placeholderType,
            'aria-hidden': 'true',
          },
        )
      }

      const attrs = attributesFor(element)
      attrs.key = `${tagName}-${index}`

      if (tagName === 'a' && props.openLinksInNewTab) {
        attrs.target = '_blank'
        attrs.rel = 'noopener noreferrer'
      }

      const isCodeBlock = tagName === 'code' && element.parentElement?.tagName.toLowerCase() === 'pre'

      if (tagName === 'code') {
        const language = String(attrs.class ?? '').match(/language-([a-z0-9_-]+)/i)?.[1]
        if (language) {
          attrs['data-language'] = language
        }
      }

      const children = isCodeBlock
        ? highlightCode(String(element.textContent ?? '')).map((token, tokenIndex) =>
          token.kind === 'plain'
            ? h(Text, token.value)
            : h(
              'span',
              {
                key: `${tagName}-${index}-syntax-${tokenIndex}`,
                class: ['vis-markdown__syntax', `vis-markdown__syntax--${token.kind}`],
              },
              token.value,
            ),
        )
        : Array.from(element.childNodes).map(renderNode)
      const mappedComponent = props.components[tagName]

      if (mappedComponent) {
        return h(mappedComponent, { ...attrs, streamStatus: streamStatus.value }, () => children)
      }

      return h(tagName, attrs, children)
    }

    function renderTail(): VNodeChild {
      const tail = props.streaming.tail
      if (!props.streaming.hasNextChunk || !tail) return null

      if (typeof tail === 'object' && tail.component) {
        return h(tail.component, { content: tail.content })
      }

      const content = typeof tail === 'object' ? (tail.content ?? '▋') : '▋'
      return h('span', { class: 'vis-markdown__tail', 'aria-hidden': 'true' }, content)
    }

    return () =>
      h(
        'div',
        {
          class: [
            'vis-markdown-root',
            props.rootClassName,
          ],
          'data-theme': props.theme === 'dark' ? 'dark' : undefined,
        },
        [
          h(
            'div',
            {
              class: [
                'vis-markdown',
                `vis-markdown--${props.theme}`,
                props.className,
                {
                  'vis-markdown--streaming': props.streaming.hasNextChunk,
                  'vis-markdown--animated': props.streaming.enableAnimation,
                },
              ],
              'data-stream-status': streamStatus.value,
            },
            [
              ...parsedNodes.value.map(renderNode),
              renderTail(),
              props.debug
                ? h('pre', { class: 'vis-markdown__debug' }, JSON.stringify(preparedMarkdown.value, null, 2))
                : null,
            ],
          ),
        ],
      )
  },
})
</script>

<style>
.vis-markdown {
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  inline-size: 100%;
}

.vis-markdown p,
.vis-markdown div,
.vis-markdown span,
.vis-markdown li {
  overflow-wrap: break-word;
  word-break: break-word;
}

.vis-markdown h1,
.vis-markdown h2,
.vis-markdown h3,
.vis-markdown h4,
.vis-markdown h5 {
  color: var(--color-text-primary);
  font-weight: 600;
  margin: 0 0 var(--space-12) 0;
}

.vis-markdown h1 {
  font-size: var(--font-heading-h1-size);
  line-height: var(--font-heading-h1-line-height);
}

.vis-markdown h2 {
  font-size: var(--font-heading-h2-size);
  line-height: var(--font-heading-h2-line-height);
}

.vis-markdown h3 {
  font-size: var(--font-heading-h3-size);
  line-height: var(--font-heading-h3-line-height);
}

.vis-markdown h4 {
  font-size: var(--font-heading-h4-size);
  line-height: var(--font-heading-h4-line-height);
}

.vis-markdown h5 {
  font-size: var(--font-heading-h5-size);
  line-height: var(--font-heading-h5-line-height);
}

.vis-markdown p {
  margin: 0 0 var(--space-12) 0;
}

.vis-markdown p:first-child,
.vis-markdown ul:first-child,
.vis-markdown ol:first-child,
.vis-markdown pre:first-child,
.vis-markdown table:first-child {
  margin-top: 0;
}

.vis-markdown p:last-child,
.vis-markdown ul:last-child,
.vis-markdown ol:last-child,
.vis-markdown pre:last-child,
.vis-markdown table:last-child {
  margin-bottom: 0;
}

.vis-markdown ul,
.vis-markdown ol {
  display: flow-root;
  margin: 0 0 var(--space-12) var(--space-16);
  padding: 0 0 0 var(--space-16);
}

.vis-markdown ol > li {
  list-style: decimal;
}

.vis-markdown ul > li {
  list-style: disc;
}

.vis-markdown li {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-4) 0;
  position: relative;
}

.vis-markdown li::marker {
  color: var(--color-fg-primary);
  font-size: var(--font-heading-h5-size);
  font-weight: 400;
  line-height: var(--font-heading-h4-line-height);
}

.vis-markdown hr {
  border: 0;
  border-top: 1px solid var(--color-border-default);
  margin: var(--space-24) 0;
}

.vis-markdown table {
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border-default);
  border-collapse: separate;
  border-radius: var(--radius-sm);
  border-spacing: 0;
  display: block;
  inline-size: max-content;
  margin: 0 0 var(--space-24) 0;
  max-inline-size: 100%;
  overflow: auto;
}

.vis-markdown thead {
  background-color: var(--color-bg-secondary);
}

.vis-markdown tbody,
.vis-markdown tbody tr {
  background-color: var(--color-bg-surface);
}

.vis-markdown tbody tr {
  transition: background-color 200ms linear;
}

.vis-markdown tbody tr:hover {
  background-color: var(--color-bg-secondary);
}

.vis-markdown th,
.vis-markdown td {
  border: 0;
  border-inline-end: 1px solid var(--color-border-default);
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-8) var(--space-12);
}

.vis-markdown tr > :last-child {
  border-inline-end: 0;
}

.vis-markdown tbody tr:last-child > td {
  border-block-end: 0;
}

.vis-markdown th {
  color: var(--color-text-primary);
  font-weight: 600;
  text-align: left;
}

.vis-markdown td {
  color: var(--color-text-secondary);
}

.vis-markdown strong {
  color: var(--color-text-primary);
}

.vis-markdown blockquote {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-left: var(--space-4) solid var(--color-fg-disabled);
  border-radius: var(--radius-sm);
  margin: var(--space-12) 0;
  padding: var(--space-12);
  transition: background-color 0.2s ease;
}

.vis-markdown blockquote:hover {
  background-color: var(--color-bg-tertiary);
}

.vis-markdown pre,
.vis-markdown code {
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
}

.vis-markdown pre {
  margin: 0 0 var(--space-12) 0;
  overflow-x: auto;
}

.vis-markdown pre code {
  background: var(--color-bg-secondary) !important;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary) !important;
  display: block;
  font-size: var(--font-code-md-size);
  line-height: var(--font-code-md-line-height);
  margin: 0;
  padding: var(--space-16);
}

.vis-markdown__syntax--comment {
  color: var(--color-text-disabled);
}

.vis-markdown__syntax--punctuation {
  color: var(--color-text-secondary);
}

.vis-markdown__syntax--string {
  color: var(--utility-green-500);
}

.vis-markdown__syntax--number {
  color: var(--utility-orange-500);
}

.vis-markdown__syntax--keyword {
  color: var(--utility-blue-500);
}

.vis-markdown__syntax--constant {
  color: var(--utility-purple-500);
}

.vis-markdown__syntax--function {
  color: var(--utility-cyan-500);
}

.vis-markdown__syntax--property {
  color: var(--utility-aqua-500);
}

.vis-markdown__syntax--operator {
  color: var(--utility-pink-500);
}

.vis-markdown__syntax--tag {
  color: var(--utility-pink-500);
}

.vis-markdown__syntax--attribute {
  color: var(--utility-violet-500);
}

.vis-markdown__syntax--builtin {
  color: var(--utility-moss-500);
}

.vis-markdown code:not(pre code) {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-bg-secondary) !important;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary) !important;
  font-size: var(--font-code-sm-size);
  line-height: var(--font-code-sm-line-height);
  margin-inline: var(--space-4);
  padding: var(--space-4) var(--space-6);
  vertical-align: 0.08em;
}

.vis-markdown img {
  block-size: auto;
  margin: var(--space-8) 0;
  max-inline-size: 100%;
}

.vis-markdown a {
  color: var(--color-text-brand-primary);
  position: relative;
  text-decoration: none;
  transition: color 0.2s ease;
}

.vis-markdown a:hover {
  color: color-mix(in srgb, var(--color-text-brand-primary) 90%, var(--color-component-hover));
  text-decoration: underline;
}

.vis-markdown__tail {
  animation: vis-markdown-tail-blink 1s steps(2, start) infinite;
  color: var(--color-text-secondary);
  display: inline;
  font-size: inherit;
  line-height: inherit;
}

.vis-markdown__incomplete {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  display: inline-block;
  inline-size: 4.5em;
  block-size: 1em;
  margin-inline: var(--space-4);
  vertical-align: -0.12em;
}

.vis-markdown__incomplete--table,
.vis-markdown__incomplete--code {
  block-size: var(--space-48);
  display: block;
  inline-size: min(100%, 360px);
  margin: 0 0 var(--space-12) 0;
}

.vis-markdown--animated > * {
  animation: vis-markdown-fade-in 200ms ease-in-out;
}

.vis-markdown__debug {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-code-sm-size);
  line-height: var(--font-code-sm-line-height);
  margin-top: var(--space-16);
  overflow: auto;
  padding: var(--space-12);
}

@keyframes vis-markdown-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes vis-markdown-tail-blink {
  0%,
  45% {
    opacity: 1;
  }

  46%,
  100% {
    opacity: 0.2;
  }
}
</style>
