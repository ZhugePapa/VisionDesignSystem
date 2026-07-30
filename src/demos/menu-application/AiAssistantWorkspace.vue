<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import aiLogoMarkup from '../../assets/AI-logo-2.svg?raw'
import {
  VisAiActions,
  VisAiAttachment,
  VisAiBubble,
  VisAiConversation,
  VisAiPrompts,
  VisAiSender,
  VisAiThinking,
} from '../../components/ai'
import type {
  VisAiActionFeedback,
  VisAiAttachmentItem,
  VisAiConversationItemData,
  VisAiKey,
  VisAiPromptItem,
  VisAiSenderModel,
  VisAiSenderSpeed,
  VisAiSenderSubmitPayload,
} from '../../components/ai'
import VisButton from '../../components/button/VisButton.vue'
import {
  VisDropdown,
  VisDropdownItem,
} from '../../components/dropdown'
import { VisMarkdown } from '../../components/markdown'
import {
  fetchVisionAiModels,
  streamVisionAiChat,
  type VisionAiMessage,
} from '../../services/ai/chat-client'
import chatBackgroundUrl from './assets/ai-chat-background.png'

defineOptions({ name: 'AiAssistantWorkspace' })

type AiAssistantMode = 'copilot' | 'independent' | 'float'
type AiChatTurnStatus = 'streaming' | 'done' | 'stopped' | 'error'

interface AiChatTurn {
  id: string
  question: string
  answer: string
  reasoning: string
  model: VisAiKey
  status: AiChatTurnStatus
  thinking: boolean
  thinkingExpanded: boolean
  feedback: VisAiActionFeedback
  attachments: VisAiAttachmentItem[]
}

interface AiChatSession {
  id: string
  title: string
  pinned: boolean
  turns: AiChatTurn[]
}

const props = defineProps<{
  mode: AiAssistantMode
}>()

const emit = defineEmits<{
  'update:mode': [mode: AiAssistantMode]
  close: []
}>()

const senderValue = ref('')
const deepThinking = ref(false)
const selectedModel = ref<VisAiKey>('')
const senderModels = ref<VisAiSenderModel[]>([
  { key: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', iconName: 'cube-01' },
  { key: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', iconName: 'cube-01' },
  { key: 'glm-5.2', label: 'GLM-5.2', iconName: 'cube-01' },
  { key: 'kimi-k2.7-code', label: 'Kimi K2.7 Code', iconName: 'cube-01' },
])
const selectedSpeed = ref<VisAiSenderSpeed>('high')
const selectedSkill = ref<VisAiKey | ''>('')
const attachments = ref<VisAiAttachmentItem[]>([])
const sessions = ref<AiChatSession[]>([])
const conversationKey = ref<VisAiKey>('')
const conversationCollapsed = ref(false)
const historyOpen = ref(false)
const modeMenuOpen = ref(false)
const responding = ref(false)
const assistantRef = ref<HTMLElement | null>(null)
const transcriptRef = ref<HTMLElement | null>(null)
const floatPosition = ref<{ x: number; y: number } | null>(null)
const isDraggingFloat = ref(false)
let activeController: AbortController | undefined
let requestSerial = 0
let dragPointerId: number | undefined
let dragOffsetX = 0
let dragOffsetY = 0

const promptItems: VisAiPromptItem[] = [
  {
    key: 'project-collaboration',
    label: '项目协同',
    iconName: 'layers-three-02',
    descriptions: ['生成里程碑与任务', '汇总项目进度', '预测项目延期与阻塞'],
  },
  {
    key: 'requirement-management',
    label: '需求管理',
    iconName: 'file-02',
    descriptions: ['生成用户故事或任务', '完善需求条目的验收项', '识别需求的关联模块'],
  },
  {
    key: 'code-quality',
    label: '代码质量',
    iconName: 'code-02',
    descriptions: ['提炼变更摘要', '检查缺陷与安全风险', '分析日志并定位故障'],
  },
  {
    key: 'delivery-security',
    label: '交付安全',
    iconName: 'rocket-02',
    descriptions: ['流水线诊断', '生成发布步骤与回滚方案', '识别安全漏洞'],
  },
]

const activeSession = computed(() => (
  sessions.value.find((session) => session.id === String(conversationKey.value))
))
const currentTurns = computed(() => activeSession.value?.turns ?? [])
const conversationItems = computed<VisAiConversationItemData[]>(() => (
  sessions.value
    .map((session) => ({
      key: session.id,
      label: session.title,
      group: session.pinned ? '置顶' : '今天',
      pinned: session.pinned,
    }))
    .sort((left, right) => Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)))
))
const hasChat = computed(() => currentTurns.value.length > 0)
const modeActionLabel = computed(() => (
  props.mode === 'float' ? '右侧吸附' : '浮动窗口'
))
const floatPositionStyle = computed(() => {
  if (props.mode !== 'float' || !floatPosition.value) return undefined

  return {
    insetInlineStart: `${floatPosition.value.x}px`,
    insetBlockStart: `${floatPosition.value.y}px`,
    insetInlineEnd: 'auto',
    insetBlockEnd: 'auto',
  }
})

function setMode(mode: AiAssistantMode): void {
  modeMenuOpen.value = false
  emit('update:mode', mode)
}

function closeAssistant(): void {
  historyOpen.value = false
  modeMenuOpen.value = false
  emit('close')
}

function abortActiveRequest(): void {
  activeController?.abort()
  activeController = undefined
}

function resetConversation(): void {
  abortActiveRequest()
  senderValue.value = ''
  attachments.value = []
  selectedSkill.value = ''
  responding.value = false
  conversationKey.value = ''
}

async function loadAvailableModels(): Promise<void> {
  try {
    const catalog = await fetchVisionAiModels()
    senderModels.value = catalog.models.map((model) => ({
      key: model.id,
      label: model.label,
      iconName: 'cube-01',
      disabled: !model.available,
    }))

    const selected = senderModels.value.find((model) => model.key === selectedModel.value)
    if (!selected || selected.disabled) {
      selectedModel.value = catalog.defaultModel
    }
  } catch {
    // Keep the local catalog visible when the API is unavailable during component development.
  }
}

function selectPrompt(item: VisAiPromptItem): void {
  senderValue.value = item.descriptions?.[0] ?? item.label
}

function addAttachment(): void {
  if (attachments.value.some((item) => item.key === 'demo-requirement')) return

  attachments.value = [
    {
      key: 'demo-requirement',
      name: '需求说明.doc',
      type: 'file',
      extension: 'doc',
      fileIconType: 'word',
      size: '6.83kb',
      removable: true,
    },
  ]
}

function removeAttachment(item: VisAiAttachmentItem): void {
  attachments.value = attachments.value.filter((entry) => entry.key !== item.key)
}

function createSession(question: string): AiChatSession {
  requestSerial += 1
  const session: AiChatSession = {
    id: `conversation-${Date.now()}-${requestSerial}`,
    title: question.slice(0, 28),
    pinned: false,
    turns: [],
  }

  sessions.value = [session, ...sessions.value]
  conversationKey.value = session.id
  return session
}

function messagesForTurn(session: AiChatSession, turnIndex: number): VisionAiMessage[] {
  const messages: VisionAiMessage[] = []

  for (const turn of session.turns.slice(0, turnIndex)) {
    messages.push({ role: 'user', content: turn.question })
    if (turn.answer.trim()) {
      messages.push({ role: 'assistant', content: turn.answer })
    }
  }

  messages.push({ role: 'user', content: session.turns[turnIndex].question })
  return messages
}

function errorMarkdown(message: string): string {
  const normalizedMessage = message.replace(/\s+/g, ' ').trim()
  return `> **AI 服务暂时不可用**\n>\n> ${normalizedMessage || '请稍后重试。'}`
}

async function runTurn(session: AiChatSession, turnIndex: number): Promise<void> {
  abortActiveRequest()

  const turn = session.turns[turnIndex]
  const controller = new AbortController()
  activeController = controller
  responding.value = true
  turn.answer = ''
  turn.reasoning = ''
  turn.status = 'streaming'
  turn.thinkingExpanded = true
  turn.feedback = null

  try {
    await streamVisionAiChat(
      {
        model: String(turn.model),
        messages: messagesForTurn(session, turnIndex),
        thinking: turn.thinking,
        reasoningEffort: selectedSpeed.value === 'ultra' ? 'max' : 'high',
      },
      {
        onReasoning: (content) => {
          turn.reasoning += content
        },
        onContent: (content) => {
          turn.answer += content
        },
        onDone: () => {
          turn.status = 'done'
        },
      },
      controller.signal,
    )

    if (turn.status === 'streaming') turn.status = 'done'
  } catch (error) {
    if (controller.signal.aborted) {
      turn.status = 'stopped'
      if (!turn.answer) turn.answer = '> 已停止生成。'
    } else {
      turn.status = 'error'
      turn.answer = errorMarkdown(
        error instanceof Error ? error.message : '未知错误，请稍后重试。',
      )
    }
  } finally {
    if (activeController === controller) {
      activeController = undefined
      responding.value = false
    }
  }
}

function submitQuestion(payload: VisAiSenderSubmitPayload): void {
  const question = payload.value.trim()
  if (!question) return

  const session = activeSession.value ?? createSession(question)
  const turn: AiChatTurn = {
    id: `turn-${Date.now()}-${session.turns.length + 1}`,
    question,
    answer: '',
    reasoning: '',
    model: payload.model ?? selectedModel.value,
    status: 'streaming',
    thinking: payload.deepThinking,
    thinkingExpanded: true,
    feedback: null,
    attachments: payload.attachments.map((item) => ({ ...item })),
  }

  session.turns.push(turn)
  senderValue.value = ''
  attachments.value = []
  selectedSkill.value = ''
  void runTurn(session, session.turns.length - 1)
}

function stopResponse(): void {
  activeController?.abort()
}

function regenerateTurn(turnId: string): void {
  const session = activeSession.value
  if (!session) return

  const turnIndex = session.turns.findIndex((turn) => turn.id === turnId)
  if (turnIndex < 0) return

  session.turns.splice(turnIndex + 1)
  void runTurn(session, turnIndex)
}

async function copyAnswer(answer: string): Promise<void> {
  if (!answer) return
  await navigator.clipboard.writeText(answer)
}

function thinkingLabel(turn: AiChatTurn): string {
  if (turn.status === 'streaming') return '正在思考...'
  if (turn.status === 'stopped') return '已停止思考'
  if (turn.status === 'error') return '思考中断'
  return '思考过程'
}

function thinkingContent(turn: AiChatTurn): string {
  if (turn.reasoning) return turn.reasoning
  return turn.status === 'streaming' ? '模型正在组织回答，请稍候。' : ''
}

function selectConversation(item: VisAiConversationItemData): void {
  abortActiveRequest()
  conversationKey.value = item.key
  senderValue.value = ''
  attachments.value = []
  selectedSkill.value = ''
  responding.value = false
}

function toggleConversationPin(item: VisAiConversationItemData): void {
  const target = sessions.value.find((session) => session.id === String(item.key))
  if (!target) return
  target.pinned = !target.pinned
}

function chooseHistory(item: VisAiConversationItemData): void {
  historyOpen.value = false
  selectConversation(item)
}

function chooseModeAction(): void {
  setMode(props.mode === 'float' ? 'copilot' : 'float')
}

function clampFloatPosition(x: number, y: number): { x: number; y: number } {
  const element = assistantRef.value
  if (!element) return { x, y }

  const rect = element.getBoundingClientRect()
  const maxX = Math.max(0, window.innerWidth - rect.width)
  const maxY = Math.max(0, window.innerHeight - rect.height)

  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  }
}

function moveFloatWindow(event: PointerEvent): void {
  if (!isDraggingFloat.value || event.pointerId !== dragPointerId) return
  event.preventDefault()
  floatPosition.value = clampFloatPosition(
    event.clientX - dragOffsetX,
    event.clientY - dragOffsetY,
  )
}

function stopFloatDrag(event?: PointerEvent): void {
  if (event && event.pointerId !== dragPointerId) return
  isDraggingFloat.value = false
  dragPointerId = undefined
  window.removeEventListener('pointermove', moveFloatWindow)
  window.removeEventListener('pointerup', stopFloatDrag)
  window.removeEventListener('pointercancel', stopFloatDrag)
}

function startFloatDrag(event: PointerEvent): void {
  if (props.mode !== 'float' || event.button !== 0 || !event.isPrimary) return

  const target = event.target
  if (
    target instanceof Element &&
    target.closest('button, a, input, textarea, select, [role="menuitem"]')
  ) {
    return
  }

  const element = assistantRef.value
  if (!element) return

  const rect = element.getBoundingClientRect()
  dragPointerId = event.pointerId
  dragOffsetX = event.clientX - rect.left
  dragOffsetY = event.clientY - rect.top
  floatPosition.value = { x: rect.left, y: rect.top }
  isDraggingFloat.value = true
  historyOpen.value = false
  modeMenuOpen.value = false
  event.preventDefault()

  window.addEventListener('pointermove', moveFloatWindow, { passive: false })
  window.addEventListener('pointerup', stopFloatDrag)
  window.addEventListener('pointercancel', stopFloatDrag)
}

function keepFloatWindowInViewport(): void {
  if (!floatPosition.value) return
  floatPosition.value = clampFloatPosition(
    floatPosition.value.x,
    floatPosition.value.y,
  )
}

watch(
  () => props.mode,
  () => {
    stopFloatDrag()
    historyOpen.value = false
    modeMenuOpen.value = false
  },
)

watch(
  () => currentTurns.value
    .map((turn) => `${turn.id}:${turn.reasoning.length}:${turn.answer.length}:${turn.status}`)
    .join('|'),
  async () => {
    await nextTick()
    const transcript = transcriptRef.value
    if (transcript) transcript.scrollTop = transcript.scrollHeight
  },
)

onMounted(() => {
  window.addEventListener('resize', keepFloatWindowInViewport)
  void loadAvailableModels()
})

onBeforeUnmount(() => {
  abortActiveRequest()
  stopFloatDrag()
  window.removeEventListener('resize', keepFloatWindowInViewport)
})
</script>

<template>
  <section
    ref="assistantRef"
    class="ai-assistant"
    :class="[
      `mode-${mode}`,
      {
        'has-chat': hasChat,
        'is-dragging': isDraggingFloat,
      },
    ]"
    :style="floatPositionStyle"
    aria-label="小 VI 智能助理"
  >
    <template v-if="mode === 'independent'">
      <VisAiConversation
        v-if="!conversationCollapsed"
        v-model="conversationKey"
        v-model:collapsed="conversationCollapsed"
        class="ai-assistant__conversation"
        :items="conversationItems"
        @create="resetConversation"
        @select="selectConversation"
        @pin="toggleConversationPin"
      />

      <VisAiConversation
        v-else
        v-model="conversationKey"
        v-model:collapsed="conversationCollapsed"
        class="ai-assistant__conversation-collapsed"
        :items="conversationItems"
        @create="resetConversation"
      />

      <div class="ai-assistant__independent-content">
        <div class="ai-assistant__independent-actions">
          <VisButton
            variant="text"
            size="md"
            icon-only
            icon-name="unexpand-06"
            label="退出全屏"
            @click="setMode('copilot')"
          />
          <VisDropdown v-model:open="modeMenuOpen" class="ai-assistant__header-dropdown">
            <template #trigger="{ toggle }">
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="dots-horizontal"
                label="更多显示方式"
                @click="toggle"
              />
            </template>
            <VisDropdownItem label="浮动窗口" @select="setMode('float')" />
            <VisDropdownItem label="右侧吸附" @select="setMode('copilot')" />
          </VisDropdown>
          <VisButton
            variant="text"
            size="md"
            icon-only
            icon-name="x-close"
            label="关闭 AI 助手"
            @click="closeAssistant"
          />
        </div>

        <div class="ai-assistant__column">
          <div class="ai-assistant__content">
            <div v-if="!hasChat" class="ai-assistant__welcome">
              <img class="ai-assistant__background" :src="chatBackgroundUrl" alt="">
              <span class="ai-assistant__logo" aria-hidden="true" v-html="aiLogoMarkup" />
              <h2>你好，我是 <span>小 VI 智能助理</span></h2>
              <VisAiPrompts
                class="ai-assistant__prompts"
                :items="promptItems"
                @select="selectPrompt"
              />
            </div>

            <div v-else ref="transcriptRef" class="ai-assistant__transcript">
              <section
                v-for="turn in currentTurns"
                :key="turn.id"
                class="ai-assistant__turn"
              >
                <div v-if="turn.attachments.length" class="ai-assistant__submitted-attachments">
                  <VisAiAttachment
                    v-for="item in turn.attachments"
                    :key="String(item.key)"
                    :item-key="item.key"
                    :name="item.name"
                    :type="item.type"
                    :extension="item.extension"
                    :file-icon-type="item.fileIconType"
                    :size="item.size"
                    :url="item.url"
                    :alt="item.alt"
                    :uploading="item.uploading"
                    :progress="item.progress"
                    :removable="false"
                  />
                </div>
                <div class="ai-assistant__user-message">
                  <VisAiBubble :content="turn.question" />
                </div>
                <VisAiThinking
                  v-if="turn.reasoning || turn.status === 'streaming'"
                  v-model:expanded="turn.thinkingExpanded"
                  :label="thinkingLabel(turn)"
                  :content="thinkingContent(turn)"
                />
                <div v-if="turn.answer" class="ai-assistant__answer">
                  <VisMarkdown
                    :content="turn.answer"
                    :streaming="{
                      hasNextChunk: turn.status === 'streaming',
                      enableAnimation: true,
                      tail: true,
                    }"
                  />
                  <VisAiActions
                    v-if="turn.status !== 'streaming'"
                    v-model:feedback="turn.feedback"
                    :current="1"
                    :total="1"
                    :disabled="responding"
                    @copy="copyAnswer(turn.answer)"
                    @refresh="regenerateTurn(turn.id)"
                  />
                </div>
              </section>
            </div>
          </div>

          <VisAiSender
            v-model="senderValue"
            v-model:deep-thinking="deepThinking"
            v-model:model="selectedModel"
            v-model:speed="selectedSpeed"
            v-model:skill="selectedSkill"
            :attachments="attachments"
            :models="senderModels"
            :loading="responding"
            @submit="submitQuestion"
            @stop="stopResponse"
            @attachment-request="addAttachment"
            @remove-attachment="removeAttachment"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div
        v-if="mode === 'float'"
        class="ai-assistant__drag-edge"
        aria-hidden="true"
        @pointerdown="startFloatDrag"
      />

      <header class="ai-assistant__header" @pointerdown="startFloatDrag">
        <strong>小 VI 智能助理</strong>
        <span class="ai-assistant__header-spacer" />
        <div class="ai-assistant__header-actions">
          <VisButton
            variant="text"
            size="md"
            icon-only
            icon-name="message-plus-circle"
            label="发起新会话"
            @click="resetConversation"
          />
          <VisDropdown v-model:open="historyOpen" class="ai-assistant__header-dropdown ai-assistant__history-dropdown">
            <template #trigger="{ toggle }">
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="clock-fast-forward"
                label="历史会话"
                @click="toggle"
              />
            </template>
            <VisDropdownItem
              v-for="item in conversationItems.slice(0, 6)"
              :key="String(item.key)"
              :label="item.label"
              :active="conversationKey === item.key"
              @select="chooseHistory(item)"
            />
          </VisDropdown>
          <VisButton
            variant="text"
            size="md"
            icon-only
            icon-name="expand-05"
            label="切换为独立式"
            @click="setMode('independent')"
          />
          <VisDropdown v-model:open="modeMenuOpen" class="ai-assistant__header-dropdown">
            <template #trigger="{ toggle }">
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="dots-horizontal"
                label="更多显示方式"
                @click="toggle"
              />
            </template>
            <VisDropdownItem :label="modeActionLabel" @select="chooseModeAction" />
          </VisDropdown>
          <VisButton
            variant="text"
            size="md"
            icon-only
            icon-name="x-close"
            label="关闭 AI 助手"
            @click="closeAssistant"
          />
        </div>
      </header>

      <div class="ai-assistant__content">
        <div v-if="!hasChat" class="ai-assistant__welcome">
          <img class="ai-assistant__background" :src="chatBackgroundUrl" alt="">
          <span class="ai-assistant__logo" aria-hidden="true" v-html="aiLogoMarkup" />
          <h2>你好，我是 <span>小 VI 智能助理</span></h2>
          <VisAiPrompts
            class="ai-assistant__prompts"
            :items="promptItems"
            @select="selectPrompt"
          />
        </div>

        <div v-else ref="transcriptRef" class="ai-assistant__transcript">
          <section
            v-for="turn in currentTurns"
            :key="turn.id"
            class="ai-assistant__turn"
          >
            <div v-if="turn.attachments.length" class="ai-assistant__submitted-attachments">
              <VisAiAttachment
                v-for="item in turn.attachments"
                :key="String(item.key)"
                :item-key="item.key"
                :name="item.name"
                :type="item.type"
                :extension="item.extension"
                :file-icon-type="item.fileIconType"
                :size="item.size"
                :url="item.url"
                :alt="item.alt"
                :uploading="item.uploading"
                :progress="item.progress"
                :removable="false"
              />
            </div>
            <div class="ai-assistant__user-message">
              <VisAiBubble :content="turn.question" />
            </div>
            <VisAiThinking
              v-if="turn.reasoning || turn.status === 'streaming'"
              v-model:expanded="turn.thinkingExpanded"
              :label="thinkingLabel(turn)"
              :content="thinkingContent(turn)"
            />
            <div v-if="turn.answer" class="ai-assistant__answer">
              <VisMarkdown
                :content="turn.answer"
                :streaming="{
                  hasNextChunk: turn.status === 'streaming',
                  enableAnimation: true,
                  tail: true,
                }"
              />
              <VisAiActions
                v-if="turn.status !== 'streaming'"
                v-model:feedback="turn.feedback"
                :current="1"
                :total="1"
                :disabled="responding"
                @copy="copyAnswer(turn.answer)"
                @refresh="regenerateTurn(turn.id)"
              />
            </div>
          </section>
        </div>
      </div>

      <VisAiSender
        v-model="senderValue"
        v-model:deep-thinking="deepThinking"
        v-model:model="selectedModel"
        v-model:speed="selectedSpeed"
        v-model:skill="selectedSkill"
        :attachments="attachments"
        :models="senderModels"
        :loading="responding"
        @submit="submitQuestion"
        @stop="stopResponse"
        @attachment-request="addAttachment"
        @remove-attachment="removeAttachment"
      />
    </template>
  </section>
</template>

<style scoped>
.ai-assistant {
  position: relative;
  box-sizing: border-box;
  min-inline-size: 0;
  min-block-size: 0;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-text);
}

.ai-assistant.mode-copilot,
.ai-assistant.mode-float {
  inline-size: 480px;
  border-inline-start: 1px solid var(--color-border-default);
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  overflow: hidden;
}

.ai-assistant.mode-copilot {
  block-size: 100%;
  flex: 0 0 480px;
}

.ai-assistant.mode-float {
  position: fixed;
  inset-inline-end: var(--space-20);
  inset-block-end: var(--space-20);
  z-index: 40;
  inline-size: min(480px, calc(100% - 40px));
  block-size: min(var(--space-768), calc(100% - 40px));
  border: 1px solid var(--color-border-default);
  border-radius: 0;
  box-shadow:
    0 0 4px 0 var(--color-effect-shadow-grey),
    0 12px 30px -2px var(--color-effect-shadow-grey);
}

.ai-assistant__drag-edge {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  block-size: var(--space-20);
  cursor: move;
  touch-action: none;
}

.mode-float .ai-assistant__header {
  cursor: move;
  touch-action: none;
}

.mode-float .ai-assistant__header button,
.mode-float .ai-assistant__header a {
  cursor: pointer;
}

.ai-assistant.mode-float.is-dragging,
.ai-assistant.mode-float.is-dragging * {
  user-select: none;
}

.ai-assistant.mode-independent {
  inline-size: 100%;
  block-size: 100%;
  border-inline-start: 1px solid var(--color-border-default);
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.ai-assistant__header {
  min-block-size: var(--space-32);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.ai-assistant__header strong {
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  white-space: nowrap;
}

.ai-assistant__header-spacer {
  min-inline-size: var(--space-4);
  flex: 1 1 0;
}

.ai-assistant__header-actions,
.ai-assistant__independent-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.ai-assistant__header-dropdown :deep(.vis-dropdown) {
  inset-inline-start: auto;
  inset-inline-end: 0;
  inline-size: 132px;
}

.ai-assistant__history-dropdown :deep(.vis-dropdown) {
  inline-size: var(--space-256);
}

.ai-assistant__content {
  position: relative;
  min-inline-size: 0;
  min-block-size: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.ai-assistant.has-chat .ai-assistant__content {
  overflow: hidden;
}

.ai-assistant__welcome {
  position: relative;
  z-index: 0;
  inline-size: 100%;
  margin-block: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-16);
}

.ai-assistant__background {
  position: absolute;
  z-index: -1;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 1000px;
  block-size: 1024px;
  max-inline-size: none;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
}

.ai-assistant__logo {
  inline-size: var(--space-48);
  block-size: var(--space-48);
  display: block;
}

.ai-assistant__logo :deep(svg) {
  inline-size: 100%;
  block-size: 100%;
  display: block;
  overflow: visible;
}

.ai-assistant__welcome h2 {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
}

.ai-assistant__welcome h2 span {
  color: transparent;
  background: var(--gradient-ai-100);
  background-clip: text;
  -webkit-background-clip: text;
}

.ai-assistant__prompts {
  inline-size: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-12);
}

.ai-assistant__prompts :deep(.vis-ai-prompts__item) {
  inline-size: 100%;
}

.mode-copilot .ai-assistant__prompts,
.mode-float .ai-assistant__prompts {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ai-assistant__transcript {
  min-block-size: 0;
  flex: 1 1 0;
  padding-inline: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-24);
  overflow-y: auto;
}

.ai-assistant__turn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-16);
}

.ai-assistant__submitted-attachments,
.ai-assistant__user-message {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-16);
}

.ai-assistant__answer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-16);
}

.ai-assistant__answer :deep(.vis-markdown) {
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.ai-assistant__conversation {
  block-size: 100%;
  flex: 0 0 auto;
}

.ai-assistant__conversation-collapsed {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 3;
}

.ai-assistant__independent-content {
  position: relative;
  min-inline-size: 0;
  min-block-size: 0;
  flex: 1 1 0;
  display: flex;
  justify-content: center;
}

.ai-assistant__independent-actions {
  position: absolute;
  inset-block-start: var(--space-20);
  inset-inline-end: var(--space-20);
  z-index: 4;
}

.ai-assistant__column {
  inline-size: min(100%, 1000px);
  block-size: 100%;
  padding-block: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

@media (max-width: 1100px) {
  .ai-assistant.mode-copilot {
    flex-basis: 420px;
    inline-size: 420px;
  }

  .ai-assistant__column {
    padding-inline: var(--space-20);
  }
}

@media (max-width: 760px) {
  .ai-assistant.mode-copilot {
    position: absolute;
    inset: 0;
    z-index: 35;
    inline-size: 100%;
    block-size: 100%;
    border-inline-start: 0;
  }

  .ai-assistant__conversation {
    display: none;
  }

  .ai-assistant__prompts,
  .mode-independent .ai-assistant__prompts {
    grid-template-columns: 1fr;
  }

  .ai-assistant__welcome h2 {
    font-size: var(--font-heading-h5-size);
    line-height: var(--font-heading-h5-line-height);
  }
}

</style>
