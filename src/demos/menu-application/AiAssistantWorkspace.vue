<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import aiLogoMarkup from '../../assets/AI-logo-2.svg?raw'
import {
  VisAiActions,
  VisAiArtifact,
  VisAiAttachment,
  VisAiBubble,
  VisAiConversation,
  VisAiPrompts,
  VisAiSender,
  VisAiThinking,
} from '../../components/ai'
import type {
  VisAiArtifactItem,
  VisAiAttachmentItem,
  VisAiConversationAction,
  VisAiConversationItemData,
  VisAiKey,
  VisAiPromptItem,
  VisAiSenderModel,
  VisAiSenderSpeed,
  VisAiSenderSkill,
  VisAiSenderSubmitPayload,
} from '../../components/ai'
import VisButton from '../../components/button/VisButton.vue'
import {
  VisDropdown,
  VisDropdownItem,
} from '../../components/dropdown'
import VisInput from '../../components/input/VisInput.vue'
import { VisMarkdown } from '../../components/markdown'
import { VisTooltip } from '../../components/tooltip'
import {
  downloadVisionAiArtifact,
  fetchVisionAiArtifactContent,
} from '../../services/ai/artifact-client'
import {
  fetchVisionAiModels,
} from '../../services/ai/chat-client'
import {
  createVisionAiConversation,
  deleteVisionAiConversation,
  fetchVisionAiConversations,
  fetchVisionAiTurns,
  streamVisionAiConversation,
  updateVisionAiConversation,
  type VisionAiConversation,
  type VisionAiTurn,
} from '../../services/ai/conversation-client'
import {
  deleteVisionAiFile,
  uploadVisionAiFiles,
} from '../../services/ai/file-client'
import {
  fetchVisionAuthUser,
  signInVisionAccount,
  signOutVisionAccount,
  type VisionAuthUser,
} from '../../services/auth/auth-client'
import chatBackgroundUrl from './assets/ai-chat-background.png'

defineOptions({ name: 'AiAssistantWorkspace' })

type AiAssistantMode = 'copilot' | 'independent' | 'float'
type AiChatTurn = VisionAiTurn
interface AiChatSession extends VisionAiConversation {
  turns: AiChatTurn[]
  turnsLoaded: boolean
}

const props = withDefaults(defineProps<{
  mode: AiAssistantMode
  modeLocked?: boolean
}>(), {
  modeLocked: false,
})

const emit = defineEmits<{
  'update:mode': [mode: AiAssistantMode]
  close: []
}>()

const senderValue = ref('')
const deepThinking = ref(false)
const selectedModel = ref<VisAiKey>('')
const senderModels = ref<VisAiSenderModel[]>([
  { key: 'kimi-k3', label: 'Kimi K3', iconName: 'cube-01', supportsThinking: true },
  { key: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', iconName: 'cube-01', supportsThinking: true },
  { key: 'glm-5.2', label: 'GLM-5.2', iconName: 'cube-01', supportsThinking: true },
])
const selectedSpeed = ref<VisAiSenderSpeed>('high')
const selectedSkill = ref<VisAiKey | ''>('')
const senderSkills: VisAiSenderSkill[] = []
const attachments = ref<VisAiAttachmentItem[]>([])
const sessions = ref<AiChatSession[]>([])
const conversationKey = ref<VisAiKey>('')
const conversationCollapsed = ref(false)
const historyOpen = ref(false)
const modeMenuOpen = ref(false)
const responding = ref(false)
const authLoading = ref(true)
const authUser = ref<VisionAuthUser | null>(null)
const loginUsername = ref('')
const loginPassword = ref('')
const loginError = ref('')
const loginSubmitting = ref(false)
const assistantRef = ref<HTMLElement | null>(null)
const transcriptRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const floatPosition = ref<{ x: number; y: number } | null>(null)
const isDraggingFloat = ref(false)
const isFileDragActive = ref(false)
const uploadError = ref('')
const selectedArtifact = ref<VisAiArtifactItem | null>(null)
const artifactContent = ref('')
const artifactLoading = ref(false)
const artifactError = ref('')
let activeController: AbortController | undefined
let dragPointerId: number | undefined
let dragOffsetX = 0
let dragOffsetY = 0
let restoringDraft = false
const uploadControllers = new Map<string, AbortController>()
const retryFiles = new Map<string, File>()

const acceptedAttachmentTypes = [
  '.png', '.jpg', '.jpeg', '.webp',
  '.pdf', '.docx',
  '.txt', '.md', '.log', '.csv', '.json', '.yaml', '.yml', '.xml',
  '.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.vue',
  '.py', '.java', '.go', '.rs', '.c', '.h', '.cpp', '.hpp', '.sql', '.sh',
].join(',')

const promptItems: VisAiPromptItem[] = [
  {
    key: 'writing',
    label: '写作与整理',
    iconName: 'edit-05',
    descriptions: ['总结与提炼内容', '润色或改写文本', '起草提纲与文案'],
  },
  {
    key: 'learning-analysis',
    label: '学习与分析',
    iconName: 'lightbulb-05',
    descriptions: ['解释复杂概念', '比较方案与取舍', '制定计划与步骤'],
  },
  {
    key: 'creative-visual',
    label: '创意与视觉',
    iconName: 'image-03',
    descriptions: ['构思视觉方案', '优化图片生成提示词', '分析参考图片'],
  },
  {
    key: 'files-data',
    label: '文件与数据',
    iconName: 'file-05',
    descriptions: ['阅读并总结附件', '提取结构化信息', '转换内容格式'],
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
const hasHistory = computed(() => conversationItems.value.length > 0)
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

function draftStorageKey(conversationId: VisAiKey = conversationKey.value): string | null {
  if (!authUser.value?.id) return null
  return `vision-ai-draft:${authUser.value.id}:${String(conversationId || 'new')}`
}

function saveDraft(conversationId: VisAiKey = conversationKey.value): void {
  const key = draftStorageKey(conversationId)
  if (!key || restoringDraft) return
  const readyAttachments = attachments.value.filter(
    (item) => item.status === 'ready' && item.fileId,
  )
  if (!senderValue.value && !selectedSkill.value && !readyAttachments.length) {
    window.localStorage.removeItem(key)
    return
  }
  window.localStorage.setItem(key, JSON.stringify({
    value: senderValue.value,
    skill: selectedSkill.value,
    attachments: readyAttachments,
  }))
}

function restoreDraft(conversationId: VisAiKey = conversationKey.value): void {
  const key = draftStorageKey(conversationId)
  restoringDraft = true
  try {
    const stored = key ? window.localStorage.getItem(key) : null
    const draft = stored ? JSON.parse(stored) as {
      value?: string
      skill?: VisAiKey
      attachments?: VisAiAttachmentItem[]
    } : null
    senderValue.value = draft?.value ?? ''
    selectedSkill.value = draft?.skill ?? ''
    attachments.value = Array.isArray(draft?.attachments)
      ? draft.attachments.map((item) => ({ ...item, status: 'ready', uploading: false }))
      : []
  } catch {
    senderValue.value = ''
    selectedSkill.value = ''
    attachments.value = []
    if (key) window.localStorage.removeItem(key)
  } finally {
    restoringDraft = false
  }
}

function setMode(mode: AiAssistantMode): void {
  if (props.modeLocked) return
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

function abortUploads(): void {
  uploadControllers.forEach((controller) => controller.abort())
  uploadControllers.clear()
  retryFiles.clear()
}

function resetConversation(): void {
  abortActiveRequest()
  const previousConversationKey = conversationKey.value
  saveDraft(previousConversationKey)
  if (!previousConversationKey) {
    abortUploads()
    attachments.value.forEach((item) => {
      if (item.fileId) void deleteVisionAiFile(item.fileId)
    })
  }
  const newDraftKey = draftStorageKey('')
  if (newDraftKey) window.localStorage.removeItem(newDraftKey)
  responding.value = false
  conversationKey.value = ''
  senderValue.value = ''
  attachments.value = []
  selectedSkill.value = ''
  deepThinking.value = false
  uploadError.value = ''
  closeArtifactPreview()
  historyOpen.value = false
  modeMenuOpen.value = false
}

function sessionFromConversation(conversation: VisionAiConversation): AiChatSession {
  return {
    ...conversation,
    turns: [],
    turnsLoaded: false,
  }
}

async function loadConversationTurns(session: AiChatSession): Promise<void> {
  if (session.turnsLoaded) return
  session.turns = await fetchVisionAiTurns(session.id)
  session.turnsLoaded = true
}

async function loadConversations(): Promise<void> {
  const conversations = await fetchVisionAiConversations()
  sessions.value = conversations.map(sessionFromConversation)

  if (!conversationKey.value && sessions.value.length) {
    conversationKey.value = sessions.value[0].id
    await loadConversationTurns(sessions.value[0])
  }
}

async function loadAvailableModels(): Promise<void> {
  try {
    const catalog = await fetchVisionAiModels()
    senderModels.value = catalog.models.map((model) => ({
      key: model.id,
      label: model.label,
      iconName: 'cube-01',
      disabled: !model.available,
      supportsThinking: model.supportsThinking,
    }))

    const selected = senderModels.value.find((model) => model.key === selectedModel.value)
    if (!selected || selected.disabled) {
      selectedModel.value = catalog.defaultModel
    }
  } catch {
    // Keep the local catalog visible when the API is unavailable during component development.
  }
}

async function initializeAuth(): Promise<void> {
  authLoading.value = true
  try {
    authUser.value = await fetchVisionAuthUser()
    if (authUser.value) {
      await Promise.all([
        loadAvailableModels(),
        loadConversations(),
      ])
      restoreDraft()
    }
  } catch {
    authUser.value = null
  } finally {
    authLoading.value = false
  }
}

async function submitLogin(): Promise<void> {
  const username = loginUsername.value.trim()
  if (!username || !loginPassword.value || loginSubmitting.value) return

  loginSubmitting.value = true
  loginError.value = ''
  try {
    authUser.value = await signInVisionAccount(username, loginPassword.value)
    loginPassword.value = ''
    await Promise.all([
      loadAvailableModels(),
      loadConversations(),
    ])
    restoreDraft()
  } catch {
    loginError.value = '账号或密码错误，请重新输入。'
  } finally {
    loginSubmitting.value = false
  }
}

async function logout(): Promise<void> {
  abortActiveRequest()
  abortUploads()
  try {
    await signOutVisionAccount()
  } finally {
    authUser.value = null
    sessions.value = []
    conversationKey.value = ''
    senderValue.value = ''
    attachments.value = []
    responding.value = false
    closeArtifactPreview()
    historyOpen.value = false
    modeMenuOpen.value = false
  }
}

function selectPrompt(item: VisAiPromptItem): void {
  senderValue.value = item.descriptions?.[0] ?? item.label
}

function extensionOf(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? ''
}

function isImageFile(file: File): boolean {
  return ['png', 'jpg', 'jpeg', 'webp'].includes(extensionOf(file.name))
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openAttachmentPicker(): void {
  fileInputRef.value?.click()
}

async function uploadOneFile(file: File, existingKey?: VisAiKey): Promise<void> {
  const temporaryKey = String(existingKey || `upload-${crypto.randomUUID()}`)
  const optimistic: VisAiAttachmentItem = {
    key: temporaryKey,
    name: file.name,
    type: isImageFile(file) ? 'image' : 'file',
    extension: extensionOf(file.name),
    size: formatFileSize(file.size),
    uploading: true,
    progress: 0,
    status: 'uploading',
    removable: true,
  }
  const existingIndex = attachments.value.findIndex(
    (item) => String(item.key) === temporaryKey,
  )
  if (existingIndex >= 0) attachments.value.splice(existingIndex, 1, optimistic)
  else attachments.value.push(optimistic)
  const controller = new AbortController()
  uploadControllers.set(temporaryKey, controller)
  retryFiles.set(temporaryKey, file)

  try {
    const [uploaded] = await uploadVisionAiFiles([file], (progress) => {
      const current = attachments.value.find((item) => item.key === temporaryKey)
      if (current) current.progress = progress
    }, controller.signal)
    if (!uploaded) throw new Error('服务器没有返回已上传文件。')
    const index = attachments.value.findIndex((item) => item.key === temporaryKey)
    if (index >= 0) {
      attachments.value.splice(index, 1, {
        ...uploaded,
        uploading: false,
        progress: 100,
        status: 'ready',
        removable: true,
      })
      retryFiles.delete(temporaryKey)
    } else {
      await deleteVisionAiFile(uploaded.fileId)
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      attachments.value = attachments.value.filter(
        (item) => String(item.key) !== temporaryKey,
      )
      retryFiles.delete(temporaryKey)
      return
    }
    const current = attachments.value.find((item) => item.key === temporaryKey)
    if (current) {
      current.uploading = false
      current.status = 'error'
      current.error = error instanceof Error ? error.message : '上传失败。'
    }
    uploadError.value = error instanceof Error ? error.message : '上传失败。'
  } finally {
    uploadControllers.delete(temporaryKey)
  }
}

function uploadFiles(input: FileList | File[]): void {
  uploadError.value = ''
  const availableSlots = Math.max(0, 8 - attachments.value.length)
  const files = Array.from(input).slice(0, availableSlots)
  if (!files.length) {
    uploadError.value = availableSlots === 0
      ? '单次会话最多添加 8 个附件。'
      : '没有可上传的文件。'
    return
  }
  if (Array.from(input).length > availableSlots) {
    uploadError.value = `已达到 8 个附件上限，仅添加前 ${availableSlots} 个。`
  }
  files.forEach((file) => void uploadOneFile(file))
}

function chooseAttachmentFiles(event: Event): void {
  const input = event.target as HTMLInputElement
  if (input.files) uploadFiles(input.files)
  input.value = ''
}

function removeAttachment(item: VisAiAttachmentItem): void {
  attachments.value = attachments.value.filter((entry) => entry.key !== item.key)
  uploadControllers.get(String(item.key))?.abort()
  uploadControllers.delete(String(item.key))
  retryFiles.delete(String(item.key))
  if (item.fileId) void deleteVisionAiFile(item.fileId)
}

function retryAttachment(item: VisAiAttachmentItem): void {
  const file = retryFiles.get(String(item.key))
  if (!file || item.status !== 'error') return
  uploadError.value = ''
  void uploadOneFile(file, item.key)
}

function containsFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files')
}

function startFileDrag(event: DragEvent): void {
  if (!containsFiles(event) || !authUser.value) return
  isFileDragActive.value = true
}

function continueFileDrag(event: DragEvent): void {
  if (!containsFiles(event)) return
  isFileDragActive.value = true
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

function leaveFileDrag(event: DragEvent): void {
  if (!containsFiles(event)) return
  const nextTarget = event.relatedTarget
  if (
    nextTarget instanceof Node
    && assistantRef.value?.contains(nextTarget)
  ) return
  clearFileDrag()
}

function clearFileDrag(): void {
  isFileDragActive.value = false
}

function dropFiles(event: DragEvent): void {
  clearFileDrag()
  if (event.dataTransfer?.files.length) uploadFiles(event.dataTransfer.files)
}

async function createSession(question: string): Promise<AiChatSession> {
  const conversation = await createVisionAiConversation(question.slice(0, 28))
  const session: AiChatSession = {
    ...conversation,
    turns: [],
    turnsLoaded: true,
  }

  sessions.value = [session, ...sessions.value]
  conversationKey.value = session.id
  historyOpen.value = false
  await nextTick()
  return activeSession.value ?? session
}

function errorMarkdown(message: string): string {
  const normalizedMessage = message.replace(/\s+/g, ' ').trim()
  return `> **AI 服务暂时不可用**\n>\n> ${normalizedMessage || '请稍后重试。'}`
}

function emptyAnswerMarkdown(): string {
  return '> **未能生成最终回答**\n>\n> 模型已经结束推理，但没有返回正文。请重试，或关闭深度思考后再试。'
}

function answerVariantTotal(turn: AiChatTurn): number {
  return Math.max(1, (turn.answerVariants?.length ?? 0) + 1)
}

function answerVariantCurrent(turn: AiChatTurn): number {
  const total = answerVariantTotal(turn)
  return Math.min(total, Math.max(1, (turn.answerIndex ?? total - 1) + 1))
}

function displayedAnswer(turn: AiChatTurn): string {
  const index = answerVariantCurrent(turn) - 1
  return index < (turn.answerVariants?.length ?? 0)
    ? turn.answerVariants[index]?.answer ?? ''
    : turn.answer
}

function displayedReasoning(turn: AiChatTurn): string {
  const index = answerVariantCurrent(turn) - 1
  return index < (turn.answerVariants?.length ?? 0)
    ? turn.answerVariants[index]?.reasoning ?? ''
    : turn.reasoning
}

function displayedArtifacts(turn: AiChatTurn): VisAiArtifactItem[] {
  const answerVersion = answerVariantCurrent(turn) - 1
  return (turn.artifacts ?? []).filter(
    (artifact) => artifact.answerVersion === answerVersion,
  )
}

async function openArtifactPreview(artifact: VisAiArtifactItem): Promise<void> {
  selectedArtifact.value = artifact
  artifactContent.value = ''
  artifactError.value = ''
  artifactLoading.value = true
  try {
    artifactContent.value = await fetchVisionAiArtifactContent(artifact)
  } catch (error) {
    artifactError.value = error instanceof Error ? error.message : '文件加载失败。'
  } finally {
    if (selectedArtifact.value?.id === artifact.id) artifactLoading.value = false
  }
}

function closeArtifactPreview(): void {
  selectedArtifact.value = null
  artifactContent.value = ''
  artifactError.value = ''
  artifactLoading.value = false
}

function selectAnswerVariant(turn: AiChatTurn, current: number): void {
  turn.answerIndex = Math.min(
    answerVariantTotal(turn) - 1,
    Math.max(0, Math.floor(current) - 1),
  )
}

async function runTurn(
  session: AiChatSession,
  turnIndex: number,
  regenerate = false,
): Promise<void> {
  abortActiveRequest()

  const turn = session.turns[turnIndex]
  const controller = new AbortController()
  activeController = controller
  responding.value = true
  turn.answer = ''
  turn.reasoning = ''
  turn.answerIndex = turn.answerVariants?.length ?? 0
  turn.status = 'streaming'
  turn.thinkingExpanded = true
  turn.feedback = null
  turn.artifacts ??= []

  try {
    await streamVisionAiConversation(
      session.id,
      {
        model: String(turn.model),
        question: regenerate ? undefined : turn.question,
        regenerateTurnId: regenerate ? turn.id : undefined,
        thinking: turn.thinking,
        reasoningEffort: selectedSpeed.value === 'ultra' ? 'max' : 'high',
        attachments: regenerate ? undefined : turn.attachments,
      },
      {
        onStart: ({ turnId }) => {
          turn.id = turnId
        },
        onReasoning: (content) => {
          turn.reasoning += content
        },
        onContent: (content) => {
          turn.answer += content
        },
        onIncomplete: (content) => {
          turn.answer = content || emptyAnswerMarkdown()
          turn.status = 'error'
        },
        onTimeout: (content) => {
          turn.answer = content || '> **回答超时**\n>\n> 本次请求超过了服务器等待时间，请重试。'
          turn.status = 'timeout'
        },
        onArtifact: (artifact) => {
          turn.artifacts.push(artifact)
        },
        onDone: () => {
          if (turn.answer.trim()) {
            turn.status = 'done'
          } else {
            turn.answer = emptyAnswerMarkdown()
            turn.status = 'error'
          }
        },
      },
      controller.signal,
    )

    if (turn.status === 'streaming') {
      if (turn.answer.trim()) {
        turn.status = 'done'
      } else {
        turn.answer = emptyAnswerMarkdown()
        turn.status = 'error'
      }
    }
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

async function submitQuestion(payload: VisAiSenderSubmitPayload): Promise<void> {
  const question = payload.value.trim() || '请分析这些附件。'
  const submittedDraftKey = draftStorageKey()
  const attachmentsReady = payload.attachments.every((item) => item.status === 'ready')
  if (
    (!question && !payload.attachments.length)
    || !attachmentsReady
    || responding.value
    || !authUser.value
  ) return

  let session = activeSession.value
  if (!session) {
    try {
      session = await createSession(question)
    } catch (error) {
      loginError.value = error instanceof Error ? error.message : '创建会话失败。'
      return
    }
  }
  const timestamp = new Date().toISOString()
  const turn: AiChatTurn = {
    id: `pending-${Date.now()}-${session.turns.length + 1}`,
    question,
    answer: '',
    reasoning: '',
    model: payload.model ?? selectedModel.value,
    status: 'streaming',
    thinking: payload.deepThinking,
    thinkingExpanded: true,
    feedback: null,
    answerVariants: [],
    answerIndex: 0,
    attachments: payload.attachments.map((item) => ({ ...item })),
    artifacts: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  session.turns.push(turn)
  senderValue.value = ''
  attachments.value = []
  selectedSkill.value = ''
  if (submittedDraftKey) window.localStorage.removeItem(submittedDraftKey)
  saveDraft()
  await nextTick()
  await runTurn(session, session.turns.length - 1)
}

function stopResponse(): void {
  activeController?.abort()
}

function regenerateTurn(turnId: string): void {
  const session = activeSession.value
  if (!session) return

  const turnIndex = session.turns.findIndex((turn) => turn.id === turnId)
  if (turnIndex < 0) return

  const turn = session.turns[turnIndex]
  turn.answerVariants ??= []
  if (turn.answer || turn.reasoning) {
    turn.answerVariants.push({ answer: turn.answer, reasoning: turn.reasoning })
  }
  turn.answerIndex = turn.answerVariants.length
  session.turns.splice(turnIndex + 1)
  void runTurn(session, turnIndex, true)
}

async function copyAnswer(answer: string): Promise<void> {
  if (!answer) return
  await navigator.clipboard.writeText(answer)
}

function thinkingLabel(turn: AiChatTurn): string {
  if (turn.status === 'streaming') return '正在思考...'
  if (turn.status === 'stopped') return '已停止思考'
  if (turn.status === 'timeout') return '回答超时'
  if (turn.status === 'error') return '思考中断'
  return '已回答'
}

function thinkingContent(turn: AiChatTurn): string {
  const reasoning = displayedReasoning(turn)
  if (reasoning) return reasoning
  if (turn.status === 'streaming') return '模型正在组织回答，请稍候。'
  if (turn.status === 'timeout') return '请求已超过服务器等待时间。'
  return ''
}

async function selectConversation(item: VisAiConversationItemData): Promise<void> {
  abortActiveRequest()
  closeArtifactPreview()
  saveDraft()
  conversationKey.value = item.key
  restoreDraft(item.key)
  responding.value = false
  const session = sessions.value.find((entry) => entry.id === String(item.key))
  if (session) await loadConversationTurns(session)
}

async function toggleConversationPin(item: VisAiConversationItemData): Promise<void> {
  const target = sessions.value.find((session) => session.id === String(item.key))
  if (!target) return
  const pinned = !target.pinned
  target.pinned = pinned
  try {
    const conversation = await updateVisionAiConversation(target.id, { pinned })
    Object.assign(target, conversation)
  } catch {
    target.pinned = !pinned
  }
}

async function handleConversationAction(payload: {
  item: VisAiConversationItemData
  action: VisAiConversationAction
}): Promise<void> {
  const target = sessions.value.find(
    (session) => session.id === String(payload.item.key),
  )
  if (!target || payload.action === 'pin' || payload.action === 'share') return

  if (payload.action === 'rename') {
    const title = window.prompt('重命名会话', target.title)?.trim()
    if (!title || title === target.title) return
    const conversation = await updateVisionAiConversation(target.id, { title })
    Object.assign(target, conversation)
    return
  }

  if (payload.action === 'delete') {
    if (!window.confirm(`确认删除会话“${target.title}”？`)) return
    await deleteVisionAiConversation(target.id)
    sessions.value = sessions.value.filter((session) => session.id !== target.id)
    if (conversationKey.value === target.id) {
      closeArtifactPreview()
      conversationKey.value = sessions.value[0]?.id ?? ''
      if (sessions.value[0]) await loadConversationTurns(sessions.value[0])
    }
  }
}

function chooseHistory(item: VisAiConversationItemData): void {
  historyOpen.value = false
  void selectConversation(item)
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
  hasHistory,
  (value) => {
    if (!value) historyOpen.value = false
  },
)

watch(
  () => props.mode,
  (mode) => {
    stopFloatDrag()
    historyOpen.value = false
    modeMenuOpen.value = false
    if (mode !== 'independent') closeArtifactPreview()
  },
)

watch(
  [
    senderValue,
    selectedSkill,
    () => attachments.value.map((item) => (
      `${String(item.key)}:${item.status}:${item.progress ?? 0}`
    )).join('|'),
  ],
  () => saveDraft(),
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
  window.addEventListener('dragend', clearFileDrag)
  window.addEventListener('drop', clearFileDrag)
  void initializeAuth()
})

onBeforeUnmount(() => {
  abortActiveRequest()
  abortUploads()
  stopFloatDrag()
  window.removeEventListener('resize', keepFloatWindowInViewport)
  window.removeEventListener('dragend', clearFileDrag)
  window.removeEventListener('drop', clearFileDrag)
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
        'is-mode-locked': modeLocked,
      },
    ]"
    :style="floatPositionStyle"
    aria-label="小 VI 智能助理"
    @dragenter.prevent="startFileDrag"
    @dragover.prevent="continueFileDrag"
    @dragleave.prevent="leaveFileDrag"
    @drop.prevent="dropFiles"
  >
    <input
      ref="fileInputRef"
      class="ai-assistant__file-input"
      type="file"
      multiple
      aria-hidden="true"
      tabindex="-1"
      :accept="acceptedAttachmentTypes"
      @change="chooseAttachmentFiles"
    >
    <div v-if="isFileDragActive" class="ai-assistant__drop-overlay">
      <span class="ai-assistant__drop-icon" aria-hidden="true">＋</span>
      <strong>松开以上传文件或图片</strong>
      <span>最多 8 个文件，单个不超过 10 MB</span>
    </div>
    <div v-if="authLoading" class="ai-assistant__auth-state">
      <span class="ai-assistant__auth-spinner" aria-hidden="true" />
      <span>正在读取登录状态</span>
    </div>

    <form
      v-else-if="!authUser"
      class="ai-assistant__login"
      @submit.prevent="submitLogin"
    >
      <VisButton
        v-if="!modeLocked"
        class="ai-assistant__login-close"
        variant="text"
        size="md"
        icon-only
        icon-name="x-close"
        label="关闭 AI 助手"
        @click="closeAssistant"
      />
      <span class="ai-assistant__login-logo" aria-hidden="true" v-html="aiLogoMarkup" />
      <div class="ai-assistant__login-heading">
        <h2>登录小 VI 智能助理</h2>
        <p>登录后，会话将在当前账号下云端保存。</p>
      </div>
      <div class="ai-assistant__login-fields">
        <label>
          <span>账号</span>
          <VisInput
            v-model="loginUsername"
            name="username"
            autocomplete="username"
            placeholder="请输入账号"
            prefix
            prefix-icon="user-01"
          />
        </label>
        <label>
          <span>密码</span>
          <VisInput
            v-model="loginPassword"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="请输入密码"
            prefix
            prefix-icon="lock-01"
          />
        </label>
      </div>
      <p v-if="loginError" class="ai-assistant__login-error">{{ loginError }}</p>
      <VisButton
        class="ai-assistant__login-submit"
        html-type="submit"
        size="lg"
        :loading="loginSubmitting"
        :disabled="!loginUsername.trim() || !loginPassword"
      >
        登录
      </VisButton>
    </form>

    <template v-else-if="mode === 'independent'">
      <VisAiConversation
        v-if="!conversationCollapsed"
        v-model="conversationKey"
        v-model:collapsed="conversationCollapsed"
        class="ai-assistant__conversation"
        :items="conversationItems"
        @create="resetConversation"
        @select="selectConversation"
        @pin="toggleConversationPin"
        @action="handleConversationAction"
      />

      <VisAiConversation
        v-else
        v-model="conversationKey"
        v-model:collapsed="conversationCollapsed"
        class="ai-assistant__conversation-collapsed"
        :items="conversationItems"
        @create="resetConversation"
      />

      <div
        class="ai-assistant__independent-content"
        :class="{ 'has-artifact-preview': selectedArtifact }"
      >
        <div class="ai-assistant__independent-actions">
          <div v-if="modeLocked" class="ai-assistant__locked-session-actions">
            <VisTooltip content="新会话" position="bottom">
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="message-plus-circle"
                label="发起新会话"
                @click="resetConversation"
              />
            </VisTooltip>
            <VisTooltip content="历史会话" position="bottom" :disabled="historyOpen">
              <VisDropdown
                v-if="hasHistory"
                v-model:open="historyOpen"
                class="ai-assistant__header-dropdown ai-assistant__history-dropdown"
              >
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
                v-else
                variant="text"
                size="md"
                icon-only
                icon-name="clock-fast-forward"
                label="历史会话"
                disabled
              />
            </VisTooltip>
          </div>
          <VisButton
            v-if="!modeLocked"
            variant="text"
            size="md"
            icon-only
            icon-name="unexpand-06"
            label="退出全屏"
            @click="setMode('copilot')"
          />
          <VisDropdown
            v-if="!modeLocked"
            v-model:open="modeMenuOpen"
            class="ai-assistant__header-dropdown"
          >
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
            icon-name="log-out-01"
            :label="`退出 ${authUser.displayUsername ?? authUser.username ?? authUser.name}`"
            @click="logout"
          />
          <VisButton
            v-if="!modeLocked"
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
                  v-if="displayedReasoning(turn) || turn.status === 'streaming' || turn.status === 'timeout'"
                  v-model:expanded="turn.thinkingExpanded"
                  :loading="turn.status === 'streaming'"
                  :label="thinkingLabel(turn)"
                  :content="thinkingContent(turn)"
                />
                <div v-if="displayedAnswer(turn)" class="ai-assistant__answer">
                  <VisMarkdown
                    :content="displayedAnswer(turn)"
                    :streaming="{
                      hasNextChunk: turn.status === 'streaming',
                      enableAnimation: true,
                      tail: true,
                    }"
                  />
                  <div
                    v-if="displayedArtifacts(turn).length"
                    class="ai-assistant__artifacts"
                  >
                    <VisAiArtifact
                      v-for="artifact in displayedArtifacts(turn)"
                      :key="artifact.id"
                      :item-key="artifact.id"
                      :name="artifact.name"
                      :description="artifact.description"
                      :meta="artifact.sizeLabel"
                      @open="openArtifactPreview(artifact)"
                      @download="downloadVisionAiArtifact(artifact)"
                    />
                  </div>
                  <VisAiActions
                    v-if="turn.status !== 'streaming'"
                    v-model:feedback="turn.feedback"
                    :pagination="answerVariantTotal(turn) > 1"
                    :current="answerVariantCurrent(turn)"
                    :total="answerVariantTotal(turn)"
                    :disabled="responding"
                    @update:current="selectAnswerVariant(turn, $event)"
                    @copy="copyAnswer(displayedAnswer(turn))"
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
            :skills="senderSkills"
            :loading="responding"
            @submit="submitQuestion"
            @stop="stopResponse"
            @attachment-request="openAttachmentPicker"
            @files-request="uploadFiles"
            @remove-attachment="removeAttachment"
            @retry-attachment="retryAttachment"
          />
          <p v-if="uploadError" class="ai-assistant__upload-error">{{ uploadError }}</p>
        </div>

        <aside
          v-if="selectedArtifact"
          class="ai-assistant__artifact-preview"
          :aria-label="`预览 ${selectedArtifact.name}`"
        >
          <header class="ai-assistant__artifact-preview-header">
            <span class="ai-assistant__artifact-preview-title">
              <span class="ai-assistant__artifact-preview-icon" aria-hidden="true">M</span>
              <strong :title="selectedArtifact.name">{{ selectedArtifact.name }}</strong>
            </span>
            <span class="ai-assistant__artifact-preview-actions">
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="download-01"
                label="下载文件"
                @click="downloadVisionAiArtifact(selectedArtifact)"
              />
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="x-close"
                label="关闭文件预览"
                @click="closeArtifactPreview"
              />
            </span>
          </header>
          <div class="ai-assistant__artifact-preview-body">
            <div v-if="artifactLoading" class="ai-assistant__artifact-state">正在加载文件…</div>
            <div v-else-if="artifactError" class="ai-assistant__artifact-state is-error">
              {{ artifactError }}
            </div>
            <VisMarkdown v-else :content="artifactContent" open-links-in-new-tab />
          </div>
        </aside>
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
          <VisTooltip content="新会话" position="bottom">
            <VisButton
              variant="text"
              size="md"
              icon-only
              icon-name="message-plus-circle"
              label="发起新会话"
              @click="resetConversation"
            />
          </VisTooltip>
          <VisTooltip content="历史会话" position="bottom" :disabled="historyOpen">
            <VisDropdown
              v-if="hasHistory"
              v-model:open="historyOpen"
              class="ai-assistant__header-dropdown ai-assistant__history-dropdown"
            >
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
              v-else
              variant="text"
              size="md"
              icon-only
              icon-name="clock-fast-forward"
              label="历史会话"
              disabled
            />
          </VisTooltip>
          <VisTooltip content="全屏" position="bottom">
            <VisButton
              variant="text"
              size="md"
              icon-only
              icon-name="expand-05"
              label="切换为独立式"
              @click="setMode('independent')"
            />
          </VisTooltip>
          <VisTooltip content="更多" position="bottom" :disabled="modeMenuOpen">
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
          </VisTooltip>
          <VisTooltip content="退出登录" position="bottom">
            <VisButton
              variant="text"
              size="md"
              icon-only
              icon-name="log-out-01"
              :label="`退出 ${authUser.displayUsername ?? authUser.username ?? authUser.name}`"
              @click="logout"
            />
          </VisTooltip>
          <VisTooltip content="关闭" position="bottom">
            <VisButton
              variant="text"
              size="md"
              icon-only
              icon-name="x-close"
              label="关闭 AI 助手"
              @click="closeAssistant"
            />
          </VisTooltip>
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
              v-if="displayedReasoning(turn) || turn.status === 'streaming' || turn.status === 'timeout'"
              v-model:expanded="turn.thinkingExpanded"
              :loading="turn.status === 'streaming'"
              :label="thinkingLabel(turn)"
              :content="thinkingContent(turn)"
            />
            <div v-if="displayedAnswer(turn)" class="ai-assistant__answer">
              <VisMarkdown
                :content="displayedAnswer(turn)"
                :streaming="{
                  hasNextChunk: turn.status === 'streaming',
                  enableAnimation: true,
                  tail: true,
                }"
              />
              <div
                v-if="displayedArtifacts(turn).length"
                class="ai-assistant__artifacts"
              >
                <VisAiArtifact
                  v-for="artifact in displayedArtifacts(turn)"
                  :key="artifact.id"
                  :item-key="artifact.id"
                  :name="artifact.name"
                  :description="artifact.description"
                  :meta="artifact.sizeLabel"
                  @open="openArtifactPreview(artifact)"
                  @download="downloadVisionAiArtifact(artifact)"
                />
              </div>
              <VisAiActions
                v-if="turn.status !== 'streaming'"
                v-model:feedback="turn.feedback"
                :pagination="answerVariantTotal(turn) > 1"
                :current="answerVariantCurrent(turn)"
                :total="answerVariantTotal(turn)"
                :disabled="responding"
                @update:current="selectAnswerVariant(turn, $event)"
                @copy="copyAnswer(displayedAnswer(turn))"
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
        :skills="senderSkills"
        :loading="responding"
        @submit="submitQuestion"
        @stop="stopResponse"
        @attachment-request="openAttachmentPicker"
        @files-request="uploadFiles"
        @remove-attachment="removeAttachment"
        @retry-attachment="retryAttachment"
      />
      <p v-if="uploadError" class="ai-assistant__upload-error">{{ uploadError }}</p>
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

.ai-assistant__file-input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ai-assistant__drop-overlay {
  position: absolute;
  z-index: 100;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-8);
  border-radius: inherit;
  color: var(--color-text-primary);
  background: var(--primitive-alpha-white-80);
  text-align: center;
  pointer-events: none;
}

.ai-assistant__drop-overlay > span:last-child {
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
}

.ai-assistant__drop-icon {
  display: grid;
  inline-size: 48px;
  block-size: 48px;
  place-items: center;
  border-radius: 50%;
  color: var(--color-fg-white);
  background: var(--color-bg-brand-solid);
  font-size: 28px;
  line-height: 1;
}

.ai-assistant__upload-error {
  margin: calc(var(--space-8) * -1) var(--space-16) var(--space-4);
  color: var(--color-text-error-primary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.ai-assistant__auth-state {
  box-sizing: border-box;
  min-inline-size: 0;
  min-block-size: 0;
  flex: 1 1 0;
  align-self: stretch;
}

.ai-assistant__auth-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
}

.ai-assistant__auth-spinner {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  border: 2px solid var(--color-border-secondary);
  border-block-start-color: var(--color-fg-brand-primary);
  border-radius: 50%;
  animation: ai-auth-spin 720ms linear infinite;
}

.ai-assistant__login {
  position: relative;
  box-sizing: border-box;
  inline-size: min(480px, calc(100% - var(--space-40)));
  margin: auto;
  padding: var(--space-32);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-24);
}

.ai-assistant.mode-copilot .ai-assistant__login,
.ai-assistant.mode-float .ai-assistant__login {
  padding-inline: 0;
}

.ai-assistant__login-close {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}

.ai-assistant__login-logo {
  inline-size: var(--space-48);
  block-size: var(--space-48);
  display: block;
}

.ai-assistant__login-logo :deep(svg) {
  inline-size: 100%;
  block-size: 100%;
  display: block;
}

.ai-assistant__login-heading {
  display: grid;
  gap: var(--space-4);
}

.ai-assistant__login-heading h2,
.ai-assistant__login-heading p,
.ai-assistant__login-error {
  margin: 0;
}

.ai-assistant__login-heading h2 {
  color: var(--color-text-primary);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
}

.ai-assistant__login-heading p {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.ai-assistant__login-fields {
  display: grid;
  gap: var(--space-16);
}

.ai-assistant__login-fields label {
  display: grid;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
}

.ai-assistant__login-fields :deep(.vis-input) {
  inline-size: 100%;
}

.ai-assistant__login-error {
  color: var(--color-text-danger-primary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.ai-assistant__login-submit {
  inline-size: 100%;
}

@keyframes ai-auth-spin {
  to {
    transform: rotate(360deg);
  }
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
  --ai-scrollbar-track: transparent;
  --ai-scrollbar-thumb: var(--primitive-grey-200);
  --ai-scrollbar-thumb-hover: var(--primitive-grey-300);
  --ai-scrollbar-gutter: var(--space-4);

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

.ai-assistant__locked-session-actions {
  display: none;
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

.ai-assistant__artifacts {
  inline-size: min(100%, 563px);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
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

.ai-assistant__independent-content.has-artifact-preview {
  justify-content: flex-start;
}

.ai-assistant__independent-content.has-artifact-preview .ai-assistant__column {
  min-inline-size: 0;
  flex: 1 1 0;
}

.ai-assistant__artifact-preview {
  position: relative;
  z-index: 5;
  box-sizing: border-box;
  inline-size: clamp(420px, 42%, 720px);
  min-inline-size: 0;
  block-size: 100%;
  flex: 0 0 auto;
  border-inline-start: 1px solid var(--color-border-default);
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
}

.ai-assistant__artifact-preview-header {
  box-sizing: border-box;
  min-block-size: var(--space-64);
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-12) var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
}

.ai-assistant__artifact-preview-title {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.ai-assistant__artifact-preview-title strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
}

.ai-assistant__artifact-preview-icon {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  flex: 0 0 auto;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-white);
  background: var(--color-fg-success-primary);
  font-size: var(--font-text-sm-size);
  font-weight: 600;
}

.ai-assistant__artifact-preview-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.ai-assistant__artifact-preview-body {
  min-block-size: 0;
  flex: 1 1 0;
  padding: var(--space-32);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--ai-scrollbar-thumb) var(--ai-scrollbar-track);
}

.ai-assistant__artifact-preview-body :deep(.vis-markdown) {
  color: var(--color-text-primary);
}

.ai-assistant__artifact-state {
  padding-block: var(--space-48);
  color: var(--color-text-tertiary);
  text-align: center;
  font-size: var(--font-text-md-size);
}

.ai-assistant__artifact-state.is-error {
  color: var(--color-text-danger-primary);
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

.mode-independent .ai-assistant__column {
  inline-size: 100%;
  padding-inline: 0;
}

.mode-independent .ai-assistant__welcome,
.mode-independent .ai-assistant__column > :deep(.vis-ai-sender),
.mode-independent .ai-assistant__upload-error {
  inline-size: min(calc(100% - var(--space-40)), 1000px);
  margin-inline: auto;
}

.mode-independent .ai-assistant__transcript {
  padding-inline: max(var(--space-20), calc((100% - 1000px) / 2));
  scrollbar-width: thin;
  scrollbar-color: var(--ai-scrollbar-thumb) var(--ai-scrollbar-track);
}

.mode-independent .ai-assistant__transcript::-webkit-scrollbar {
  inline-size: 12px;
  block-size: 8px;
}

.mode-independent .ai-assistant__transcript::-webkit-scrollbar-track {
  background: var(--ai-scrollbar-track);
}

.mode-independent .ai-assistant__transcript::-webkit-scrollbar-thumb {
  min-block-size: var(--space-16);
  border-inline-end: var(--ai-scrollbar-gutter) solid transparent;
  border-radius: var(--radius-full);
  background: var(--ai-scrollbar-thumb);
  background-clip: padding-box;
}

.mode-independent .ai-assistant__transcript::-webkit-scrollbar-thumb:hover {
  background: var(--ai-scrollbar-thumb-hover);
  background-clip: padding-box;
}

@media (max-width: 1100px) {
  .ai-assistant.mode-copilot {
    flex-basis: 420px;
    inline-size: 420px;
  }

  .ai-assistant:not(.mode-independent) .ai-assistant__column {
    padding-inline: var(--space-20);
  }

  .ai-assistant__artifact-preview {
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    z-index: 6;
    inline-size: min(100%, 640px);
    box-shadow: -8px 0 24px var(--color-effect-shadow-grey);
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

  .ai-assistant__locked-session-actions {
    display: flex;
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
