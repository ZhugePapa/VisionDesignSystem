<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { VisButton } from '../button'
import { VisScrollShadow } from '../scroll-shadow'

export type VisCodeBlockType = 'default' | 'show_more'

const props = withDefaults(
  defineProps<{
    type?: VisCodeBlockType
    collapsed?: boolean
    autoHeight?: boolean
    heading?: boolean
    copy?: boolean
    language?: string
    code?: string
  }>(),
  {
    type: 'default',
    collapsed: false,
    autoHeight: false,
    heading: false,
    copy: true,
    language: 'Javascript',
    code: '',
  },
)

const isCollapsed = ref(props.collapsed)

watch(
  () => props.collapsed,
  (nextCollapsed) => {
    isCollapsed.value = nextCollapsed
  },
)

function toggleCollapsed(): void {
  isCollapsed.value = !isCollapsed.value
}

const isShowMore = computed(() => props.type === 'show_more')
const isCollapsedVariant = computed(() => isShowMore.value && isCollapsed.value)

const containerHeight = computed<string>(() => {
  if (props.autoHeight) return 'auto'
  if (!isShowMore.value) return '264px'
  if (!isCollapsed.value) return '854px'
  return '400px'
})

const codeIsScrollable = computed(() => isShowMore.value)

/* ------------------------------------------------------------------ */
/* Syntax highlighting (lightweight, design-matched color scheme)     */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set([
  'export', 'import', 'from', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'for', 'while', 'class', 'new', 'async', 'await', 'default',
  'typeof', 'instanceof', 'in', 'of', 'as', 'interface', 'type', 'enum',
  'extends', 'implements', 'static', 'public', 'private', 'protected',
  'readonly', 'try', 'catch', 'finally', 'throw', 'break', 'continue',
  'switch', 'case', 'do', 'void', 'this', 'super', 'yield', 'delete', 'true',
  'false', 'null', 'undefined', 'require', 'module', 'namespace',
])

const CONSTANTS = new Set([
  'true', 'false', 'null', 'undefined', 'None', 'True', 'False', 'NaN', 'Infinity',
])

const BUILTINS = new Set([
  'Array', 'Boolean', 'Date', 'Error', 'JSON', 'Map', 'Math', 'Number', 'Object',
  'Promise', 'RegExp', 'Set', 'String', 'console', 'document', 'window',
])

type TokenKind =
  | 'keyword'
  | 'number'
  | 'comment'
  | 'string'
  | 'operator'
  | 'constant'
  | 'function'
  | 'property'
  | 'variable'
  | 'builtin'
  | 'tag'
  | 'attribute'
  | 'punctuation'
  | 'plain'
interface Token { text: string; kind: TokenKind }

const TOKEN_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|(=>|===|!==|==|!=|<=|>=|=|:)|([^\s])/g

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let declarationPending = false
  let match: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(line)) !== null) {
    const [full, comment, str, num, ident, ws, op, other] = match
    const index = match.index ?? 0
    const before = line.slice(0, index)
    const after = line.slice(index + full.length)
    const tagStart = before.lastIndexOf('<')
    const tagEnd = before.lastIndexOf('>')
    const inTag = tagStart > tagEnd
    const tagNamePrefix = inTag ? before.slice(tagStart + 1).replace(/^\//, '') : ''

    if (comment) {
      tokens.push({ text: comment, kind: 'comment' })
    } else if (str) {
      tokens.push({ text: str, kind: 'string' })
    } else if (num) {
      tokens.push({ text: num, kind: 'number' })
    } else if (ident) {
      let kind: TokenKind = 'plain'
      if (inTag && /^[A-Za-z][\w:-]*$/.test(tagNamePrefix)) {
        kind = 'tag'
      } else if (inTag) {
        kind = 'attribute'
      } else if (CONSTANTS.has(ident)) {
        kind = 'constant'
      } else if (BUILTINS.has(ident)) {
        kind = 'builtin'
      } else if (KEYWORDS.has(ident)) {
        kind = 'keyword'
        declarationPending = ['const', 'let', 'var', 'function', 'class', 'interface', 'type'].includes(ident)
      } else if (declarationPending) {
        kind = 'variable'
        declarationPending = false
      } else if (after.trimStart().startsWith('(')) {
        kind = 'function'
      } else if (before.trimEnd().endsWith('.') || after.trimStart().startsWith(':')) {
        kind = 'property'
      }
      tokens.push({ text: ident, kind })
    } else if (ws) {
      tokens.push({ text: ws, kind: 'plain' })
    } else if (op) {
      tokens.push({ text: op, kind: 'operator' })
    } else {
      tokens.push({
        text: other || full,
        kind: /[{}()[\],.;:]/.test(other || full) ? 'punctuation' : 'plain',
      })
    }
  }
  return tokens
}

const codeLines = computed(() => {
  const code = props.code?.replace(/\n$/, '') ?? ''
  return code.split('\n').map(tokenizeLine)
})

/* ------------------------------------------------------------------ */
/* Copy to clipboard                                                   */
/* ------------------------------------------------------------------ */

const copyStatus = ref<'idle' | 'success' | 'error'>('idle')
let copyResetTimer: ReturnType<typeof setTimeout> | undefined

function setCopyStatus(status: 'success' | 'error'): void {
  copyStatus.value = status
  if (copyResetTimer) clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => {
    copyStatus.value = 'idle'
    copyResetTimer = undefined
  }, 2000)
}

async function copyCode(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.code)
    setCopyStatus('success')
  } catch {
    setCopyStatus('error')
  }
}

onBeforeUnmount(() => {
  if (copyResetTimer) clearTimeout(copyResetTimer)
})

defineOptions({ name: 'VisCodeBlock' })
</script>

<template>
  <div
    class="vis-code-block"
    :class="[`type-${type}`, { 'is-collapsed': isCollapsedVariant, 'is-expanded': !isCollapsedVariant }]"
    :style="{ height: containerHeight }"
  >
    <p v-if="heading" class="vis-code-block__heading">{{ language }}</p>

    <!-- Code area: VisScrollShadow when fixed-height, plain div when auto -->
    <VisScrollShadow
      v-if="codeIsScrollable"
      variant="secondary"
      :size="60"
      class="vis-code-block__code vis-code-block__code--scroll"
    >
      <pre class="vis-code-block__pre"><code><span
        v-for="(line, i) in codeLines"
        :key="i"
        class="vis-code-block__line"
      ><span
          v-for="(token, j) in line"
          :key="j"
          :class="`tok-${token.kind}`"
        >{{ token.text }}</span></span></code></pre>
    </VisScrollShadow>

    <div v-else class="vis-code-block__code vis-code-block__code--auto">
      <pre class="vis-code-block__pre"><code><span
        v-for="(line, i) in codeLines"
        :key="i"
        class="vis-code-block__line"
      ><span
          v-for="(token, j) in line"
          :key="j"
          :class="`tok-${token.kind}`"
        >{{ token.text }}</span></span></code></pre>
    </div>

    <!-- Copy button (absolute top-right) -->
    <div v-if="copy" class="vis-code-block__copy">
      <VisButton
        class="vis-code-block__copy-button"
        variant="text"
        size="md"
        icon-only
        icon-name="copy-05"
        :label="copyStatus === 'success' ? '已复制' : copyStatus === 'error' ? '复制失败' : '复制'"
        @click="copyCode"
      />
    </div>

    <!-- Collapse / expand toggle (absolute bottom-center, show_more only) -->
    <div v-if="isShowMore && copy" class="vis-code-block__toggle">
      <VisButton
        variant="secondary"
        prefix
        :icon-name="isCollapsed ? 'chevron-down-double' : 'chevron-up-double'"
        :label="isCollapsed ? '查看更多' : '收起更多'"
        @click="toggleCollapsed"
      >
        {{ isCollapsed ? '查看更多' : '收起更多' }}
      </VisButton>
    </div>
  </div>
</template>

<style scoped>
.vis-code-block {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-12);
  padding: var(--space-16);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  overflow: clip;
  width: 100%;
  max-width: 900px;
}

/* ---------- Heading ---------- */
.vis-code-block__heading {
  margin: 0;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ---------- Code area ---------- */
.vis-code-block__code {
  position: relative;
  width: 100%;
  min-width: 0;
}

.vis-code-block__code--scroll {
  flex: 1 0 0;
  min-height: 1px;
}

.vis-code-block__code--auto {
  flex-shrink: 0;
}

.vis-code-block__pre {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: var(--font-code-md-size);
  line-height: var(--font-code-md-line-height);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.vis-code-block__line {
  display: block;
}

/* ---------- Syntax highlight tokens ---------- */
/* Horizon-inspired semantic roles mapped to the local utility palette. */
.tok-keyword { color: var(--utility-violet-400); }
.tok-number { color: var(--utility-orange-400); }
.tok-comment { color: var(--color-text-tertiary); font-style: italic; }
.tok-operator { color: var(--color-text-tertiary); }
.tok-string { color: var(--utility-orange-300); }
.tok-constant { color: var(--utility-orange-400); }
.tok-function { color: var(--utility-aqua-500); }
.tok-property { color: var(--utility-red-400); }
.tok-variable { color: var(--utility-red-400); }
.tok-builtin { color: var(--utility-aqua-500); }
.tok-tag { color: var(--utility-red-400); }
.tok-attribute { color: var(--utility-orange-400); }
.tok-punctuation { color: var(--color-text-secondary); }
.tok-plain { color: var(--color-text-secondary); }

/* ---------- Copy button ---------- */
.vis-code-block__copy {
  position: absolute;
  top: 9px;
  right: 9px;
  z-index: 2;
  inline-size: var(--space-32);
  block-size: var(--space-32);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vis-code-block__copy :deep(.vis-button.vis-code-block__copy-button) {
  --vis-button-fg: var(--color-fg-tertiary);
  --vis-button-height: var(--space-32);
  --vis-button-icon-size: var(--space-16);

  inline-size: var(--space-32);
  block-size: var(--space-32);
}

/* ---------- Toggle button ---------- */
.vis-code-block__toggle {
  position: absolute;
  bottom: 11px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  filter: drop-shadow(0 1px 1px var(--color-effect-shadow-grey));
}
</style>
