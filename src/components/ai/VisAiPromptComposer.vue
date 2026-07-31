<script setup lang="ts">
import { mergeAttributes, Node } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import { NodeSelection } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor, VueNodeViewRenderer } from '@tiptap/vue-3'
import { computed, onBeforeUnmount, watch } from 'vue'

import type { VisAiSenderSkill } from './ai.types'
import VisAiPromptSkillNode from './VisAiPromptSkillNode.vue'

defineOptions({ name: 'VisAiPromptComposer' })

const props = withDefaults(defineProps<{
  modelValue?: string
  skill?: VisAiSenderSkill
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autoFocus?: boolean
  maxLength?: number
}>(), {
  modelValue: '',
  skill: undefined,
  placeholder: '请描述您的问题',
  disabled: false,
  readonly: false,
  autoFocus: false,
  maxLength: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
  removeSkill: []
  files: [files: File[]]
  skillRequest: []
}>()

const PromptSkill = Node.create({
  name: 'promptSkill',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      key: { default: '' },
      label: { default: '' },
      color: { default: 'blue' },
      iconName: { default: 'book-open-01' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-prompt-skill]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-prompt-skill': '',
        contenteditable: 'false',
      }),
    ]
  },

  renderText() {
    return ''
  },

  addNodeView() {
    return VueNodeViewRenderer(VisAiPromptSkillNode)
  },
})

function textNodes(value: string): Array<Record<string, unknown>> {
  const nodes: Array<Record<string, unknown>> = []
  value.split('\n').forEach((part, index) => {
    if (index > 0) nodes.push({ type: 'hardBreak' })
    if (part) nodes.push({ type: 'text', text: part })
  })
  return nodes
}

function contentDocument() {
  const content: Array<Record<string, unknown>> = []
  if (props.skill) {
    content.push({
      type: 'promptSkill',
      attrs: {
        key: String(props.skill.key),
        label: props.skill.label,
        color: props.skill.color ?? 'blue',
        iconName: props.skill.iconName ?? 'book-open-01',
      },
    })
  }
  content.push(...textNodes(props.modelValue))
  return {
    type: 'doc',
    content: [{
      type: 'paragraph',
      ...(content.length ? { content } : {}),
    }],
  }
}

function pastedFiles(event: ClipboardEvent | DragEvent): File[] {
  const transfer = event instanceof ClipboardEvent
    ? event.clipboardData
    : event.dataTransfer
  return Array.from(transfer?.files ?? [])
}

function deletePromptSkill(view: EditorView, event: KeyboardEvent): boolean {
  if (event.key !== 'Backspace' && event.key !== 'Delete') return false

  const { selection } = view.state
  let from: number | undefined
  let to: number | undefined

  if (
    selection instanceof NodeSelection
    && selection.node.type.name === 'promptSkill'
  ) {
    from = selection.from
    to = selection.to
  } else if (selection.empty && event.key === 'Backspace') {
    const node = selection.$from.nodeBefore
    if (node?.type.name === 'promptSkill') {
      from = selection.from - node.nodeSize
      to = selection.from
    }
  } else if (selection.empty && event.key === 'Delete') {
    const node = selection.$from.nodeAfter
    if (node?.type.name === 'promptSkill') {
      from = selection.from
      to = selection.from + node.nodeSize
    }
  }

  if (from === undefined || to === undefined) return false
  event.preventDefault()
  view.dispatch(view.state.tr.delete(from, to))
  return true
}

let syncing = false
const editor = useEditor({
  content: contentDocument(),
  extensions: [
    StarterKit.configure({
      heading: false,
      blockquote: false,
      bulletList: false,
      codeBlock: false,
      horizontalRule: false,
      orderedList: false,
    }),
    Placeholder.configure({
      placeholder: () => props.placeholder,
    }),
    PromptSkill,
  ],
  autofocus: props.autoFocus ? 'end' : false,
  editable: !props.disabled && !props.readonly,
  editorProps: {
    attributes: {
      'aria-label': props.placeholder,
      class: 'vis-ai-prompt-composer__content',
      role: 'textbox',
    },
    handleKeyDown: (view, event) => {
      if (deletePromptSkill(view, event)) return true
      if (
        event.key !== 'Enter'
        || event.isComposing
        || event.keyCode === 229
      ) return false

      event.preventDefault()
      if (event.ctrlKey || event.metaKey) {
        editor.value?.chain().focus().setHardBreak().run()
      } else {
        emit('submit')
      }
      return true
    },
    handleTextInput: (view, _from, _to, text) => {
      if (text !== '/' || view.state.doc.textContent.trim()) return false
      emit('skillRequest')
      return true
    },
    handlePaste: (_view, event) => {
      const files = pastedFiles(event)
      if (!files.length) return false
      event.preventDefault()
      emit('files', files)
      return true
    },
    handleDrop: (_view, event) => {
      const files = pastedFiles(event)
      if (!files.length) return false
      event.preventDefault()
      emit('files', files)
      return true
    },
  },
  onUpdate: ({ editor: currentEditor }) => {
    if (syncing) return
    let hasSkill = false
    currentEditor.state.doc.descendants((node) => {
      if (
        node.type.name === 'promptSkill'
        && props.skill
        && String(node.attrs.key) === String(props.skill.key)
      ) {
        hasSkill = true
      }
    })
    if (props.skill && !hasSkill) emit('removeSkill')

    const value = currentEditor.getText({ blockSeparator: '\n' })
    if (props.maxLength !== undefined && value.length > props.maxLength) {
      currentEditor.commands.undo()
      return
    }
    emit('update:modelValue', value)
  },
})

const skillSignature = computed(() => JSON.stringify(
  props.skill
    ? [
        props.skill.key,
        props.skill.label,
        props.skill.color,
        props.skill.iconName,
      ]
    : null,
))

function syncDocument(focus = false): void {
  if (!editor.value) return
  syncing = true
  const position = editor.value.state.selection.from
  editor.value.commands.setContent(contentDocument(), { emitUpdate: false })
  const maxPosition = editor.value.state.doc.content.size
  editor.value.commands.setTextSelection(Math.min(position, maxPosition))
  if (focus) editor.value.commands.focus()
  syncing = false
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value || editor.value.getText({ blockSeparator: '\n' }) === value) return
    syncDocument()
  },
)

watch(skillSignature, () => syncDocument(true))
watch(
  () => [props.disabled, props.readonly],
  () => editor.value?.setEditable(!props.disabled && !props.readonly),
)
watch(
  () => props.placeholder,
  () => {
    editor.value?.view.dom.setAttribute('aria-label', props.placeholder)
  },
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <EditorContent
    :editor="editor"
    class="vis-ai-prompt-composer"
  />
</template>

<style scoped>
.vis-ai-prompt-composer {
  min-inline-size: 0;
  flex: 1 1 auto;
}

.vis-ai-prompt-composer :deep(.vis-ai-prompt-composer__content) {
  box-sizing: border-box;
  min-block-size: 32px;
  max-block-size: 160px;
  overflow: auto;
  outline: none;
  color: var(--color-text-primary);
  font: inherit;
  line-height: 24px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.vis-ai-prompt-composer :deep(.vis-ai-prompt-composer__content p) {
  margin: 0;
}

.vis-ai-prompt-composer :deep(.vis-ai-prompt-composer__content p.is-editor-empty:first-child::before) {
  float: inline-start;
  height: 0;
  color: var(--color-text-placeholder);
  content: attr(data-placeholder);
  pointer-events: none;
}

</style>
