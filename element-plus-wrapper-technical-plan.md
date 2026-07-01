# 基于 Element Plus 二次封装 Vision Design 的技术方案

## 目标

重新做一套 Vue 3 组件库：底层能力基于 Element Plus，视觉样式延续现有 Vision Design System。最终希望获得三件事：

1. 复用 Element Plus 已成熟的交互、无障碍、表单校验、浮层、选择器等复杂逻辑。
2. 对外仍暴露 Vision Design 的组件命名、属性语义、设计 token 和视觉规范。
3. 让后续静态原型、业务页面和正式项目都能用同一套组件 API 和主题。

## 推荐结论

推荐采用“Vision Facade + Element Plus Adapter”的方式，而不是直接修改 Element Plus 源码。

也就是说：

- 对外使用 `visButton`、`visInput`、`visSelect`、`visDialog` 等 Vision 组件。
- 组件内部按需引用 `ElButton`、`ElInput`、`ElSelect`、`ElDialog` 等 Element Plus 组件。
- 视觉层用 Vision token 覆盖 Element Plus 的 CSS variables / SCSS variables，并在封装组件内补齐设计稿差异。
- 对复杂组件优先保留 Element Plus 的行为逻辑，对简单展示组件继续使用现有自研实现也可以。

这条路线比较稳：既能吃到 Element Plus 的工程成熟度，又不会让 Vision Design 被 Element Plus 的 API 完全绑死。

## 当前项目基础

当前 `vision-design` 已具备：

- Vue 3 + Vite library 构建。
- `src/components/*/index.ts` 的组件级入口。
- `src/styles/tokens.css` 的设计变量。
- `src/index.ts` 的统一导出。
- 文档演示页和路由结构。
- 已有大量 Vision 命名组件。

后续可以在现有项目内渐进式引入 Element Plus，而不是另起一个完全孤立的新项目。更推荐先开一个实验分支，例如：

```bash
git checkout -b codex/element-plus-wrapper
```

## 总体架构

建议分为 5 层：

```text
应用侧
  ↓
Vision Public API
  ↓
Vision Wrapper Components
  ↓
Element Plus Adapter / Headless Logic / 自研补充
  ↓
Vision Tokens + Element Plus Theme Overrides
```

### 1. Vision Public API

这层是对外稳定接口，决定组件库长期兼容性。

示例：

```ts
export type visButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'linkColor' | 'linkGrey'
export type visButtonSize = 'sm' | 'md' | 'lg'
```

组件用户不应该直接关心 Element Plus 的 `type="primary"`、`plain`、`link` 等内部组合。

### 2. Vision Wrapper Components

每个组件单独封装 Element Plus：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { ElButton } from 'element-plus'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
})

const elementSize = computed(() => {
  if (props.size === 'sm') return 'small'
  if (props.size === 'lg') return 'large'
  return 'default'
})
</script>

<template>
  <ElButton
    class="vis-button"
    :class="[`vis-button--${variant}`, `vis-button--${size}`]"
    :size="elementSize"
    :loading="loading"
    :disabled="disabled || loading"
  >
    <slot />
  </ElButton>
</template>
```

### 3. Element Plus Adapter

把 Vision API 转换成 Element Plus API。建议每个复杂组件单独维护一个 adapter 文件，避免映射逻辑散落在模板中。

示例：

```ts
// src/components/button/button.adapter.ts
export function resolveElementButtonProps(props: visButtonProps) {
  return {
    type: props.variant === 'primary' ? 'primary' : undefined,
    size: leoSizeToElementSize[props.size],
    disabled: props.disabled || props.loading,
  }
}
```

这样后面 Element Plus 升级或 Vision API 调整时，只改 adapter。

### 4. Vision Tokens

继续以 `src/styles/tokens.css` 作为唯一视觉 token 来源。

建议新增：

```text
src/styles/element-plus.css
src/styles/element-plus.scss
src/styles/theme.css
```

职责划分：

- `tokens.css`：Vision 原始 token，只来自 Figma。
- `element-plus.css`：把 Vision token 映射到 `--el-*` CSS 变量。
- `element-plus.scss`：需要编译期覆盖的 Element Plus SCSS 变量。
- `theme.css`：组件级细节覆盖，例如 `.vis-button .el-button__loading`。

### 5. 自研补充层

不是所有组件都适合交给 Element Plus。

建议保留自研的类型：

- Icon：已有图标体系和 stroke 规则，不建议换。
- FeaturedIcon：设计系统特有组件。
- CodeBlock / Markdown / RichTextEditor：Element Plus 不是核心能力来源。
- PageHeader / 软件工厂类复合组件：业务/文档型复合组件。
- Loading：如果设计稿对图形还原要求高，保留自研更稳。

## 依赖设计

### package.json

建议把 Element Plus 放入 `peerDependencies` 和 `devDependencies`。

```json
{
  "peerDependencies": {
    "vue": "^3.5.0",
    "element-plus": "^2.14.0"
  },
  "devDependencies": {
    "element-plus": "^2.14.0",
    "sass": "^1.90.0",
    "unplugin-element-plus": "^0.10.0",
    "unplugin-vue-components": "^0.28.0",
    "unplugin-auto-import": "^0.18.0"
  }
}
```

注意：

- 组件库不应把 Element Plus 打进最终包里，应该 external 掉。
- 如果希望消费者免配置样式，可在 Vision 包里输出已编译好的样式文件。
- 具体版本实施时以 Element Plus 官方最新版本为准，方案中版本只作为起点建议。

### Vite library external

`vite.lib.config.js` 中需要 external：

```js
rollupOptions: {
  external: ['vue', 'element-plus'],
}
```

如果直接引用 Element Plus 的子路径样式，还需要确认构建产物不会意外复制大量 theme-chalk 文件。

## 样式实现方案

Element Plus 官方支持多种主题方式：SCSS 变量覆写、CSS 变量覆写、按需样式导入、Config Provider。这里建议组合使用。

参考官方文档：

- Element Plus Quick Start: https://element-plus.org/en-US/guide/quickstart.html
- Element Plus Theming: https://element-plus.org/en-US/guide/theming.html
- Element Plus Config Provider: https://element-plus.org/en-US/component/config-provider.html

### 方案 A：CSS Variables 映射，作为主方案

新建：

```css
/* src/styles/element-plus.css */
.vision-theme,
:root {
  --el-color-primary: var(--color-fg-brand-primary);
  --el-color-success: var(--color-fg-success-primary);
  --el-color-warning: var(--color-fg-warning-primary);
  --el-color-danger: var(--color-fg-danger-primary);
  --el-color-error: var(--color-fg-danger-primary);
  --el-color-info: var(--color-fg-tertiary);

  --el-text-color-primary: var(--color-text-primary);
  --el-text-color-regular: var(--color-text-secondary);
  --el-text-color-secondary: var(--color-text-tertiary);
  --el-text-color-placeholder: var(--color-text-placeholder);

  --el-border-color: var(--color-border-primary);
  --el-border-color-light: var(--color-border-secondary);
  --el-fill-color-blank: var(--color-bg-canvas);
  --el-bg-color: var(--color-bg-canvas);

  --el-border-radius-base: var(--radius-sm);
  --el-border-radius-round: var(--radius-full);
}
```

优点：

- 支持运行时切换亮色/暗色。
- 和当前 Vision token 系统一致。
- 对消费者友好，导入一个 CSS 即可。

限制：

- 某些 Element Plus 样式仍来自 SCSS 编译结果，纯 CSS 变量不一定覆盖完整。
- 不同组件的内部变量命名很多，需要逐个组件审查。

### 方案 B：SCSS 变量覆写，作为补充

新建：

```scss
/* src/styles/element-plus.scss */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #3366ff,
    ),
    'success': (
      'base': #2bafad,
    ),
    'warning': (
      'base': #f08a24,
    ),
    'danger': (
      'base': #de4c56,
    ),
    'error': (
      'base': #de4c56,
    ),
    'info': (
      'base': #919399,
    ),
  )
);
```

注意：

- SCSS 阶段不能直接使用运行时 CSS token，比如 `var(--color-*)`。
- 因此 SCSS 只适合覆盖基础色值和编译期派生色。
- 真正需要暗色切换的内容仍应放在 CSS variables。

### 方案 C：组件局部覆盖，解决设计稿差异

每个 wrapper 组件只负责覆盖自己区域：

```css
.vis-button.el-button {
  height: var(--vis-button-height);
  padding-inline: var(--vis-button-padding-x);
  border-radius: var(--vis-button-radius);
  font-family: var(--font-family-text);
  font-size: var(--vis-button-font-size);
  line-height: var(--vis-button-line-height);
  box-shadow: none;
}
```

注意不要写过宽选择器：

```css
/* 不推荐 */
.el-button {
  border-radius: var(--radius-sm);
}
```

因为这会污染用户项目内直接使用的 Element Plus。

推荐：

```css
/* 推荐 */
.vis-button.el-button {
  border-radius: var(--radius-sm);
}
```

## 命名空间策略

建议使用 Element Plus 的 `namespace` 能力，把内部 class 从 `el-*` 改成 `vis-el-*`。

应用侧：

```vue
<ElConfigProvider namespace="vis-el">
  <App />
</ElConfigProvider>
```

封装库侧也可以提供：

```vue
<visConfigProvider>
  <slot />
</visConfigProvider>
```

好处：

- 避免业务项目同时使用原生 Element Plus 和 Vision Design 时样式互相污染。
- 能更清晰地写覆盖选择器。

需要注意：

- namespace 会改变 Element Plus 内部 class 名，所有覆盖样式也要同步改。
- 如果消费者忘记包 `ConfigProvider`，样式可能失效。
- 可以在 Vision 插件安装时自动注入默认配置，但文档仍要明确说明。

## 组件封装策略

### 分级封装

建议把组件分为三类。

| 类型 | 处理方式 | 示例 |
| --- | --- | --- |
| 简单展示组件 | 保留 Vision 自研或轻量封装 | Badge、Avatar、Tag、Divider |
| 标准交互组件 | 基于 Element Plus 封装 | Button、Input、Checkbox、Radio、Switch/Toggle、Tabs |
| 复杂数据/浮层组件 | 强烈建议基于 Element Plus | Select、DatePicker、TimePicker、Table、Tree、Pagination、Dialog、Drawer、Popover、Tooltip |

### API 设计原则

1. 对外 API 先匹配 Vision Design System，而不是 Element Plus。
2. Element Plus 的常用能力可以透传，但要有边界。
3. 透传属性使用 `inheritAttrs` 和 `v-bind="$attrs"`，但不要让关键视觉属性失控。
4. 事件名尽量延续 Vue 标准，如 `v-model` / `update:modelValue`。
5. 复杂组件可以暴露 Element Plus 原生类型，但最好用 Vision 类型再包装一层。

示例：

```ts
export interface visSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

不要一开始就把 Element Plus 的所有 props 原样复制到 Vision API，否则以后会变成兼容负担。

### Vision API 和 Element Plus API 不一致时的处理方案

二次封装过程中一定会遇到这种情况：Vision 自有组件的 API 和 Element Plus 不完全一致。有些 Vision API 是设计系统需要的增强能力，有些 Element Plus API 在 Vision 中暂时不需要，Button 组件就是典型例子。

处理原则不是“完全兼容 Element Plus”，也不是“完全屏蔽 Element Plus”，而是分成 4 层：

| 层级 | 类型 | 处理方式 | 示例 |
| --- | --- | --- | --- |
| Vision 核心 API | 设计系统明确需要、文档主推 | 作为公开 props，长期稳定维护 | `variant`、`size`、`danger`、`loading` |
| Vision 增强 API | Element Plus 没有，但 Vision 需要 | wrapper 内部实现或组合实现 | Button 的 `linkColor`、`linkGrey`、自定义 loading 图形 |
| Element Plus 常用 API | 行为能力有价值，但不是 Vision 主语义 | 显式挑选后透出 | `disabled`、`nativeType`、`autofocus` |
| Element Plus 高级 API | 使用频率低、可能污染设计约束 | 放入 `elProps` 或 `$attrs` 透传，不写进主文档第一层 | `tag`、部分 popper 配置、内部行为参数 |

#### 1. 公开 API 以 Vision 为主

组件文档、类型和示例都优先使用 Vision API。

例如 Button 不建议直接暴露 Element Plus 的 `type / plain / round / link / text` 组合，而是定义：

```ts
export type visButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'linkColor'
  | 'linkGrey'

export type visButtonSize = 'sm' | 'md' | 'lg'
```

然后由 adapter 转换成 Element Plus 能理解的 props 和 class：

```ts
export function resolveElementButtonProps(props: visButtonProps) {
  return {
    type: props.variant === 'primary' ? 'primary' : undefined,
    size: resolveElementSize(props.size),
    disabled: props.disabled || props.loading,
    nativeType: props.nativeType,
  }
}
```

#### 2. Vision 多出来的 API，由 wrapper 负责实现

如果 Vision API 是设计稿和组件规范真实需要的，即使 Element Plus 没有，也应该保留。

例如 Button：

- `variant="linkColor"` 和 `variant="linkGrey"`：Element Plus 没有完全一致的语义，可以用 `ElButton` 的基础行为加 Vision class 实现。
- `loading`：Element Plus 有 loading 行为，但 loading 图形、尺寸、颜色需要改成 Vision 的 `visLoading`。
- icon 规则：Element Plus icon 不符合 Vision stroke 规则，应优先使用 Vision `Icon` 组件。

推荐结构：

```vue
<ElButton
  v-bind="elementButtonProps"
  class="vis-button"
  :class="buttonClasses"
>
  <template v-if="loading" #loading>
    <visLoading :size="loadingSize" />
  </template>

  <Icon v-if="prefixIcon" :name="prefixIcon" :size="iconSize" />
  <slot />
  <Icon v-if="suffixIcon" :name="suffixIcon" :size="iconSize" />
</ElButton>
```

#### 3. Vision 少掉的 Element Plus API，不要默认补齐

Element Plus 的 API 很大，并不是每个都适合进入 Vision。

判断标准：

- 是否会破坏设计稿约束？
- 是否会导致组件出现未定义视觉状态？
- 是否是业务高频真实需求？
- 是否能稳定维护类型和文档？

如果答案不明确，就不要作为 Vision 主 API 暴露。

例如 Button 可以暂不公开：

- `plain`
- `round`
- `circle`
- `text`
- `bg`
- `color`

因为这些属性会绕过 Vision 的 variant 体系，容易生成设计稿之外的按钮样式。

#### 4. 需要保留扩展能力时，使用 `elProps` 或 `$attrs`

为了避免 Vision API 过窄，可以提供一个明确的逃生口。

推荐两种方式：

```ts
defineProps<{
  variant?: visButtonVariant
  size?: visButtonSize
  elProps?: Partial<ButtonProps>
}>()
```

或：

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <ElButton v-bind="{ ...$attrs, ...elementButtonProps }" />
</template>
```

两者区别：

- `elProps` 更可控，适合复杂组件，文档也更清楚。
- `$attrs` 更方便，但容易让用户传入影响视觉的属性。

推荐规则：

- 基础组件如 Button/Input：优先使用 `elProps`。
- 浮层/选择器等复杂组件：可以同时支持 `elProps` 和特定子配置，如 `popperProps`。
- 任何会改变视觉体系的 Element Plus props，都应该由 Vision props 接管，而不是随意透传。

#### 5. 属性冲突时，Vision 优先

如果用户同时传入 Vision props 和 Element Plus props，以 Vision props 为准。

示例：

```vue
<visButton variant="primary" :el-props="{ type: 'danger' }" />
```

最终应该渲染为 Vision 的 primary，而不是 Element Plus danger。否则组件会出现“看起来是 Vision，行为却被 Element Plus 偷偷改掉”的问题。

可以在开发环境给出 warning：

```ts
if (__DEV__ && props.elProps?.type) {
  console.warn('[vision-design] visButton: elProps.type is ignored. Use variant instead.')
}
```

#### 6. 事件和插槽尽量兼容 Vue 习惯

事件优先保持 Vue 组件库常见写法：

- `v-model`
- `update:modelValue`
- `change`
- `focus`
- `blur`
- `clear`

Element Plus 特有事件如果确实有价值，可以透出，但要在文档中标注为“Element Plus passthrough event”。

插槽同理：

- Vision 主插槽使用设计系统命名。
- Element Plus 原生 slot 只有在确实需要时才透出。
- 如果 slot 会破坏视觉结构，需要限制或不开放。

#### 7. 每个组件都要有 API 对照表

重做组件时，文档中建议增加一张 API 对照表：

| 能力 | Vision API | Element Plus API | 处理方式 |
| --- | --- | --- | --- |
| 视觉类型 | `variant` | `type/plain/link/text` | Vision 接管，adapter 映射 |
| 尺寸 | `size="sm/md/lg"` | `size="small/default/large"` | adapter 映射 |
| 加载 | `loading` | `loading` | 行为复用，图形替换 |
| 原生按钮类型 | `nativeType` | `native-type` | 显式透出 |
| 自定义颜色 | 不开放 | `color` | 禁止，避免破坏 token |
| 高级原生能力 | `elProps` | 多个 | 逃生口 |

这张表是后续维护的锚点：新增 API、删除 API、升级 Element Plus 时都先看它。

#### 8. 版本演进策略

建议把 API 分成三个状态：

| 状态          | 含义                 | 文档处理          |
| ----------- | ------------------ | ------------- |
| stable      | Vision 正式公开 API    | 主文档展示，长期兼容    |
| passthrough | 透传 Element Plus 能力 | 次级文档展示，兼容性弱一些 |
| internal    | 内部实现，不承诺稳定         | 不在公开文档展示      |

这样可以避免“临时为了方便透出去的能力”变成长期维护包袱。

## 建议优先封装的组件顺序

### 第一阶段：基础表单

目标是验证主题、尺寸、focus、disabled、danger、loading 等基础状态。

1. Button
2. Input
3. InputTextarea
4. InputNumber
5. Checkbox
6. Radio
7. Toggle

### 第二阶段：浮层和选择器

目标是验证 Teleport、z-index、滚动锁定、点击外部关闭、键盘交互。

1. Tooltip
2. Popover
3. Dropdown
4. Select
5. DatePicker
6. TimePicker
7. Modal/Dialog
8. Drawer

### 第三阶段：数据展示和导航

目标是验证复杂结构、插槽、空状态、分页、表格。

1. Tabs
2. Pagination
3. Tree
4. Table
5. Menu
6. Breadcrumb
7. Steps

### 第四阶段：复合组件

继续保留 Vision 自身特征。

1. PageHeader
2. Notification
3. Message
4. RichTextEditor
5. Markdown

## 单组件目录规范

建议每个组件目录统一：

```text
src/components/button/
  visButton.vue
  button.adapter.ts
  button.types.ts
  button.css
  index.ts
```

说明：

- `visButton.vue`：模板和最少状态逻辑。
- `button.adapter.ts`：Vision props 到 Element Plus props 的映射。
- `button.types.ts`：公开类型。
- `button.css`：组件级样式覆盖。
- `index.ts`：导出组件和类型。

如果继续使用 scoped CSS，需要注意 Element Plus 内部结构经常需要 `:deep()`，长期维护会不舒服。更推荐组件样式使用普通 CSS，并通过 `.vis-button` 这类根 class 限定作用域。

## 安装方式设计

### 全量安装

```ts
import { createApp } from 'vue'
import VisionDesign from 'vision-design'
import 'vision-design/style.css'

createApp(App).use(VisionDesign).mount('#app')
```

需要提供：

```ts
export default {
  install(app: App) {
    app.component('visButton', visButton)
    app.component('visInput', visInput)
  },
}
```

### 按需导入

```ts
import { visButton } from 'vision-design/components/button'
import 'vision-design/style.css'
```

当前项目已有 `./components/*` exports，可以沿用。

后续可以再提供 `unplugin-vue-components` resolver：

```ts
VisionDesignResolver()
```

但这不是第一阶段必须项。

## 样式导入策略

有两种选择。

### 选择 1：Vision 打包统一 style.css

消费者只导入：

```ts
import 'vision-design/style.css'
```

优点：

- 使用简单。
- 设计系统一致性高。

缺点：

- 即使只用一个组件，也会带入整套 CSS。
- 原型场景可以接受，正式业务包体需继续观察。

### 选择 2：组件级 CSS 按需输出

消费者导入：

```ts
import 'vision-design/components/button/style.css'
```

优点：

- 更利于生产包体。

缺点：

- 构建配置更复杂。
- Element Plus 内部样式按需关系也要同步处理。

建议第一阶段先做统一 `style.css`，等封装稳定后再优化组件级样式输出。

## 与现有 Vision token 的关系

必须坚持一个原则：Figma token → Vision token → Element Plus token。

不要让 Element Plus 的变量反向成为设计系统源头。

推荐映射链：

```text
Figma variables
  ↓ sync
src/styles/tokens.css
  ↓ map
src/styles/element-plus.css
  ↓ consume
Element Plus internal CSS variables
  ↓ override
Vision wrapper component style
```

## 暗色模式

建议沿用现有 Vision 暗色 token，并增加：

```css
:root[data-theme='dark'],
.vision-theme.dark {
  --el-bg-color: var(--color-bg-canvas);
  --el-text-color-primary: var(--color-text-primary);
  --el-border-color: var(--color-border-primary);
}
```

注意：

- Element Plus 自带 dark mode 变量和 Vision dark token 可能重叠。
- 不建议同时完全启用 Element Plus dark CSS 和 Vision dark CSS，容易出现变量优先级混乱。
- 选一种主控：建议 Vision token 主控，Element Plus 只做被映射对象。

## 图标策略

不建议使用 Element Plus Icons 作为主图标库。

推荐：

- Vision 组件默认使用现有 `Icon` 组件。
- Element Plus 内部需要 icon 的地方，通过 slot 替换。
- 对无法替换的内部 icon，再用 CSS 或 adapter 局部处理。

原因：

- Vision 已经有固定 icon 尺寸和 stroke width 映射规则。
- 直接混用 Element Plus Icons 会造成描边、尺寸、颜色不一致。

## 表单体系

Element Plus 的表单能力值得复用，但 Vision 需要定义自己的展示层。

建议封装：

- `visForm`
- `visFormItem`
- `visInput`
- `visSelect`
- `visCheckboxGroup`
- `visRadioGroup`

关键点：

- 保留 Element Plus 的校验规则能力。
- Vision 控制 label、help text、error text、required mark 的样式。
- `danger` 命名要映射到 Element Plus 的 `error` 或 validate state。

## 浮层体系

Tooltip、Popover、Dropdown、Select、DatePicker、TimePicker、Modal、Drawer 都涉及浮层。

需要统一：

- z-index 起点。
- Teleport 目标。
- 滚动锁定。
- 点击外部关闭。
- ESC 关闭。
- focus trap。
- 浮层圆角、阴影、边框。
- 小箭头样式。

建议提供全局配置：

```ts
export interface visConfig {
  namespace?: string
  zIndex?: number
  teleportTo?: string | HTMLElement
  locale?: string
}
```

并封装：

```vue
<visConfigProvider :z-index="3000" namespace="vis-el">
  <App />
</visConfigProvider>
```

## 可访问性

基于 Element Plus 的一个主要收益就是 a11y 基础更稳，但二次封装仍可能破坏它。

注意：

- 不要吞掉 Element Plus 原生 `aria-*`。
- wrapper 根节点不要乱改语义标签。
- slot 替换 icon 时保留 `aria-hidden` 或可访问 label。
- 自定义 keyboard 逻辑要和 Element Plus 原有逻辑兼容。
- Modal/Drawer 必须确认 focus trap 和 ESC 行为。

## 国际化

Element Plus 有 locale 能力，Vision 应该透传到 `ElConfigProvider`。

建议：

```ts
import zhCn from 'element-plus/es/locale/lang/zh-cn'
```

在 `visConfigProvider` 中统一管理：

```vue
<ElConfigProvider :locale="locale" :z-index="zIndex" :namespace="namespace">
  <slot />
</ElConfigProvider>
```

## 构建和发布

### 产物建议

```text
dist/lib/index.js
dist/lib/components/button/index.js
dist/lib/assets/style.css
dist/types/index.d.ts
dist/types/components/button/index.d.ts
```

### package exports

当前 exports 可以继续，但要补充样式策略：

```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/lib/index.js"
    },
    "./components/*": {
      "types": "./dist/types/components/*/index.d.ts",
      "import": "./dist/lib/components/*.js"
    },
    "./style.css": "./dist/lib/assets/style.css",
    "./tokens.css": "./dist/lib/assets/tokens.css"
  },
  "sideEffects": [
    "**/*.css",
    "**/*.scss"
  ]
}
```

### external

必须 external：

```js
external: [
  'vue',
  'element-plus',
]
```

如果有子路径引用，也要测试是否被正确 external。

## 测试策略

### 单元测试

建议引入：

- Vitest
- Vue Test Utils
- jsdom 或 happy-dom

覆盖：

- props 映射是否正确。
- `v-model` 是否正确。
- disabled/loading 是否阻止交互。
- wrapper 是否透传 attrs。
- 插槽是否正常。

### 视觉回归

强烈建议引入 Playwright 截图测试。

原因：

- 这套组件库的核心价值是样式一致。
- Element Plus 内部 DOM 或 CSS 改动会造成视觉漂移。

建议先对核心组件做截图基线：

- Button
- Input
- Select
- DatePicker
- Modal
- Tooltip
- Tabs
- Table

### 类型测试

需要保证：

- 对外导出的类型稳定。
- 单组件导入类型可用。
- 全量导入和按需导入都能推导。

## 迁移路线

### Step 1：建立 Element Plus 基础接入

任务：

- 安装 `element-plus`、`sass`。
- 配置 external。
- 新建 `visConfigProvider`。
- 新建 `element-plus.css` token 映射。
- 文档站接入 `visConfigProvider`。

验收：

- 文档站可正常运行。
- Element Plus 样式不污染现有组件。
- 亮色/暗色 token 正常。

### Step 2：重做 3 个基准组件

建议选择：

- Button
- Input
- Modal

原因：

- Button 验证尺寸、状态、loading、icon。
- Input 验证表单交互、clear、focus、danger。
- Modal 验证浮层、z-index、focus trap。

验收：

- 与现有 Vision 视觉一致。
- API 不比现有组件更难用。
- 构建产物不显著膨胀。

### Step 3：扩展到表单组件

任务：

- Checkbox
- Radio
- Toggle
- InputNumber
- Select
- DatePicker
- TimePicker

验收：

- 表单校验链路跑通。
- 复杂交互优先复用 Element Plus。
- Vision 的 danger 命名一致。

### Step 4：扩展到导航和数据组件

任务：

- Tabs
- Pagination
- Tree
- Table
- Menu

验收：

- 支持真实业务数据。
- 支持受控/非受控模式。
- 支持键盘和滚动。

### Step 5：清理旧实现

任务：

- 保留自研必要组件。
- 废弃重复逻辑。
- 输出 migration guide。
- 给旧 props 做 deprecated 标记。

## 主要风险和注意事项

### 1. API 被 Element Plus 绑死

风险：

如果 Vision 组件直接暴露 Element Plus 全量 props，后面 Element Plus 升级会变成 Vision 的破坏性变更。

建议：

- Vision 只暴露设计系统需要的核心 props。
- 复杂高级能力通过 `elProps` 或 `$attrs` 透传。
- 对外文档优先写 Vision API。

### 2. 样式覆盖脆弱

风险：

Element Plus 内部 DOM 和 class 可能升级变化，深层选择器容易失效。

建议：

- 优先用 CSS variables。
- 其次用 wrapper 根 class。
- 尽量少写依赖内部层级的 `:deep(.el-xxx > .el-yyy)`。

### 3. 暗色模式变量冲突

风险：

Element Plus dark mode 和 Vision dark token 同时生效时，可能出现一半颜色来自 Element Plus，一半来自 Vision。

建议：

- Vision token 作为唯一暗色源。
- 明确禁用或谨慎引入 Element Plus 自带 dark CSS。

### 4. 包体变大

风险：

如果全量导入 Element Plus 或错误打包依赖，组件库体积会明显上升。

建议：

- Element Plus 作为 peer dependency。
- library build external 掉 `vue` 和 `element-plus`。
- 文档站可以全量使用，组件库产物必须按需。

### 5. 样式顺序问题

风险：

Element Plus 样式和 Vision 覆盖样式顺序错误，会导致覆盖失效。

建议导入顺序：

```ts
import 'element-plus/theme-chalk/base.css'
import 'vision-design/style.css'
```

如果 Vision 打包时已经包含必要 Element Plus 样式，则文档必须说明消费者不需要重复导入。

### 6. 表单行为和视觉状态不一致

风险：

Element Plus 使用 `error`，Vision 使用 `danger`。如果映射不清晰，组件状态会混乱。

建议：

- Vision API 统一使用 `danger`。
- adapter 内部映射到 Element Plus 的 `error` / validate state。
- 文档中不再出现 `error` 作为公开状态名。

### 7. 图标体系混乱

风险：

Element Plus 默认 icon 和 Vision icon 混用后，stroke、尺寸和颜色会不一致。

建议：

- 默认全部替换为 Vision Icon。
- Element Plus 内部 icon 通过 slot 或 CSS 局部修正。

### 8. Teleport 和样式作用域

风险：

Popover、Tooltip、Select、DatePicker 的浮层通常 Teleport 到 body，组件 scoped CSS 可能覆盖不到。

建议：

- 浮层样式使用全局 CSS，并通过 Vision class / namespace 限定。
- 为浮层组件统一设置 `popper-class`。

### 9. SSR 和 Nuxt

风险：

Element Plus 有 SSR 注意事项，浮层和浏览器 API 可能影响 Nuxt。

建议：

- 第一阶段先支持 Vite SPA。
- 第二阶段再补 SSR 验证。
- 文档明确当前支持范围。

### 10. 设计稿一比一还原不等于只改 CSS

风险：

Element Plus 某些组件 DOM 结构和 Figma 结构差异很大，仅 CSS 很难完全一致。

建议：

- 对高还原要求组件允许自研外壳。
- Element Plus 负责行为，Vision 负责可见结构。
- 必要时使用 Element Plus hooks/composables 或更底层的 headless 实现。

## 组件映射建议

| Vision 组件 | Element Plus 底座 | 建议 |
| --- | --- | --- |
| Button | ElButton | 适合重做 |
| Input | ElInput | 适合重做 |
| InputTextarea | ElInput type=textarea | 适合重做 |
| InputNumber | ElInputNumber | 适合重做 |
| Checkbox | ElCheckbox | 适合重做 |
| Radio | ElRadio | 适合重做 |
| Toggle | ElSwitch | 适合重做 |
| Select | ElSelect | 适合重做 |
| DatePicker | ElDatePicker | 适合重做，但样式细节需重点验证 |
| TimePicker | ElTimePicker / ElTimeSelect | 可复用逻辑，但当前滚动列设计可能需要自研 |
| Modal | ElDialog | 适合重做 |
| Drawer | ElDrawer | 适合重做 |
| Tooltip | ElTooltip | 适合重做 |
| Popover | ElPopover | 适合重做 |
| Dropdown | ElDropdown | 适合重做 |
| Pagination | ElPagination | 适合重做 |
| Tabs | ElTabs | 可重做，但 Vision align 规则需自定义 |
| TreeView | ElTree | 可重做 |
| Menu | ElMenu | 可重做，但视觉差异可能较大 |
| Avatar | ElAvatar | 不一定需要，现有实现更贴合设计稿 |
| Badge | ElBadge | 可参考，但现有实现更可控 |
| Tag | ElTag | 可重做 |
| Rate | ElRate | 可重做 |
| Slider | ElSlider | 可重做 |
| ProgressBar | ElProgress | 可重做 |
| ProgressCircle | ElProgress | 可重做 |
| Icon | 无 | 保留自研 |
| FeaturedIcon | 无 | 保留自研 |
| Markdown | 无 | 保留自研 |
| RichTextEditor | 无 | 保留自研 |
| CodeBlock | 无 | 保留自研 |

## 文档站调整

文档站需要同时展示：

- Vision API。
- 底层是否基于 Element Plus。
- 和 Element Plus 原生 API 的差异。
- 是否支持 attrs 透传。
- 是否支持原生 Element Plus slot。

建议每个组件页增加一个“实现说明”区块，但不要让普通使用者一开始就看到太多底层细节。

## 最小可行版本

建议 MVP 只做：

1. `visConfigProvider`
2. `visButton`
3. `visInput`
4. `visModal`
5. `element-plus.css` token 映射
6. 文档页示例
7. library build external 验证

MVP 验收标准：

- 可以在一个新 Vue 3 项目里安装并使用。
- Button/Input/Modal 的视觉接近现有 Vision 组件。
- 支持按需导入。
- 支持亮色/暗色切换。
- 构建后 Element Plus 没有被打进 Vision 产物。

## 推荐实施顺序

1. 新建分支和技术验证目录。
2. 安装 Element Plus 相关依赖。
3. 新增 `visConfigProvider`。
4. 新增 Element Plus token 映射 CSS。
5. 改造 `vite.lib.config.js` external。
6. 重做 Button。
7. 重做 Input。
8. 重做 Modal。
9. 为三者补文档演示页。
10. 跑 `build:docs`、`build:lib`。
11. 检查 dist 体积和依赖是否 external。
12. 决定是否继续批量迁移。

## 最后建议

这次重做不要追求“一口气把所有组件换成 Element Plus”。更稳的做法是先用 3 个基准组件把架构跑通。

如果 Button、Input、Modal 三个组件能做到：

- API 不退化；
- 样式能对齐；
- 构建产物干净；
- 文档站可维护；
- 暗色模式正常；

那么这条路线就值得继续推进。否则需要重新评估哪些组件适合基于 Element Plus，哪些组件继续保持 Vision 自研。

---

## 补充：AI 执行参考 - 二次封装 API 策略

本节用于指导 AI 在迁移 `leoht-design` 组件时如何定义 Vision API、复用 Element Plus 能力、处理样式与 token 映射。它是执行规则，不是背景说明。

### 1. 核心结论

- 默认采用“兼容增强模式”：Vision 对外提供设计系统语义 API，Element Plus 作为内部行为底座。
- Vision props 不要求与 Element Plus 100% 一致，但行为语义必须可映射、可解释、可测试。
- 不允许将 Element Plus 全量 props 直接复制为 Vision 主 API。
- 不允许为了“设计自由”随意重写基础行为，例如 `v-model`、`disabled`、`loading`、表单校验、键盘交互。
- 当 Vision API 与 Element Plus passthrough 配置冲突时，Vision API 永远优先。

推荐结构：

```text
Vision semantic API
  -> component adapter
  -> selected Element Plus props/events/slots
  -> Vision token and scoped style overrides
```

### 2. 封装模式选择

| 模式 | 使用条件 | 本项目策略 |
| --- | --- | --- |
| 纯透传 | 只需要快速包一层 Element Plus，几乎没有独立设计语言 | 不作为主路线 |
| 兼容增强 | 需要 Vision 语义、旧项目视觉、Element Plus 行为能力同时成立 | 默认路线 |
| 完全抽象 | 组件价值主要来自自有交互或自有 DOM，Element Plus 约束过强 | 仅对特殊组件使用 |

优先判断：

```text
复杂交互强 -> Element Plus wrapper
视觉 DOM 是组件价值本身 -> 清洁迁移或自研
Element Plus DOM 可被 token + root class 稳定覆盖 -> Element Plus wrapper
否则 -> Hybrid：Element Plus 管行为，Vision 管可见结构
```

### 3. API 分层

每个组件必须明确 API 所属层级。

| 层级 | 定义 | 示例 | 规则 |
| --- | --- | --- | --- |
| Vision Stable API | 业务优先使用的正式 API | `variant`、`size`、`tone`、`status` | 文档主入口，长期稳定 |
| Vision Enhancement API | Element Plus 没有但 Vision 需要的能力 | `iconOnly`、`density`、自定义 loading 图形 | 可进入主文档或进阶文档 |
| Selected Element Plus API | 行为稳定且不会破坏视觉约束的底层能力 | `disabled`、`nativeType`、`clearable`、`autofocus` | 显式暴露，写清映射关系 |
| Escape Hatch | 高级场景临时透传 | `elProps`、`popperProps`、`dialogProps` | 放在 API 表末尾，不作为推荐用法 |

AI 生成组件时必须优先设计 Vision Stable API，再决定哪些 Element Plus 能力需要显式暴露或放入逃生口。

### 4. Props 决策矩阵

| 类型 | 要求 | 示例 |
| --- | --- | --- |
| 行为语义 | 必须与 Element Plus 等价或兼容 | `disabled`、`loading`、`readonly`、`checked`、`selected` |
| 数据结构 | 必须保持 Vue/Element Plus 生态习惯 | `modelValue`、`value`、`options`、`columns`、`data` |
| 基础事件 | 必须稳定透出 | `update:modelValue`、`change`、`click`、`focus`、`blur` |
| 表单链路 | 必须兼容 Element Plus Form | 校验状态、错误提示、required、help text |
| 设计语义 | 可以使用 Vision 命名 | `variant` 映射 `type`，`tone="danger"` 映射错误/危险语义 |
| 尺寸密度 | 可以使用 Vision 体系 | `sm/md/lg` 或 `density` 映射 `small/default/large` |
| 视觉破坏项 | 默认不开放或受控开放 | `color`、`plain`、`text`、`bg`、任意 style 覆盖 |
| 复杂底层配置 | 默认放入逃生口 | popper 策略、teleport、虚拟滚动、懒加载配置 |

### 5. Adapter 规则

每个基于 Element Plus 的组件都应包含 `*.adapter.ts`，集中处理 Vision props 到 Element Plus props 的转换。

硬性规则：

- `elProps` 只能补充能力，不能覆盖 Vision 主 API。
- 关键视觉、尺寸、状态、交互 props 必须在 `...elProps` 之后写入。
- 开发环境中，对被忽略的冲突项给出 warning。
- adapter 不写样式逻辑；样式只通过 root class、token、局部 CSS 变量控制。

参考结构：

```ts
export function resolveElementButtonProps(props: VisButtonProps) {
  const elProps = props.elProps ?? {}

  return {
    ...elProps,
    type: mapVariantToElementType(props.variant),
    size: mapVisionSizeToElementSize(props.size),
    disabled: props.disabled || props.loading,
    nativeType: props.nativeType ?? elProps.nativeType,
  }
}
```

冲突示例：

```vue
<VisButton variant="primary" :el-props="{ type: 'danger' }" />
```

结果必须以 `variant="primary"` 为准，`elProps.type` 不生效。

### 6. Token 与样式规则

- 旧项目已有 token：优先保留 token 名称；允许改为 primitive alias，但解析后的值必须与旧项目一致。
- Element Plus 变量：必须由 `src/styles/element-plus.css` 统一映射，不在组件内零散覆盖。
- 组件样式：必须以 `.vis-*` root class 限定作用域，不污染原生 `.el-*` 全局表现。
- 禁止残留旧项目前缀：`Leo`、`leo-`、`--leo-*`、`ds-*`。
- 禁止将应为 token 的值写成固定值，除非该值是组件私有常量且在文档中说明。

### 7. 迁移算法

迁移每个 `leoht-design` 组件时按以下顺序执行。

1. 读取旧组件源码、样式、类型、文档、示例，确认真实 API 与视觉状态。
2. 判断实现路线：Element Plus wrapper、Hybrid、清洁迁移、自研。
3. 定义 Vision Stable API，并列出需要保留的旧 API 兼容项。
4. 建立 adapter，集中处理 Element Plus props/events/slots 映射与冲突治理。
5. 建立组件样式，所有视觉状态映射到 Vision token 或组件局部 `--vis-*` 变量。
6. 更新导出、按需入口、demo 单页、API 对照表。
7. 运行构建与迁移审计，修复 token、变量、前缀、导出缺口。

### 8. 组件分类建议

| 类型 | 默认策略 | 示例 |
| --- | --- | --- |
| 基础表单 | Element Plus wrapper | Input、InputNumber、Checkbox、Radio、Switch |
| 复杂选择器 | Element Plus wrapper + popper class | Select、DatePicker、TimePicker |
| 浮层 | Element Plus wrapper + Vision shell | Modal、Drawer、Popover、Tooltip |
| 数据组件 | Element Plus wrapper，严格控制 slots | Table、Tree、Pagination |
| 图标与内容渲染 | 清洁迁移或自研 | Icon、FeaturedIcon、Markdown、RichTextEditor |
| 视觉小组件 | 按 DOM 可控性判断 | Avatar、Badge、Tag、Divider |

### 9. 文档要求

每个组件文档必须包含 API 对照表。

| 能力 | Vision API | Element Plus API | 处理方式 | 稳定级别 |
| --- | --- | --- | --- | --- |
| 视觉类型 | `variant` | `type/plain/text` | Vision 接管，adapter 映射 | stable |
| 尺寸 | `size` 或 `density` | `size` | adapter 映射 | stable |
| 状态 | `disabled/loading/status` | 对应底层 props | 行为复用，视觉由 Vision 控制 | stable |
| 原生行为 | `nativeType` 等 | 对应底层 props | 显式透出 | stable |
| 高级配置 | `elProps` 等 | 多个底层 props | 逃生口 | passthrough |
| 视觉破坏项 | 默认不开放 | `color/plain/text/bg` 等 | Vision 接管或禁止 | internal |

文档还必须写清：

- 是否基于 Element Plus。
- 哪些 API 是 Vision 主 API。
- 哪些能力为 passthrough。
- 哪些 Element Plus props 被 Vision 接管或忽略。
- 支持哪些 slots，哪些 slots 不建议使用。

### 10. 批量迁移顺序

| Phase | 目标 | 组件 |
| --- | --- | --- |
| 1 | 建立 token、基础视觉、基础行为基线 | Button、Input、Modal、Icon、FeaturedIcon、Markdown |
| 2 | 跑通表单、v-model、校验、disabled、clearable | InputTextarea、InputNumber、Checkbox、Radio、Switch、Select、DatePicker、TimePicker |
| 3 | 统一浮层、导航、z-index、focus trap、键盘行为 | Tooltip、Popover、Dropdown、Drawer、Tabs、Pagination、Menu、Breadcrumb、Steps |
| 4 | 验证复杂 slot、空状态、异步数据、滚动与性能 | Table、Tree、Avatar、Badge、Tag、Notification、Message、PageHeader、RichTextEditor、CodeBlock |

### 11. 完成标准

一个组件只有同时满足以下条件，才视为迁移完成。

1. Vision 主 API 已定义，且没有直接照搬 Element Plus 全量 props。
2. `*.adapter.ts` 已覆盖 Vision props 到 Element Plus props/events/slots 的映射。
3. 冲突项遵循 Vision 优先。
4. 视觉状态全部使用 Vision token 或组件局部 `--vis-*` 变量。
5. 无旧项目前缀残留：`Leo`、`leo-`、`--leo-*`、`ds-*`。
6. 文档页为单组件页，并包含 API 对照表、状态示例、底层实现说明。
7. `npm run build` 通过。
8. 迁移审计脚本通过：

```bash
node skills/leoht-component-migrator/scripts/audit-leoht-migration.mjs \
  --old /Users/leiwang/Documents/Project/DesignSystem/leoht-design \
  --new .
```

### 12. 当前项目落点

当前项目已建立以下执行基础：

- `src/styles/tokens.css`：Vision token 源。
- `src/styles/element-plus.css`：Element Plus 变量映射层。
- `src/components/*/*.adapter.ts`：Vision API 到 Element Plus API 的转换层。
- `src/components/*/*.css`：以 `.vis-*` root class 限定的组件样式层。
- `skills/leoht-component-migrator`：后续批量迁移的可复用 skill 与审计脚本。

后续所有组件迁移默认按“兼容增强模式”执行。只有当 Element Plus DOM 无法稳定承载设计稿，或组件价值不在 Element Plus 行为本身时，才切换为 Hybrid、清洁迁移或自研。
