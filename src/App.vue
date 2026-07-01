<script setup lang="ts">
import { computed, ref } from 'vue'

import VisButton from './components/button/VisButton.vue'
import VisCodeBlock from './components/code-block/VisCodeBlock.vue'
import VisConfigProvider from './components/config-provider/VisConfigProvider.vue'
import { VisFeaturedIcon } from './components/featured-icon'
import Icon from './components/icons/Icon.vue'
import VisInput from './components/input/VisInput.vue'
import VisModal from './components/modal/VisModal.vue'
import VisScrollShadow from './components/scroll-shadow/VisScrollShadow.vue'
import type { VisTheme } from './components/config-provider/config-provider.types'

type DemoPageId = 'button' | 'input' | 'modal' | 'featured-icon' | 'code-block' | 'scroll-shadow'
type SidebarPageId = DemoPageId | 'icons'

interface SidebarItem {
  title: string
  subtitle: string
  page?: SidebarPageId
}

interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

interface ApiRow {
  visionApi: string
  elementApi: string
  description: string
  type: string
  defaultValue: string
}

interface ElementApiRow {
  category: string
  api: string
  description: string
  type: string
  defaultValue: string
}

interface ApiDisplayRow {
  api: string
  elementApi?: string
  description: string
  type: string
  defaultValue?: string
}

interface ApiColumn {
  key: keyof ApiDisplayRow
  label: string
}

interface ApiTableSection {
  title: string
  columns: ApiColumn[]
  rows: ApiDisplayRow[]
}

const theme = ref<VisTheme>('light')
const activePage = ref<DemoPageId>('button')
const collapsedGroups = ref<Set<string>>(new Set())
const inputValue = ref('Vision Design')
const modalOpen = ref(true)

const sampleCode = `import { VisButton } from 'vision-design-system'

export default {
  setup() {
    return () => <VisButton>提交</VisButton>
  },
}`

const pages: Array<{ id: DemoPageId; title: string; subtitle: string }> = [
  { id: 'button', title: 'Button', subtitle: '按钮' },
  { id: 'input', title: 'Input', subtitle: '输入框' },
  { id: 'modal', title: 'Modal', subtitle: '弹窗' },
  { id: 'featured-icon', title: 'Featured Icon', subtitle: '特征图标' },
  { id: 'code-block', title: 'Code Block', subtitle: '代码块' },
  { id: 'scroll-shadow', title: 'Scroll Shadow', subtitle: '滚动阴影' },
]

const logoSvg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.17624 12.0999C1.08208 11.3108 1.70042 10.6252 2.49503 10.6252H20.6269C21.3112 10.6252 21.8872 11.1395 21.9715 11.8186C22.1291 13.0887 22.4174 15.2891 22.8363 18.0123C23.1958 20.349 23.6515 22.3009 23.9974 23.6103C24.2316 24.4966 23.5685 25.3993 22.6517 25.3993H4.69643C4.10331 25.3993 3.58189 25.0115 3.42711 24.4389C3.08143 23.1602 2.47289 20.7401 2.01825 18.0123C1.61875 15.6153 1.33808 13.456 1.17624 12.0999Z" fill="#14C9C9"/>
<path d="M26.8326 3.92544C26.8552 3.17666 26.2525 2.56665 25.5034 2.56665H8.72388C7.98591 2.56665 7.38456 3.16037 7.36697 3.89813C7.3174 5.97618 7.16675 10.1505 6.71893 13.983C6.29265 17.6312 5.51629 21.5891 5.06188 23.7538C4.88457 24.5984 5.52744 25.3993 6.39049 25.3993H23.1359C23.7498 25.3993 24.2839 24.9849 24.4224 24.387C24.8547 22.5209 25.7527 18.3303 26.1939 13.983C26.6096 9.88697 26.7724 5.93002 26.8326 3.92544Z" fill="#1C63FC"/>
<path d="M20.6266 10.6252C21.3107 10.6252 21.8864 11.1392 21.971 11.8181C22.1286 13.0882 22.4168 15.2895 22.8357 18.0126C23.1952 20.3491 23.6508 22.3008 23.9967 23.6101C24.2308 24.4964 23.5679 25.3988 22.6511 25.3988H6.39073C5.52768 25.3988 4.88497 24.5983 5.06227 23.7537C5.51669 21.589 6.29258 17.6309 6.71885 13.9828C6.84857 12.8726 6.95097 11.7335 7.03558 10.6252H20.6266Z" fill="#0021B7"/>
</svg>`

const sidebarGroups: SidebarGroup[] = [
  {
    title: 'Documentation',
    items: [
      { title: 'Introduction', subtitle: '介绍' },
      { title: 'Changelog', subtitle: '更新记录' },
    ],
  },
  {
    title: 'Primitives',
    items: [
      { title: 'Global Variables', subtitle: '全局变量' },
      { title: 'Icons', subtitle: '图标', page: 'icons' },
      { title: 'Logo', subtitle: '标识' },
    ],
  },
  {
    title: 'Shared Components',
    items: [
      { title: 'Button', subtitle: '按钮', page: 'button' },
      { title: 'Input', subtitle: '输入框', page: 'input' },
      { title: 'Modal', subtitle: '对话框', page: 'modal' },
      { title: 'FeaturedIcon', subtitle: '特征图标', page: 'featured-icon' },
      { title: 'CodeBlock', subtitle: '代码块', page: 'code-block' },
      { title: 'ScrollShadow', subtitle: '滚动阴影', page: 'scroll-shadow' },
      { title: 'Markdown', subtitle: '格式渲染' },
      { title: 'RichTextEditor', subtitle: '富文本编辑器' },
      { title: 'Select', subtitle: '选择器' },
      { title: 'Tabs', subtitle: '标签页' },
      { title: 'Tooltip', subtitle: '文字提示' },
      { title: 'Upload', subtitle: '上传' },
    ],
  },
]

const currentPage = computed(() => pages.find((page) => page.id === activePage.value) ?? pages[0])
const themeToggleIcon = computed(() => (theme.value === 'light' ? 'sun' : 'moon-star'))
const themeToggleLabel = computed(() => (theme.value === 'light' ? '切换到暗色模式' : '切换到亮色模式'))

const apiTables: Record<DemoPageId, ApiRow[]> = {
  button: [
    {
      visionApi: 'variant',
      elementApi: 'type / plain / text / link',
      description: '控制按钮视觉层级。当前实现按旧项目自绘，Element API 作为语义参考。',
      type: "'primary' | 'secondary' | 'text' | 'link-grey' | 'link-color'",
      defaultValue: "'primary'",
    },
    {
      visionApi: 'size',
      elementApi: 'size',
      description: '控制按钮高度、横向 padding、图标尺寸和文字字号。',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
    },
    {
      visionApi: 'state',
      elementApi: 'disabled / loading / pseudo states',
      description: '用于演示或锁定 hover、pressing、focused、disabled、loading 状态。',
      type: "'default' | 'hover' | 'pressing' | 'focused' | 'disabled' | 'loading'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'danger',
      elementApi: 'type=\"danger\"',
      description: '切换危险语义色，支持 primary、secondary、text、link-color。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用按钮交互，并应用旧项目 disabled 视觉。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'loading',
      elementApi: 'loading',
      description: '展示加载状态，按钮原生 disabled，支持 loading slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'iconOnly',
      elementApi: 'icon / circle',
      description: '仅展示图标，并使用 label 作为可访问名称。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'prefix / suffix',
      elementApi: 'icon slot',
      description: '控制默认前缀或后缀图标，也可用 prefix/suffix slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'iconName / suffixIconName',
      elementApi: 'icon',
      description: '指定默认前缀、仅图标或后缀图标名称。',
      type: 'IconName',
      defaultValue: "'plus' / 'chevron-down'",
    },
    {
      visionApi: 'htmlType',
      elementApi: 'native-type',
      description: '按钮原生 type 属性。',
      type: "'button' | 'submit' | 'reset'",
      defaultValue: "'button'",
    },
  ],
  input: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '输入框受控值。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '输入为空时显示的占位文本。',
      type: 'string',
      defaultValue: "'请输入'",
    },
    {
      visionApi: 'valueText / filled',
      elementApi: 'model-value',
      description: '非受控演示态的默认填充值，兼容旧项目展示逻辑。',
      type: 'string / boolean',
      defaultValue: "'已输入内容' / false",
    },
    {
      visionApi: 'state',
      elementApi: 'validate-event / class',
      description: '控制默认、hover、focus、danger 预览状态。',
      type: "'default' | 'hover' | 'focus' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用输入框和清除按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'readView',
      elementApi: 'readonly',
      description: '旧项目只读展示态，视觉上弱化边框和背景。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'prefix / suffix',
      elementApi: 'prefix / suffix slot',
      description: '显示前缀或后缀图标，可由对应 slot 替代。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'addonLeft / addonRight',
      elementApi: 'prepend / append slot',
      description: '显示输入框左右附加块。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'maxLength',
      elementApi: 'maxlength / show-word-limit',
      description: '限制最大输入长度并显示计数；boolean true 默认 10。',
      type: 'number | boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'type / name / ariaLabel',
      elementApi: 'type / name / aria-label',
      description: '透传原生 input 类型、名称和可访问标签。',
      type: 'string',
      defaultValue: "'text' / undefined",
    },
  ],
  modal: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '控制弹窗显示隐藏。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'title',
      elementApi: 'title / header slot',
      description: '弹窗主标题。',
      type: 'string',
      defaultValue: "'对话框标题'",
    },
    {
      visionApi: 'menuTitle',
      elementApi: 'header slot',
      description: '带菜单弹窗右侧标题覆盖值。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'divider',
      elementApi: 'header/footer custom class',
      description: '控制普通弹窗头尾分割线。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'footer',
      elementApi: 'footer slot',
      description: '是否展示默认底部操作区。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'icon',
      elementApi: 'header slot',
      description: '是否显示 FeaturedIcon。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'twoLevel',
      elementApi: 'header slot',
      description: '展示二级返回入口。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'withMenu',
      elementApi: '自定义内容 / aside',
      description: '启用左侧菜单型弹窗布局。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closeable',
      elementApi: 'show-close',
      description: '是否显示右上角关闭按钮。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'width / height',
      elementApi: 'width / style',
      description: '覆盖弹窗尺寸，数字会转换为 px。',
      type: 'number | string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'menuItems / activeMenuKey',
      elementApi: '无直接对应',
      description: '菜单型弹窗的菜单数据和选中项。',
      type: 'VisModalMenuItem[] / string',
      defaultValue: '内置示例菜单 / overview',
    },
    {
      visionApi: 'cancelText / confirmText / backText',
      elementApi: 'footer/header slot',
      description: '默认按钮和返回入口文案。',
      type: 'string',
      defaultValue: "'取消' / '确认' / '返回'",
    },
  ],
  'featured-icon': [
    {
      visionApi: 'size',
      elementApi: '无直接对应',
      description: '控制容器和内部图标尺寸。',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'",
      defaultValue: "'xs'",
    },
    {
      visionApi: 'color',
      elementApi: '无直接对应',
      description: '控制品牌、灰度、危险、警告、成功语义色。',
      type: "'brand' | 'grey' | 'danger' | 'warning' | 'success'",
      defaultValue: "'brand'",
    },
    {
      visionApi: 'type',
      elementApi: '无直接对应',
      description: '控制 light/solid/modern 与 round/square 组合外观。',
      type: "'light-round' | 'light-square' | 'solid-round' | 'solid-square' | 'modern'",
      defaultValue: "'solid-round'",
    },
    {
      visionApi: 'icon',
      elementApi: '无直接对应',
      description: '内部图标名称，来自 Vision icon registry。',
      type: 'IconName',
      defaultValue: "'download-cloud-02'",
    },
    {
      visionApi: 'label / decorative',
      elementApi: 'aria-label / aria-hidden',
      description: '控制可访问名称；装饰性图标默认隐藏给辅助技术。',
      type: 'string / boolean',
      defaultValue: 'undefined / true',
    },
  ],
  'code-block': [
    {
      visionApi: 'type',
      elementApi: '无直接对应',
      description: '控制普通代码块或 show_more 可展开代码块。',
      type: "'default' | 'show_more'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'collapsed',
      elementApi: '无直接对应',
      description: 'show_more 模式下的初始收起状态。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'heading',
      elementApi: '无直接对应',
      description: '是否显示语言标题栏。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'copy',
      elementApi: '无直接对应',
      description: '是否显示复制按钮，并调用 Clipboard API。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'language',
      elementApi: '无直接对应',
      description: '标题栏语言名称。',
      type: 'string',
      defaultValue: "'Javascript'",
    },
    {
      visionApi: 'code',
      elementApi: '无直接对应',
      description: '代码文本内容，组件内部做轻量语法 token 渲染。',
      type: 'string',
      defaultValue: "''",
    },
  ],
  'scroll-shadow': [
    {
      visionApi: 'variant',
      elementApi: '无直接对应',
      description: '控制渐隐边缘使用 surface 或 secondary 背景色。',
      type: "'surface' | 'secondary'",
      defaultValue: "'surface'",
    },
    {
      visionApi: 'orientation',
      elementApi: 'ElScrollbar direction 语义参考',
      description: '控制垂直或水平滚动阴影。',
      type: "'vertical' | 'horizontal'",
      defaultValue: "'vertical'",
    },
    {
      visionApi: 'size',
      elementApi: '无直接对应',
      description: '渐隐覆盖区域尺寸，单位 px。',
      type: 'number',
      defaultValue: '80',
    },
    {
      visionApi: 'hideScrollBar',
      elementApi: 'native scrollbar style',
      description: '是否隐藏原生滚动条。',
      type: 'boolean',
      defaultValue: 'true',
    },
  ],
}

const noElementApiRows = (): ElementApiRow[] => []

const elementApiTables: Record<DemoPageId, ElementApiRow[]> = {
  button: [
    {
      category: 'Attribute',
      api: 'size',
      description: 'button size',
      type: "'large' | 'default' | 'small'",
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'type',
      description: 'button type, when setting `color`, the latter prevails',
      type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | '' | 'text'",
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'plain',
      description: "determine whether it's a plain button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'text',
      description: "determine whether it's a text button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'bg',
      description: 'determine whether the text button background color is always on',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'link',
      description: "determine whether it's a link button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'round',
      description: "determine whether it's a round button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'circle',
      description: "determine whether it's a circle button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'dashed',
      description: "determine whether it's a dashed button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'loading',
      description: "determine whether it's loading",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'loading-icon',
      description: 'customize loading icon component',
      type: 'string | Component',
      defaultValue: 'Loading',
    },
    {
      category: 'Attribute',
      api: 'disabled',
      description: 'disable the button',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'icon',
      description: 'icon component',
      type: 'string | Component',
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'autofocus',
      description: "same as native button's `autofocus`",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'native-type',
      description: "same as native button's `type`",
      type: "'button' | 'submit' | 'reset'",
      defaultValue: 'button',
    },
    {
      category: 'Attribute',
      api: 'auto-insert-space',
      description:
        'automatically insert a space between two chinese characters(this will only take effect when the text length is 2 and all characters are in Chinese.)',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'color',
      description: 'custom button color, automatically calculate `hover` and `active` color',
      type: 'string',
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'dark',
      description: 'dark mode, which automatically converts `color` to dark mode colors',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'tag',
      description: 'custom element tag',
      type: 'string | Component',
      defaultValue: 'button',
    },
  ],
  input: [
    {
      category: 'Attribute',
      api: 'type',
      description: 'type of input, see more in MDN input types',
      type: "'text' | 'textarea' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url'",
      defaultValue: 'text',
    },
    { category: 'Attribute', api: 'model-value', description: 'binding value', type: 'string | number', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'model-modifiers',
      description: 'v-model modifiers, reference Vue modifiers',
      type: '{ lazy?: true, number?: true, trim?: true }',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'maxlength', description: 'same as `maxlength` in native input', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'minlength', description: 'same as `minlength` in native input', type: 'string | number', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'show-word-limit',
      description: "whether show word count, only works when `type` is 'text' or 'textarea'",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'word-limit-position',
      description: 'word count position, valid when `show-word-limit` is true',
      type: "'inside' | 'outside'",
      defaultValue: 'inside',
    },
    { category: 'Attribute', api: 'placeholder', description: 'placeholder of Input', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'clearable',
      description: "whether to show clear button, only works when `type` is not 'textarea'",
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'clear-icon', description: 'custom clear icon component', type: 'string | Component', defaultValue: 'CircleClose' },
    {
      category: 'Attribute',
      api: 'formatter',
      description: "specifies the format of the value presented input.(only works when `type` is 'text')",
      type: '(value: string | number) => string',
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'parser',
      description: "specifies the value extracted from formatter input.(only works when `type` is 'text')",
      type: '(value: string) => string',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'show-password', description: 'whether to show toggleable password input', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: 'whether Input is disabled', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: "size of Input, works when `type` is not 'textarea'", type: "'large' | 'default' | 'small'", defaultValue: '-' },
    { category: 'Attribute', api: 'prefix-icon', description: 'prefix icon component', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'suffix-icon', description: 'suffix icon component', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'rows', description: "number of rows of textarea, only works when `type` is 'textarea'", type: 'number', defaultValue: '2' },
    {
      category: 'Attribute',
      api: 'autosize',
      description: "whether textarea has an adaptive height, only works when `type` is 'textarea'",
      type: 'boolean | { minRows?: number, maxRows?: number }',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'autocomplete', description: 'same as `autocomplete` in native input', type: 'string', defaultValue: 'off' },
    { category: 'Attribute', api: 'name', description: 'same as `name` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'readonly', description: 'same as `readonly` in native input', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'max', description: 'same as `max` in native input', type: '-', defaultValue: '-' },
    { category: 'Attribute', api: 'min', description: 'same as `min` in native input', type: '-', defaultValue: '-' },
    { category: 'Attribute', api: 'step', description: 'same as `step` in native input', type: '-', defaultValue: '-' },
    { category: 'Attribute', api: 'resize', description: 'control the resizability', type: "'none' | 'both' | 'horizontal' | 'vertical'", defaultValue: '-' },
    { category: 'Attribute', api: 'autofocus', description: 'same as `autofocus` in native input', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'form', description: 'same as `form` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-label', description: 'same as `aria-label` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'tabindex', description: 'input tabindex', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'validate-event', description: 'whether to trigger form validation', type: 'boolean', defaultValue: 'true' },
    {
      category: 'Attribute',
      api: 'input-style',
      description: 'the style of the input element or textarea element',
      type: 'string | CSSProperties | CSSProperties[] | string[]',
      defaultValue: '{}',
    },
    { category: 'Attribute', api: 'label', description: 'same as `aria-label` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'inputmode', description: 'same as `inputmode` in native input', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'count-graphemes',
      description: 'custom function to count graphemes; when set, native `maxlength`/`minlength` constraints are bypassed',
      type: '(value: string) => number',
      defaultValue: '-',
    },
    { category: 'Event', api: 'blur', description: 'triggers when Input blurs', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: 'triggers when Input focuses', type: 'event', defaultValue: '-' },
    {
      category: 'Event',
      api: 'change',
      description: 'triggers when the input box loses focus or the user presses Enter, only if the modelValue has changed',
      type: 'event',
      defaultValue: '-',
    },
    { category: 'Event', api: 'input', description: 'triggers when the Input value change', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'clear', description: 'triggers when the Input is cleared by clicking the clear button', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'keydown', description: 'triggers when a key is pressed down', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'mouseleave', description: 'triggers when the mouse leaves the Input element', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'mouseenter', description: 'triggers when the mouse enters the Input element', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'compositionstart', description: 'triggers when the composition starts', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'compositionupdate', description: 'triggers when the composition is updated', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'compositionend', description: 'triggers when the composition ends', type: 'event', defaultValue: '-' },
  ],
  modal: [
    { category: 'Attribute', api: 'model-value', description: 'visibility of Dialog', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'title', description: 'title of Dialog. Can also be passed with a named slot', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'width', description: 'width of Dialog, default is 50%', type: 'string | number', defaultValue: "''" },
    { category: 'Attribute', api: 'fullscreen', description: 'whether the Dialog takes up full screen', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'top', description: 'value for `margin-top` of Dialog CSS, default is 15vh', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'modal', description: 'whether a mask is displayed', type: 'boolean', defaultValue: 'true' },
    {
      category: 'Attribute',
      api: 'modal-penetrable',
      description: 'whether the mask is penetrable. The modal attribute must be `false`',
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'modal-class', description: 'custom class names for mask', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'header-class', description: 'custom class names for header wrapper', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'body-class', description: 'custom class names for body wrapper', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'footer-class', description: 'custom class names for footer wrapper', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'append-to-body',
      description: 'whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true`',
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'append-to', description: 'which element the Dialog appends to. Will override `append-to-body`', type: 'CSSSelector | HTMLElement', defaultValue: 'body' },
    { category: 'Attribute', api: 'lock-scroll', description: 'whether scroll of body is disabled while Dialog is displayed', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'open-delay', description: 'the Time(milliseconds) before open', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'close-delay', description: 'the Time(milliseconds) before close', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'close-on-click-modal', description: 'whether the Dialog can be closed by clicking the mask', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'close-on-press-escape', description: 'whether the Dialog can be closed by pressing ESC', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'show-close', description: 'whether to show a close button', type: 'boolean', defaultValue: 'true' },
    {
      category: 'Attribute',
      api: 'before-close',
      description: 'callback before Dialog closes, and it will prevent Dialog from closing, use done to close the dialog',
      type: '(done: DoneFn) => void',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'draggable', description: 'enable dragging feature for Dialog', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'overflow', description: 'draggable Dialog can overflow the viewport', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'center', description: 'whether to align the header and footer in center', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'align-center', description: 'whether to align the dialog both horizontally and vertically', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'destroy-on-close', description: 'destroy elements in Dialog when closed', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'close-icon', description: 'custom close icon, default is Close', type: 'string | Component', defaultValue: 'Close' },
    { category: 'Attribute', api: 'z-index', description: 'same as z-index in native CSS, z-order of dialog', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'header-aria-level', description: "header's `aria-level` attribute", type: 'string', defaultValue: '2' },
    {
      category: 'Attribute',
      api: 'transition',
      description: 'custom transition configuration for dialog animation. Can be a string or an object with Vue transition props',
      type: 'string | TransitionProps',
      defaultValue: 'dialog-fade',
    },
    { category: 'Attribute', api: 'custom-class', description: 'custom class names for Dialog', type: 'string', defaultValue: "''" },
    { category: 'Event', api: 'open', description: 'triggers when the Dialog opens', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'opened', description: 'triggers when the Dialog opening animation ends', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'close', description: 'triggers when the Dialog closes', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'closed', description: 'triggers when the Dialog closing animation ends', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'open-auto-focus', description: 'triggers after Dialog opens and content focused', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'close-auto-focus', description: 'triggers after Dialog closed and content focused', type: 'event', defaultValue: '-' },
  ],
  'featured-icon': noElementApiRows(),
  'code-block': noElementApiRows(),
  'scroll-shadow': [
    { category: 'Attribute', api: 'height', description: 'height of scrollbar', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'max-height', description: 'max height of scrollbar', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'native', description: 'whether to use the native scrollbar style', type: 'boolean', defaultValue: 'false' },
    {
      category: 'Attribute',
      api: 'wrap-style',
      description: 'style of wrap container',
      type: 'string | CSSProperties | CSSProperties[] | string[]',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'wrap-class', description: 'class of wrap container', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'view-style',
      description: 'style of view',
      type: 'string | CSSProperties | CSSProperties[] | string[]',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'view-class', description: 'class of view', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'noresize',
      description: 'do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance',
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'tag', description: 'element tag of the view', type: 'string', defaultValue: 'div' },
    { category: 'Attribute', api: 'always', description: 'always show scrollbar', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'min-size', description: 'minimum size of scrollbar', type: 'number', defaultValue: '20' },
    { category: 'Attribute', api: 'id', description: 'id of view', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'role', description: 'role of view', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-label', description: 'aria-label of view', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-orientation', description: 'aria-orientation of view', type: "'horizontal' | 'vertical'", defaultValue: '-' },
    { category: 'Attribute', api: 'tabindex', description: 'tabindex of wrap container', type: 'number | string', defaultValue: '-' },
    { category: 'Attribute', api: 'distance', description: 'trigger end-reached event distance(px)', type: 'number', defaultValue: '0' },
    { category: 'Event', api: 'scroll', description: 'triggers when scrolling, return distance of scrolling', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'end-reached', description: 'triggers when the end of a scroll is triggered', type: 'event', defaultValue: '-' },
  ],
}

const visionComponentNames: Record<DemoPageId, string> = {
  button: 'VisButton',
  input: 'VisInput',
  modal: 'VisModal',
  'featured-icon': 'VisFeaturedIcon',
  'code-block': 'VisCodeBlock',
  'scroll-shadow': 'VisScrollShadow',
}

const elementComponentNames: Partial<Record<DemoPageId, string>> = {
  button: 'ElButton',
  input: 'ElInput',
  modal: 'ElDialog',
  'scroll-shadow': 'ElScrollbar',
}

const visionAttributeColumns: ApiColumn[] = [
  { key: 'api', label: 'Vision API' },
  { key: 'elementApi', label: 'Element API' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
  { key: 'defaultValue', label: '默认值' },
]

const apiColumns: ApiColumn[] = [
  { key: 'api', label: 'API' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
  { key: 'defaultValue', label: '默认值' },
]

const eventColumns: ApiColumn[] = [
  { key: 'api', label: '事件名' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
]

const slotColumns: ApiColumn[] = [
  { key: 'api', label: '插槽名' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
]

const exposeColumns: ApiColumn[] = [
  { key: 'api', label: '名称' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
]

const visionEventTables: Record<DemoPageId, ApiDisplayRow[]> = {
  button: [
    {
      api: 'click',
      description: '点击按钮时触发，透传原生 button click 事件。',
      type: '(event: MouseEvent) => void',
    },
  ],
  input: [
    {
      api: 'update:modelValue',
      description: '输入值变化时触发，用于 v-model 双向绑定。',
      type: '(value: string) => void',
    },
    {
      api: 'clear',
      description: '点击清除按钮并清空内容时触发。',
      type: '() => void',
    },
    {
      api: 'focus',
      description: '输入框获得焦点时触发。',
      type: '(event: FocusEvent) => void',
    },
    {
      api: 'blur',
      description: '输入框失去焦点时触发。',
      type: '(event: FocusEvent) => void',
    },
  ],
  modal: [
    {
      api: 'update:modelValue',
      description: '弹窗显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'close',
      description: '点击关闭按钮关闭弹窗时触发。',
      type: '() => void',
    },
    {
      api: 'cancel',
      description: '点击默认取消按钮时触发。',
      type: '() => void',
    },
    {
      api: 'confirm',
      description: '点击默认确认按钮时触发。',
      type: '() => void',
    },
    {
      api: 'back',
      description: '点击二级弹窗返回入口时触发。',
      type: '() => void',
    },
    {
      api: 'menu-select',
      description: '菜单型弹窗选择菜单项时触发。',
      type: '(item: VisModalMenuItem) => void',
    },
  ],
  'featured-icon': [],
  'code-block': [],
  'scroll-shadow': [],
}

const elementExtraApiRows: Record<DemoPageId, ElementApiRow[]> = {
  button: [
    { category: 'Slot', api: 'default', description: '自定义默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'loading', description: '自定义加载中组件', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'icon', description: '自定义图标组件', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'ref', description: '按钮 HTML 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'size', description: '按钮尺寸', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'type', description: '按钮类型', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'disabled', description: '按钮禁用状态', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'shouldAddSpace', description: '是否在两个中文字符之间插入空格', type: 'object', defaultValue: '-' },
  ],
  input: [
    { category: 'Slot', api: 'prefix', description: '输入框头部内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'suffix', description: '输入框尾部内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'prepend', description: '输入框前置内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'append', description: '输入框后置内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    {
      category: 'Slot',
      api: 'password-icon',
      description: '作为输入密码图标的内容，仅在 show-password 为 true 时生效',
      type: 'slot',
      defaultValue: '-',
    },
    { category: 'Expose', api: 'blur', description: '使 input 失去焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'clear', description: '清除 input 值', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'focus', description: '使 input 获取焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'input', description: 'Input HTML 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'ref', description: 'HTML input 或 textarea 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'resizeTextarea', description: '改变 textarea 大小', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'select', description: '选中 input 中的文字', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'textarea', description: 'HTML textarea 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'textareaStyle', description: 'textarea 的样式', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'isComposing', description: '是否处于输入法 composing 状态', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'passwordVisible', description: '密码是否可见', type: 'object', defaultValue: '-' },
  ],
  modal: [
    { category: 'Slot', api: 'default', description: '对话框的默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'header', description: '对话框标题内容；会替换标题部分，但不会移除关闭按钮', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'footer', description: 'Dialog 按钮操作区的内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'title', description: '已废弃，与 header 作用相同', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'resetPosition', description: '重置位置', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleClose', description: '关闭对话框', type: 'Function', defaultValue: '-' },
  ],
  'featured-icon': [],
  'code-block': [],
  'scroll-shadow': [
    { category: 'Slot', api: 'default', description: '滚动区域的默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'handleScroll', description: '处理滚动事件并更新滚动条位置', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'scrollTo', description: '滚动到指定位置', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setScrollTop', description: '设置垂直滚动距离', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setScrollLeft', description: '设置水平滚动距离', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'update', description: '手动更新滚动条状态', type: 'Function', defaultValue: '-' },
  ],
}

const elementApiDescriptionsZh: Partial<Record<DemoPageId, Record<string, string>>> = {
  button: {
    size: '尺寸',
    type: '按钮类型；设置 color 时，color 优先。',
    plain: '是否为朴素按钮',
    text: '是否为文字按钮',
    bg: '是否显示文字按钮背景颜色',
    link: '是否为链接按钮',
    round: '是否为圆角按钮',
    circle: '是否为圆形按钮',
    dashed: '是否为虚线按钮',
    loading: '是否为加载中状态',
    'loading-icon': '自定义加载中状态图标组件',
    disabled: '按钮是否为禁用状态',
    icon: '图标组件',
    autofocus: '原生 autofocus 属性',
    'native-type': '原生 type 属性',
    'auto-insert-space': '两个中文字符之间自动插入空格，仅当文本长度为 2 且所有字符均为中文时生效',
    color: '自定义按钮颜色，并自动计算 hover 和 active 触发后的颜色',
    dark: 'dark 模式，自动将 color 转换为暗色模式颜色',
    tag: '自定义元素标签',
  },
  input: {
    type: '输入类型，更多信息可参考 MDN input 类型',
    'model-value': '绑定值',
    'model-modifiers': 'v-model 修饰符',
    maxlength: '同原生 maxlength 属性',
    minlength: '原生属性，最小输入长度',
    'show-word-limit': "是否显示统计字数，只在 type 为 'text' 或 'textarea' 时生效",
    'word-limit-position': '字数统计的位置，仅当 show-word-limit 为 true 时生效',
    placeholder: '输入框占位文本',
    clearable: '是否显示清除按钮，只有当 type 不是 textarea 时生效',
    'clear-icon': '自定义清除图标',
    formatter: '指定输入值的格式，仅当 type 是 text 时生效',
    parser: '指定从格式化器输入中提取的值，仅当 type 是 text 时生效',
    'show-password': '是否显示切换密码图标',
    disabled: '是否禁用',
    size: "输入框尺寸，只在 type 不为 'textarea' 时有效",
    'prefix-icon': '自定义前缀图标',
    'suffix-icon': '自定义后缀图标',
    rows: "输入框行数，仅 type 为 'textarea' 时有效",
    autosize: "textarea 高度是否自适应，仅 type 为 'textarea' 时生效",
    autocomplete: '原生 autocomplete 属性',
    name: '等价于原生 input name 属性',
    readonly: '原生 readonly 属性，是否只读',
    max: '原生 max 属性，设置最大值',
    min: '原生 min 属性，设置最小值',
    step: '原生 step 属性，设置输入字段的合法数字间隔',
    resize: '控制是否能被用户缩放',
    autofocus: '原生 autofocus 属性，自动获取焦点',
    form: '原生 form 属性',
    'aria-label': '等价于原生 input aria-label 属性',
    tabindex: '输入框的 tabindex',
    'validate-event': '输入时是否触发表单校验',
    'input-style': 'input 元素或 textarea 元素的 style',
    label: '已废弃，等价于原生 input aria-label 属性',
    inputmode: '等价于原生 inputmode 属性',
    'count-graphemes': '自定义函数用于计算字形；设置后会绕过原生 maxlength/minlength 约束',
    blur: '当输入框失去焦点时触发',
    focus: '当输入框获得焦点时触发',
    change: '仅当 modelValue 改变时，在输入框失去焦点或用户按 Enter 时触发',
    input: '在 Input 值改变时触发',
    clear: '在点击由 clearable 属性生成的清空按钮时触发',
    keydown: '按下键时触发',
    mouseleave: '当鼠标离开输入元素时触发',
    mouseenter: '当鼠标进入输入元素时触发',
    compositionstart: '输入法输入开始时触发',
    compositionupdate: '输入法输入改变时触发',
    compositionend: '输入法输入完成时触发',
  },
  modal: {
    'model-value': '是否显示 Dialog',
    title: 'Dialog 的标题，也可通过具名 slot 传入',
    width: '对话框的宽度，默认值为 50%',
    fullscreen: '是否为全屏 Dialog',
    top: 'Dialog CSS 中的 margin-top 值，默认为 15vh',
    modal: '是否需要遮罩层',
    'modal-penetrable': '是否允许穿透遮罩层，modal 属性必须为 false',
    'modal-class': '遮罩的自定义类名',
    'header-class': 'header 部分的自定义 class 名',
    'body-class': 'body 部分的自定义 class 名',
    'footer-class': 'footer 部分的自定义 class 名',
    'append-to-body': 'Dialog 自身是否插入至 body 元素上；嵌套 Dialog 必须指定为 true',
    'append-to': 'Dialog 挂载到哪个 DOM 元素，会覆盖 append-to-body',
    'lock-scroll': '是否在 Dialog 出现时将 body 滚动锁定',
    'open-delay': 'Dialog 打开的延时时间，单位毫秒',
    'close-delay': 'Dialog 关闭的延时时间，单位毫秒',
    'close-on-click-modal': '是否可以通过点击 modal 关闭 Dialog',
    'close-on-press-escape': '是否可以通过按下 ESC 关闭 Dialog',
    'show-close': '是否显示关闭按钮',
    'before-close': '关闭前的回调，会暂停 Dialog 的关闭；执行 done 参数方法时才真正关闭',
    draggable: '为 Dialog 启用可拖拽功能',
    overflow: '拖动范围是否可以超出可视区',
    center: '是否让 Dialog 的 header 和 footer 部分居中排列',
    'align-center': '是否水平垂直对齐对话框',
    'destroy-on-close': '关闭 Dialog 时是否销毁其中的元素',
    'close-icon': '自定义关闭图标',
    'z-index': '和原生 CSS z-index 相同，用于改变 z 轴顺序',
    'header-aria-level': 'header 的 aria-level 属性',
    transition: '对话框动画的自定义过渡配置，可以是字符串或 Vue 过渡属性对象',
    'custom-class': '已废弃，Dialog 的自定义类名',
    open: 'Dialog 打开的回调',
    opened: 'Dialog 打开动画结束时的回调',
    close: 'Dialog 关闭的回调',
    closed: 'Dialog 关闭动画结束时的回调',
    'open-auto-focus': '输入焦点聚焦在 Dialog 内容时的回调',
    'close-auto-focus': '输入焦点从 Dialog 内容失焦时的回调',
  },
  'scroll-shadow': {
    height: '滚动条高度',
    'max-height': '滚动条最大高度',
    native: '是否使用原生滚动条样式',
    'wrap-style': '包裹容器的自定义样式',
    'wrap-class': '包裹容器的自定义类名',
    'view-style': '视图容器的自定义样式',
    'view-class': '视图容器的自定义类名',
    noresize: '不响应容器尺寸变化；容器尺寸不变化时可设置以优化性能',
    tag: '视图容器的元素标签',
    always: '是否始终显示滚动条',
    'min-size': '滚动条最小尺寸',
    id: '视图容器 id',
    role: '视图容器 role',
    'aria-label': '视图容器 aria-label',
    'aria-orientation': '视图容器 aria-orientation',
    tabindex: '包裹容器 tabindex',
    distance: '触发 end-reached 事件的距离，单位 px',
    scroll: '滚动时触发，返回滚动距离',
    'end-reached': '滚动到末端时触发',
  },
}

function toVisionAttributeRows(rows: ApiRow[]): ApiDisplayRow[] {
  return rows.map((row) => ({
    api: row.visionApi,
    elementApi: row.elementApi,
    description: row.description,
    type: row.type,
    defaultValue: row.defaultValue,
  }))
}

function getElementRows(page: DemoPageId): ElementApiRow[] {
  const zhMap = elementApiDescriptionsZh[page] ?? {}
  return [...elementApiTables[page], ...elementExtraApiRows[page]].map((row) => ({
    ...row,
    description: zhMap[row.api] ?? row.description,
  }))
}

function toElementRows(rows: ElementApiRow[]): ApiDisplayRow[] {
  return rows.map((row) => ({
    api: row.api,
    description: row.description,
    type: row.type,
    defaultValue: row.defaultValue,
  }))
}

function createSection(title: string, columns: ApiColumn[], rows: ApiDisplayRow[]): ApiTableSection | undefined {
  if (rows.length === 0) return undefined
  return { title, columns, rows }
}

const currentVisionApiSections = computed(() => {
  const componentName = visionComponentNames[activePage.value]
  return [
    createSection(`${componentName} Attributes`, visionAttributeColumns, toVisionAttributeRows(apiTables[activePage.value])),
    createSection(`${componentName} Events`, eventColumns, visionEventTables[activePage.value]),
  ].filter((section): section is ApiTableSection => Boolean(section))
})

const currentElementApiSections = computed(() => {
  const componentName = elementComponentNames[activePage.value]
  if (!componentName) return []

  const rows = getElementRows(activePage.value)
  const rowsByCategory = {
    Attribute: rows.filter((row) => row.category === 'Attribute'),
    Event: rows.filter((row) => row.category === 'Event'),
    Slot: rows.filter((row) => row.category === 'Slot'),
    Expose: rows.filter((row) => row.category === 'Expose'),
  }

  return [
    createSection(`${componentName} Attributes`, apiColumns, toElementRows(rowsByCategory.Attribute)),
    createSection(`${componentName} Events`, eventColumns, toElementRows(rowsByCategory.Event)),
    createSection(`${componentName} Slots`, slotColumns, toElementRows(rowsByCategory.Slot)),
    createSection(`${componentName} Exposes`, exposeColumns, toElementRows(rowsByCategory.Expose)),
  ].filter((section): section is ApiTableSection => Boolean(section))
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function isGroupCollapsed(title: string) {
  return collapsedGroups.value.has(title)
}

function toggleGroup(title: string) {
  const next = new Set(collapsedGroups.value)
  if (next.has(title)) next.delete(title)
  else next.add(title)
  collapsedGroups.value = next
}

function selectPage(page: SidebarPageId | undefined) {
  if (!page || page === 'icons') return
  activePage.value = page
}
</script>

<template>
  <VisConfigProvider :theme="theme" namespace="vis-el" :z-index="3200">
    <div class="docs-shell" :data-theme="theme">
      <header class="docs-topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true" v-html="logoSvg" />
          <div>
            <strong>Vision Design</strong>
            <small>Design System</small>
          </div>
        </div>

        <VisButton
          class="docs-theme-button"
          variant="secondary"
          icon-only
          :icon-name="themeToggleIcon"
          :label="themeToggleLabel"
          @click="toggleTheme"
        />
      </header>

      <div class="docs-body">
        <aside class="docs-sidebar" aria-label="Design system navigation">
          <section v-for="(group, groupIndex) in sidebarGroups" :key="group.title" class="sidebar-section">
            <button
              type="button"
              class="menu-group"
              :aria-expanded="!isGroupCollapsed(group.title)"
              @click="toggleGroup(group.title)"
            >
              <span>{{ group.title }}</span>
              <Icon v-if="isGroupCollapsed(group.title)" name="chevron-left" :size="16" decorative />
              <Icon v-else name="chevron-down" :size="16" decorative />
            </button>

            <template v-if="!isGroupCollapsed(group.title)">
              <button
                v-for="item in group.items"
                :key="group.title + '-' + item.title"
                class="menu-item"
                :class="{ active: item.page === activePage, 'is-disabled': !item.page || item.page === 'icons' }"
                :disabled="!item.page || item.page === 'icons'"
                type="button"
                @click="selectPage(item.page)"
              >
                <span>{{ item.title }}</span>
                <small>{{ item.subtitle }}</small>
              </button>
            </template>

            <div v-if="groupIndex < sidebarGroups.length - 1" class="menu-divider" aria-hidden="true">
              <span class="menu-divider__line" />
            </div>
          </section>
        </aside>

        <main class="docs-main">
          <article class="content">
            <div class="content-heading">
              <h2 class="content-title">{{ currentPage.title }}</h2>
              <p>{{ currentPage.subtitle }}</p>
            </div>

            <section class="demo-panel">
              <div v-if="activePage === 'button'" class="button-demo">
                <VisButton>主要按钮</VisButton>
                <VisButton variant="secondary">次要按钮</VisButton>
                <VisButton variant="text">文本按钮</VisButton>
                <VisButton variant="link-color">彩色链接</VisButton>
                <VisButton danger>危险按钮</VisButton>
                <VisButton loading>加载中</VisButton>
                <VisButton icon-only icon-name="plus" label="新增" />
              </div>

              <div v-else-if="activePage === 'input'" class="input-demo">
                <VisInput v-model="inputValue" prefix suffix max-length />
                <VisInput state="danger" placeholder="危险态" :max-length="20" />
                <VisInput read-view :model-value="inputValue" />
                <VisInput addon-left addon-right addon-left-text="https://" addon-right-text=".com" />
              </div>

              <div v-else-if="activePage === 'modal'" class="modal-demo">
                <VisButton variant="secondary" @click="modalOpen = true">重新打开</VisButton>
                <VisModal
                  v-model="modalOpen"
                  title="对话框标题"
                  icon
                  footer
                  @cancel="modalOpen = false"
                  @confirm="modalOpen = false"
                >
                  <div class="modal-content">这里是 Modal 的正确结构迁移预览。</div>
                </VisModal>
              </div>

              <div v-else-if="activePage === 'featured-icon'" class="featured-icon-demo">
                <VisFeaturedIcon size="xs" color="brand" type="solid-round" icon="download-cloud-02" />
                <VisFeaturedIcon size="md" color="success" type="light-round" icon="check" />
                <VisFeaturedIcon size="lg" color="warning" type="solid-square" icon="alert-triangle" />
                <VisFeaturedIcon size="xl" color="danger" type="light-square" icon="x-close" />
                <VisFeaturedIcon size="xxl" color="grey" type="modern" icon="settings-01" />
              </div>

              <VisCodeBlock
                v-else-if="activePage === 'code-block'"
                heading
                copy
                language="TypeScript"
                :code="sampleCode"
              />

              <VisScrollShadow v-else class="scroll-demo" variant="surface" :size="64">
                <div class="scroll-demo__content">
                  <p v-for="index in 18" :key="index">
                    滚动内容 {{ index }}：用于验证 ScrollShadow 的顶部和底部渐隐。
                  </p>
                </div>
              </VisScrollShadow>
            </section>

            <section class="api-section" aria-label="组件 API">
              <div v-if="currentVisionApiSections.length > 0" class="api-section__major">
                <h3 class="api-section__title ld-heading-h3">Vision API</h3>

                <div v-for="section in currentVisionApiSections" :key="section.title" class="api-section__group">
                  <h4 class="api-section__subtitle ld-heading-h4">{{ section.title }}</h4>
                  <div class="api-table-wrap">
                    <table class="api-table">
                      <thead>
                        <tr>
                          <th v-for="column in section.columns" :key="column.key">{{ column.label }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in section.rows" :key="`${section.title}-${row.api}`">
                          <td v-for="column in section.columns" :key="column.key">
                            <code v-if="column.key !== 'description'">{{ row[column.key] ?? '-' }}</code>
                            <template v-else>{{ row.description }}</template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div v-if="currentElementApiSections.length > 0" class="api-section__major">
                <h3 class="api-section__title ld-heading-h3">Element API</h3>

                <div v-for="section in currentElementApiSections" :key="section.title" class="api-section__group">
                  <h4 class="api-section__subtitle ld-heading-h4">{{ section.title }}</h4>
                  <div class="api-table-wrap">
                    <table class="api-table">
                      <thead>
                        <tr>
                          <th v-for="column in section.columns" :key="column.key">{{ column.label }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in section.rows" :key="`${section.title}-${row.api}`">
                          <td v-for="column in section.columns" :key="column.key">
                            <code v-if="column.key !== 'description'">{{ row[column.key] ?? '-' }}</code>
                            <template v-else>{{ row.description }}</template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </main>
      </div>
    </div>
  </VisConfigProvider>
</template>

<style scoped>
.docs-shell {
  --shell-border: var(--color-border-default);
  --shell-text-primary: var(--color-text-primary);
  --shell-text-secondary: var(--color-text-secondary);
  --shell-text-tertiary: var(--color-text-tertiary);
  --shell-active-bg: var(--color-bg-secondary);
  --vis-content-width: 1440px;

  width: 100%;
  height: 100dvh;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-sans);
}

.docs-topbar {
  block-size: var(--space-64);
  min-block-size: var(--space-64);
  padding: 0 var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  background: var(--color-bg-surface);
  box-shadow: inset 0 -1px var(--shell-border);
}

.brand {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.brand > div {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
}

.brand strong {
  color: var(--shell-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
}

.brand small {
  overflow: hidden;
  color: var(--shell-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-mark {
  inline-size: 28px;
  block-size: 28px;
  display: inline-flex;
  flex: 0 0 auto;
}

.brand-mark :deep(svg) {
  display: block;
  inline-size: 28px;
  block-size: 28px;
}

.docs-theme-button {
  flex: 0 0 auto;
}

.docs-body {
  min-block-size: 0;
  block-size: calc(100% - var(--space-64));
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  overflow: hidden;
}

.docs-sidebar {
  inline-size: 256px;
  min-block-size: 0;
  block-size: 100%;
  border-inline-end: 1px solid var(--shell-border);
  padding: var(--space-12);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  background: var(--color-bg-surface);
}

.docs-sidebar::-webkit-scrollbar {
  display: none;
  inline-size: 0;
  block-size: 0;
}

.sidebar-section {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.menu-group {
  inline-size: 232px;
  block-size: 36px;
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-8) var(--space-12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  color: var(--shell-text-tertiary);
  background: var(--color-bg-surface);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.menu-group:hover {
  background: var(--shell-active-bg);
}

.menu-group span {
  min-inline-size: 0;
  overflow: hidden;
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-divider {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-16);
  padding: 0 var(--space-12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-divider__line {
  inline-size: 100%;
  block-size: 1px;
  background-image: linear-gradient(to right, var(--color-border-default) 50%, transparent 50%);
  background-position: left center;
  background-repeat: repeat-x;
  background-size: 6px 1px;
}

.menu-item {
  inline-size: 232px;
  block-size: 58px;
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-8) var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: inherit;
  background: var(--color-bg-surface);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover:not(:disabled),
.menu-item.active {
  background: var(--shell-active-bg);
}

.menu-item:disabled {
  cursor: default;
}

.menu-item.is-disabled {
  opacity: 0.56;
}

.menu-item span {
  inline-size: 208px;
  overflow: hidden;
  color: var(--shell-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 600;
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item small {
  margin-block-start: 0;
  inline-size: 208px;
  overflow: hidden;
  color: var(--shell-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item:focus-visible,
.menu-group:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

.docs-main {
  min-inline-size: 0;
  min-block-size: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--vis-content-width)) minmax(0, 1fr);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.content {
  grid-column: 2;
  inline-size: min(100%, var(--vis-content-width));
  min-inline-size: 0;
  padding: var(--space-40) 0;
}

.content-heading {
  margin-block-end: var(--space-16);
}

.content-title {
  margin: 0;
  color: var(--shell-text-primary);
  font-size: var(--font-heading-h2-size);
  font-weight: 600;
  line-height: var(--font-heading-h2-line-height);
}

.content-heading > p:last-child {
  margin: 0;
  color: var(--shell-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.demo-panel {
  max-inline-size: 760px;
  min-block-size: 360px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.api-section {
  margin-block-start: var(--space-32);
  min-inline-size: 0;
}

.api-section__title {
  margin: 0 0 var(--space-20);
  color: var(--color-text-primary);
}

.api-section__major {
  min-inline-size: 0;
}

.api-section__major + .api-section__major {
  margin-block-start: var(--space-32);
}

.api-section__group {
  min-inline-size: 0;
}

.api-section__group + .api-section__group {
  margin-block-start: var(--space-24);
}

.api-section__subtitle {
  margin: 0 0 var(--space-12);
  color: var(--color-text-primary);
}

.api-table-wrap {
  min-inline-size: 0;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-xs);
  overflow-x: auto;
}

.api-table {
  inline-size: 100%;
  min-inline-size: 980px;
  border-collapse: collapse;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.api-table th,
.api-table td {
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-12) var(--space-16);
  text-align: start;
  vertical-align: top;
}

.api-table tr:last-child td {
  border-block-end: 0;
}

.api-table th {
  color: var(--color-text-tertiary);
  background: var(--color-bg-secondary);
  font-weight: 600;
  white-space: nowrap;
}

.api-table td:first-child,
.api-table td:nth-child(2),
.api-table td:nth-child(4),
.api-table td:nth-child(5) {
  white-space: nowrap;
}

.api-table code {
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.button-demo,
.input-demo,
.featured-icon-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.input-demo {
  align-items: flex-start;
  flex-direction: column;
}

.modal-demo {
  display: grid;
  gap: var(--space-20);
}

.modal-content {
  padding: 0 var(--space-20) var(--space-20);
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.scroll-demo {
  inline-size: 420px;
  block-size: 320px;
}

.scroll-demo__content {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-16);
}

.scroll-demo__content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}
</style>
