# VisionDesignSystem 实施提示文件

> 用途：把本文件作为提示词交给新的 AI 线程或实现代理，用于启动一个全新的 Vision Design System 项目。  
> 重要：这是实施提示，不是普通说明文档。执行时应严格遵守其中的硬性约束。

## 你的任务

你要从零开始创建一套新的 Vue 3 组件库，项目名称为 `VisionDesignSystem`。

这套组件库基于 Element Plus 做二次封装，但视觉样式、组件命名、设计 token、交互状态和文档风格要延续旧项目中的 Vision Design System 方案。

最终目标：

1. 复用 Element Plus 的成熟能力：表单、浮层、选择器、无障碍、键盘交互、校验、Teleport、滚动锁定等。
2. 对外暴露 Vision Design System 自己的组件 API，而不是直接暴露 Element Plus 原生 API。
3. 组件视觉要使用 Vision token 和已有设计规范。
4. 新项目必须和旧项目完全隔离，不能在旧项目内直接重构。

## 硬性约束

### 1. 新旧项目完全隔离

不要在旧项目中直接重做组件。

旧项目只允许作为参考来源：

- 读取旧组件 API。
- 读取旧样式 token。
- 读取旧组件视觉实现。
- 读取旧文档结构。
- 复制必要的设计资源时必须重新整理到新项目内。

新项目必须是一个独立项目，命名为：

```text
VisionDesignSystem
```

推荐目录：

```text
/Users/leiwang/Documents/Project/VisionDesignSystem
```

如果当前运行环境没有该目录写权限，需要先向用户确认新的可写位置，不要把新项目混进旧项目源码目录中。

### 2. 项目命名规则

旧项目命名可能出现：

- `leohtDesignSystem`
- `LeohtDesignSystem`
- `leoht-design`
- `Leoht Design`
- `Leoht`
- `Leo`

新项目必须统一改为：

| 旧命名 | 新命名 |
| --- | --- |
| `leohtDesignSystem` | `VisionDesignSystem` |
| `LeohtDesignSystem` | `VisionDesignSystem` |
| `leoht-design` | `vision-design-system` 或 `vision-design`，优先使用 `vision-design-system` |
| `Leoht Design` | `Vision Design` |
| `Leoht` | `Vision` |
| `Leo` 组件前缀 | `vis` |

### 3. 组件前缀规则

组件前缀统一为 `vis-`。

为了兼顾 Vue 组件命名、导出命名和 CSS 命名，采用以下规范：

| 场景 | 命名 |
| --- | --- |
| 文件名 | `vis-button.vue` 或 `VisButton.vue`，项目初期二选一后全局统一 |
| 组件导出名 | `VisButton` |
| 模板标签 | `<vis-button />` |
| CSS class | `.vis-button` |
| CSS 变量 | `--vis-button-*` |
| package name | `vision-design-system` |
| namespace | `vis` 或 `vis-el` |

不要再使用：

- `LeoButton`
- `leo-button`
- `leoht-*`
- `leo-*`
- `ds-*`

如遇到用户说“组件前缀名为 -vis”，按当前上下文理解为 `vis-` 前缀；如果需要改变为后缀形式，必须先向用户确认。

### 4. 不直接修改 Element Plus 源码

只能通过 wrapper、adapter、CSS variables、SCSS variables、slot 替换和局部样式覆盖实现 Vision 样式。

不要 fork Element Plus。

### 5. Vision API 优先

对外 API 必须先匹配 Vision Design System，而不是 Element Plus。

Element Plus 的能力可以按需透传，但不能让 Element Plus API 反过来决定 Vision API。

## 当前旧项目背景

旧项目是一个 Vue 3 + Vite 组件库，包含：

- `src/components/*`
- `src/styles/tokens.css`
- `src/tokens/index.js`
- 文档演示页
- 组件级导出
- 设计 token
- 自研 icon 体系
- 大量已实现组件

旧项目可作为参考，但新项目不能直接在旧目录里改造。

参考文档：

```text
docs/element-plus-wrapper-technical-plan.md
```

在实施前，请先完整阅读该方案文档。

## 推荐技术路线

采用：

```text
Vision Public API
  ↓
Vision Wrapper Components
  ↓
Element Plus Adapter
  ↓
Element Plus Components
  ↓
Vision Tokens + Theme Overrides
```

也就是：

- 对外使用 `VisButton`、`VisInput`、`VisModal` 等 Vision 组件。
- 内部使用 `ElButton`、`ElInput`、`ElDialog` 等 Element Plus 组件。
- 通过 adapter 把 Vision props 映射成 Element Plus props。
- 通过 Vision token 覆盖 Element Plus CSS variables。
- 通过局部 class 补齐设计稿差异。

## 项目初始化要求

### 技术栈

使用：

- Vue 3
- TypeScript
- Vite
- Element Plus
- Sass
- vue-tsc

推荐后续补充：

- Vitest
- Vue Test Utils
- Playwright

### package 建议

`package.json` 中：

```json
{
  "name": "vision-design-system",
  "type": "module",
  "peerDependencies": {
    "vue": "^3.5.0",
    "element-plus": "^2.14.0"
  },
  "dependencies": {},
  "devDependencies": {
    "vue": "^3.5.0",
    "element-plus": "^2.14.0",
    "sass": "^1.90.0",
    "typescript": "^6.0.0",
    "vite": "^8.0.0",
    "vue-tsc": "^3.0.0"
  }
}
```

注意：

- `element-plus` 应作为 peer dependency。
- 构建组件库时不要把 `vue` 和 `element-plus` 打进产物。
- 如果实际安装时版本不同，以当前可安装的稳定版本为准。

## 目录结构建议

新项目建议结构：

```text
VisionDesignSystem/
  package.json
  tsconfig.json
  vite.config.ts
  vite.lib.config.ts
  src/
    index.ts
    styles/
      tokens.css
      element-plus.css
      theme.css
    components/
      config-provider/
        VisConfigProvider.vue
        index.ts
      button/
        VisButton.vue
        button.adapter.ts
        button.types.ts
        button.css
        index.ts
      input/
        VisInput.vue
        input.adapter.ts
        input.types.ts
        input.css
        index.ts
      modal/
        VisModal.vue
        modal.adapter.ts
        modal.types.ts
        modal.css
        index.ts
    docs/
      pages/
```

如果选择 kebab-case 文件名，也可以统一为：

```text
vis-button.vue
vis-config-provider.vue
```

但必须全项目一致。

## 第一阶段目标

第一阶段只做 MVP，不要一次性重做全部组件。

必须完成：

1. 新建独立项目 `VisionDesignSystem`。
2. 接入 Vue 3 + Vite + TypeScript。
3. 安装并配置 Element Plus。
4. 新增 `VisConfigProvider`。
5. 新增 Vision token 文件。
6. 新增 Element Plus 变量映射文件。
7. 重做 3 个基准组件：
   - `VisButton`
   - `VisInput`
   - `VisModal`
8. 建立文档演示页面。
9. 跑通文档构建和组件库构建。
10. 检查产物中 `element-plus` 是否 external。

## API 处理策略

### 核心原则

Vision API 和 Element Plus API 不必完全一致。

你要把 API 分为四层：

| 层级 | 处理方式 |
| --- | --- |
| Vision 核心 API | 正式公开，长期维护 |
| Vision 增强 API | Element Plus 没有，但 Vision 需要，由 wrapper 实现 |
| Element Plus 常用 API | 显式挑选后透出 |
| Element Plus 高级 API | 放入 `elProps` 或 `$attrs` 作为逃生口 |

### Button 示例

不要直接把 Element Plus 的 `type / plain / text / link / round / circle / color` 全部暴露给用户。

Vision Button 应优先定义：

```ts
export type VisButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'linkColor'
  | 'linkGrey'

export type VisButtonSize = 'sm' | 'md' | 'lg'
```

Element Plus 缺失的能力由 wrapper 实现：

- `linkColor`
- `linkGrey`
- Vision loading 图形
- Vision icon 尺寸和 stroke 规则
- Vision focus / hover / pressing 样式

Element Plus 多出的能力不要默认补齐：

- `plain`
- `round`
- `circle`
- `text`
- `bg`
- `color`

如果确实需要高级能力，使用：

```ts
elProps?: Partial<ButtonProps>
```

属性冲突时 Vision props 优先。

示例：

```vue
<vis-button variant="primary" :el-props="{ type: 'danger' }" />
```

最终必须按 `variant="primary"` 渲染。

## 样式策略

### 1. token 来源

Vision token 是唯一视觉来源。

不要让 Element Plus 的主题变量成为设计系统源头。

映射链路：

```text
Figma variables / 旧项目 tokens
  ↓
src/styles/tokens.css
  ↓
src/styles/element-plus.css
  ↓
Element Plus CSS variables
  ↓
Vision wrapper styles
```

### 2. Element Plus 变量映射

创建：

```text
src/styles/element-plus.css
```

示例：

```css
:root,
.vision-theme {
  --el-color-primary: var(--color-fg-brand-primary);
  --el-color-success: var(--color-fg-success-primary);
  --el-color-warning: var(--color-fg-warning-primary);
  --el-color-danger: var(--color-fg-danger-primary);
  --el-color-error: var(--color-fg-danger-primary);
  --el-text-color-primary: var(--color-text-primary);
  --el-text-color-regular: var(--color-text-secondary);
  --el-border-color: var(--color-border-primary);
  --el-border-radius-base: var(--radius-sm);
}
```

### 3. 组件局部样式

不要写全局裸选择器：

```css
/* 禁止 */
.el-button {}
```

应该写：

```css
/* 推荐 */
.vis-button.el-button {}
```

或者在 namespace 下写：

```css
.vis-el-button.vis-button {}
```

### 4. 暗色模式

暗色模式必须由 Vision token 控制。

不要同时完全启用 Element Plus 自带 dark theme 和 Vision dark token，避免变量冲突。

## ConfigProvider 要求

必须提供：

```vue
<vis-config-provider>
  <App />
</vis-config-provider>
```

内部可以基于：

```vue
<ElConfigProvider namespace="vis-el">
  <slot />
</ElConfigProvider>
```

`VisConfigProvider` 至少考虑：

- `namespace`
- `zIndex`
- `locale`
- `theme`
- `teleportTo`

## 图标策略

不要直接使用 Element Plus Icons 作为默认图标库。

如果旧项目已有 Vision 图标体系：

- 优先迁移或重建 Vision `Icon` 组件。
- 继续保留 icon 尺寸和 stroke width 的固定映射规则。
- Element Plus 内部 icon 尽量通过 slot 替换。

## 构建要求

组件库构建必须：

- 输出 ESM。
- 支持全量导入。
- 支持按需导入。
- 输出类型文件。
- 输出统一样式文件。
- external `vue` 和 `element-plus`。

`vite.lib.config.ts` 中需要类似：

```ts
rollupOptions: {
  external: ['vue', 'element-plus'],
}
```

## 验收命令

每完成一个阶段，至少运行：

```bash
npm run typecheck
npm run build
```

如果存在 library 构建：

```bash
npm run build:lib
```

如果有文档站：

```bash
npm run build:docs
```

## 文档要求

每个组件文档页至少包含：

- 组件用途说明。
- 基础用法。
- 不同尺寸。
- 不同状态。
- API 表。
- Vision API 和 Element Plus API 对照表。
- 是否支持 `elProps`。
- 是否支持 `$attrs`。
- 样式 token 说明。

文档中不要把 Element Plus API 放在第一层主叙述里。主叙述必须是 Vision API。

## 任务实施步骤

### Step 1：准备

1. 确认新项目目录。
2. 创建 `VisionDesignSystem`。
3. 初始化 Vue 3 + TypeScript + Vite。
4. 安装 Element Plus 和 Sass。
5. 配置基础脚本：
   - `dev`
   - `typecheck`
   - `build`
   - `build:lib`
   - `build:docs`

### Step 2：基础工程

1. 建立 `src/index.ts`。
2. 建立 `src/styles/tokens.css`。
3. 建立 `src/styles/element-plus.css`。
4. 建立 `src/styles/theme.css`。
5. 配置 library build。
6. external `vue` 和 `element-plus`。

### Step 3：ConfigProvider

1. 创建 `VisConfigProvider`。
2. 内部封装 `ElConfigProvider`。
3. 设置 namespace 为 `vis-el`。
4. 支持 z-index 和 locale。
5. 文档站入口包裹 `VisConfigProvider`。

### Step 4：VisButton

1. 设计 `VisButton` API。
2. 创建 adapter。
3. 内部使用 `ElButton`。
4. 实现 Vision variant。
5. 实现 Vision size。
6. 替换 loading 图形。
7. 替换 icon。
8. 支持 `elProps`。
9. 属性冲突时 Vision 优先。
10. 建立文档页。

### Step 5：VisInput

1. 内部使用 `ElInput`。
2. API 以 Vision 为主。
3. 实现 clear、prefix、suffix、addon、danger、disabled、readview 等状态。
4. 检查 focus 时点击前后缀不丢失状态。
5. 建立文档页。

### Step 6：VisModal

1. 内部使用 `ElDialog`。
2. 保持 Vision modal / confirm 视觉。
3. 处理 header、footer、actions、close button、featured icon。
4. 检查 teleport、z-index、ESC、点击遮罩、focus trap。
5. 建立文档页。

### Step 7：构建和检查

1. 跑 `typecheck`。
2. 跑 docs build。
3. 跑 lib build。
4. 检查 dist 是否包含 Element Plus 大包。
5. 检查样式导入顺序。
6. 检查按需导入是否可用。

## 禁止事项

不要做这些事：

- 不要在旧项目中直接覆盖原组件。
- 不要把旧项目改名后当成新项目。
- 不要直接修改 Element Plus 源码。
- 不要把 Element Plus 全量 API 原样暴露成 Vision API。
- 不要让 Element Plus 默认样式覆盖 Vision token。
- 不要混用 `Leo`、`Leoht`、`leo-`、`leoht-` 命名。
- 不要引入 Element Plus Icons 作为默认图标。
- 不要一次性重写所有组件。

## 完成第一阶段后的输出

完成 MVP 后，需要向用户汇报：

1. 新项目创建路径。
2. 已安装依赖。
3. 已完成的组件。
4. API 差异处理方式。
5. 样式 token 接入方式。
6. 构建验证结果。
7. 尚未完成的风险和下一步建议。

