# Leoht Design API 语义字典表

来源项目：`/Users/leiwang/Documents/Project/LeohtDesign/leoht-design`

目标项目：`/Users/leiwang/Documents/Project/VisionDesignSystem`

本文用于指导 AI 将 `leoht-design` 组件迁移为 Vision Design System 的二次封装组件。每个组件独立一张表，表内字段含义如下：

| 字段 | 说明 |
| --- | --- |
| API 名 | Vision 对外语义 API，作为新组件主 API。 |
| 旧 API | `leoht-design` 中对应的旧 props / events / slots。 |
| Element Plus API | 建议映射到的 Element Plus API；自研组件写 `自研` 或 `DOM`。 |
| 说明 | 迁移规则、兼容策略、冲突处理。 |
| 类型 | Vision API 推荐类型。 |
| 默认值 | 旧组件默认值或 Vision 推荐默认值。 |

## 全局约定

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | `type` | 当旧 API 与 Element Plus API 都叫 `type` 时，Vision API 也保留 `type`，避免 Figma、旧代码、adapter 三边重复映射。 | `string` | 视组件而定 |
| `variant` | `type` | class / 自研结构 | 只有当旧 `type` 不直接映射 Element Plus `type`，或表示纯视觉结构时，才改为 `variant`。 | `string` | 视组件而定 |
| `status` | `state` / `danger` / 非 Element `type` | `validate-state` / class | 信息等级与校验状态统一用 `status`。旧 `error` 统一映射为 `danger`。 | `'default' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| `tone` | `color` / `colorType` | class / CSS var | 意图色统一用 `tone`。旧 `grey` 映射为 `neutral`。 | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'danger'` | `'brand'` |
| `visualState` | `state` | class | 只用于 demo 和视觉回归；真实交互由 `disabled`、`loading`、`:hover`、`:focus-visible` 驱动。 | `string` | `'default'` |
| `readonlyView` | `readView` / `readview` | `readonly` + wrapper view | 统一命名为 `readonlyView`，旧拼写作为 deprecated alias。 | `boolean` | `false` |
| `icon` | `iconName` | icon slot / prefix icon | 图标名称统一为 `icon`，类型继续复用 `IconName`。 | `IconName` | 视组件而定 |
| `nativeType` | `htmlType` | `native-type` | 原生 button type 统一为 `nativeType`。 | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `closable` | `closeable` | `show-close` / close icon | 统一拼写为 `closable`。 | `boolean` | 视组件而定 |
| `elProps` | 无 | 对应 Element Plus 组件 props | 逃生口。Vision 主 API 与 `elProps` 冲突时，Vision 优先。 | `Record<string, unknown>` | `{}` |

## Accordion

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `items` | `items` | `ElCollapseItem` data | 数据化渲染折叠项；也保留 `VisAccordionItem` 子组件模式。 | `VisAccordionItemData[]` | `[]` |
| `modelValue` | `modelValue` | `model-value` | 受控展开项。旧组件只支持单值，迁移时可扩展为单值/数组。 | `string \| number \| Array<string \| number> \| null` | `undefined` |
| `defaultValue` | `defaultValue` | `model-value` initial | 非受控初始展开项。 | `string \| number \| null` | `null` |
| `multiple` | 无 | `accordion` 反向映射 | Vision 用正向语义；`multiple=false` 映射 Element Plus `accordion=true`。 | `boolean` | `false` |
| `borderless` | `borderless` | class | 视觉样式由 Vision class 控制。 | `boolean` | `false` |
| `showIcon` | `icon` | title slot | 旧 `icon` 改为更清晰的 `showIcon`。 | `boolean` | `true` |
| `disabled` | item `disabled` | `disabled` | 单项禁用。 | `boolean` | `false` |
| `title` | item `title` | `title` / slot | 子项标题。 | `string` | `'折叠面板'` |
| `update:modelValue` | `update:modelValue` | `change` | 统一 Vue 受控事件。 | event | - |
| `toggle` | `toggle` | `change` | 保留旧语义事件，payload 应含 key 和 expanded。 | event | - |

## Alert

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | `type` | 旧 API 与 Element Plus API 均为 `type`，因此 Vision 继续使用 `type`；`danger` 在 adapter 内映射为 Element Plus `error` 或 Vision danger class。 | `'info' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| `title` | `title` | `title` | 主标题。未传时可沿用旧默认标题 map。 | `string` | `undefined` |
| `description` | `descriptionText` | `description` | 描述文本。旧 `description` 布尔改为 `showDescription`。 | `string` | `'这里是提示的描述内容'` |
| `showDescription` | `description` | class / description slot | 控制是否显示描述区域。 | `boolean` | `false` |
| `showActions` | `actions` | action slot | 控制默认操作按钮；推荐用 `actions` slot。 | `boolean` | `true` |
| `closable` | `closeable` | `closable` | 统一拼写。 | `boolean` | `true` |
| `detailLabel` | `detailLabel` | action slot | 默认详情按钮文案。 | `string` | `'查看详情'` |
| `ignoreLabel` | `ignoreLabel` | action slot | 默认忽略按钮文案。 | `string` | `'忽略'` |
| `close` | `close` | `close` | 关闭事件。 | event | - |
| `ignore` / `detail` | `ignore` / `detail` | action handlers | 保留旧动作语义。 | event | - |

## Avatar

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `variant` | `type` | 自研 | `image/icon/text` 仍可保留，但 Vision 推荐叫 `variant`。 | `'image' \| 'icon' \| 'text'` | `'image'` |
| `size` | `size` | `size` / class | Avatar 视觉尺寸自研，不直接使用 Element Plus 默认尺寸。 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'sm'` |
| `visualState` | `state` | class | 仅用于 hover 视觉态演示。 | `'default' \| 'hover'` | `'default'` |
| `shape` | `shapeSquare` / group `shape` | `shape` | 统一为 `circle/square`。 | `'circle' \| 'square'` | `'circle'` |
| `src` | `imageSrc` | `src` | 图片地址。 | `string` | `undefined` |
| `imageVariant` | `imageVariant` / `avatarImageVariant` | 自研 demo asset | 旧内置头像资源兼容项，不作为核心 API 推荐。 | `LeoAvatarImageVariant` | `'09'` |
| `alt` | `imageAlt` / `avatarImageAlt` | `alt` | 图片替代文本。 | `string` | `undefined` |
| `name` | `text` / label `title` | 自研 | 文本头像或 AvatarLabel 主标题。 | `string` | `'诸葛'` |
| `description` | label `subtitle` | 自研 | AvatarLabel 副标题。 | `string` | `'zhangdashan'` |
| `icon` | `icon` / `avatarIcon` | icon slot | 图标头像。 | `IconName` | `'user-03'` |
| `badge` | `badge` | 自研 / Badge | 头像角标类型。 | `'none' \| 'dot' \| 'icon' \| 'number' \| 'state'` | `'none'` |
| `badgeTone` | `badgeColorType` | Badge tone | 角标颜色语义。 | `VisTone` | `'danger'` |
| `items` | group `items` | 自研 | AvatarGroup 成员。 | `VisAvatarGroupItem[]` | `[]` |

## Badge

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `tone` | `colorType` | class / CSS var | 颜色语义统一为 `tone`。 | `VisTone` | `'danger'` |
| `variant` | `type` / `solid` / `subtle` | class | `type` 代表形态；`solid/subtle` 合并进 `variant`。 | `'status' \| 'number' \| 'icon' \| 'solid' \| 'subtle'` | `'status'` |
| `label` | `label` | 自研 | 文本内容。 | `string` | `undefined` |
| `count` | `count` | `value` | 数字角标。 | `string \| number` | `undefined` |
| `icon` | `iconName` | icon slot | 图标角标。 | `IconName` | `undefined` |
| `icon` slot | `icon` slot | slot | 自定义图标。 | slot | - |

## Breadcrumb

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `items` | `items` | `ElBreadcrumbItem` | 面包屑数据。 | `VisBreadcrumbItem[]` | demo items |
| `variant` | `type` | class / item render | 旧 `button/link` 语义改为形态。 | `'button' \| 'link'` | `'button'` |
| `size` | `size` | class | Vision 控制字号和间距。 | `'sm' \| 'md'` | `'md'` |
| `separator` | `separator` | `separator` / `separator-icon` | `slash` 映射文本分隔符，`arrow` 映射图标分隔符。 | `'slash' \| 'arrow'` | `'slash'` |
| `activeKey` | item active | `aria-current` | 推荐通过 item key 标识当前页。 | `string \| number` | 最后一项 |
| `itemClick` | item click | item click | 点击事件 payload 返回 item 和 index。 | event | - |

## Button

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `variant` | `variant` | `type` / class | `primary/secondary/text/link-*` 映射 Element Plus type 与 Vision class。 | `VisButtonVariant` | `'primary'` |
| `tone` | `danger` | `type="danger"` / class | 旧 `danger=true` 改为 `tone="danger"`。 | `VisButtonTone` | `'brand'` |
| `size` | `size` | `size` | `sm/md/lg` 映射 `small/default/large`。 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `visualState` | `state` | class | 仅用于视觉演示；真实状态由交互驱动。 | `VisButtonVisualState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用原生点击。 | `boolean` | `false` |
| `loading` | `loading` | `loading` | loading 时禁用点击，可替换 loading slot。 | `boolean` | `false` |
| `iconOnly` | `iconOnly` | class / aria-label | icon-only 必须有可访问名称。 | `boolean` | `false` |
| `prefixIcon` | `prefix` + `iconName` | icon slot | 旧布尔 `prefix` 降级为兼容项，主 API 直接传图标。 | `IconName` | `'plus'` |
| `suffixIcon` | `suffix` + `suffixIconName` | icon slot | 后置图标。 | `IconName` | `'chevron-down'` |
| `label` | `label` | default slot | 按钮文本，也作为 icon-only aria-label fallback。 | `string` | `undefined` |
| `nativeType` | `htmlType` | `native-type` | 原生按钮类型。 | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `elProps` | 无 | `ElButton` props | 逃生口；`type/size/loading/disabled` 冲突时 Vision 优先。 | `Partial<ButtonProps>` | `{}` |

## Checkbox

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 单个 checkbox 选中值；group 为数组。 | `boolean \| VisCheckboxValue[]` | `false` / `[]` |
| `indeterminate` | `indeterminate` | `indeterminate` | 半选状态。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `visualState` | `state` | class | hover 演示态。 | `'default' \| 'hover'` | `'default'` |
| `showLabel` | `label` | default slot visibility | 旧 `label` 是布尔，Vision 改为 `showLabel`。 | `boolean` | `true` |
| `value` | `value` | `value` | 表单提交值或 group option value。 | `string \| number \| boolean` | `undefined` |
| `options` | group `options` | `ElCheckboxGroup` options | group 数据。 | `VisCheckboxOption[]` | `[]` |
| `direction` | group `align` | class | `horizontal/vertical` 布局。 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `name` | `name` | `name` | 原生 name。 | `string` | `undefined` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 无 label 时必须提供或自动兜底。 | `string` | `undefined` |
| `change` | `change` | `change` | payload 保留 checked、indeterminate、value。 | event | - |

## CodeBlock

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `variant` | `type` | 自研 | 代码块视觉形态。 | `VisCodeBlockVariant` | `'default'` |
| `collapsed` | `collapsed` | 自研 | 是否折叠。 | `boolean` | `false` |
| `showHeader` | `heading` | 自研 | 旧 `heading` 改成更清晰的 `showHeader`。 | `boolean` | `false` |
| `copyable` | `copy` | 自研 | 是否显示复制按钮。 | `boolean` | `true` |
| `language` | `language` | 自研 | 语言标签。 | `string` | `'Javascript'` |
| `code` | `code` | 自研 | 代码内容。 | `string` | `''` |
| `copy` | 无 | 自研 | 复制事件，可新增。 | event | - |

## DatePicker

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 日期值，range 时为元组。 | `Date \| string \| [Date \| string, Date \| string] \| null` | `null` |
| `range` | `range` | `type="daterange"` | 是否范围选择。 | `boolean` | `false` |
| `readonlyView` | `readView` | `readonly` + wrapper | 只读展示态。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `status` | `state` | class / validate state | `error` 映射为 `danger`。 | `VisFieldStatus` | `'default'` |
| `placeholder` | `placeholder` | `placeholder` | 单日期占位。 | `string` | `'请选择日期'` |
| `startPlaceholder` | `startPlaceholder` | `start-placeholder` | 范围开始占位。 | `string` | `'选择开始日期'` |
| `endPlaceholder` | `endPlaceholder` | `end-placeholder` | 范围结束占位。 | `string` | `'选择结束日期'` |
| `open` | `open` | `visible` / controlled popper | 受控打开状态。 | `boolean` | `undefined` |
| `prefixIcon` | `prefix` + `prefixIcon` | `prefix-icon` | 旧 `prefix` 改为是否显示 prefix icon。 | `IconName` | `'calendar'` |
| `showFooterShortcuts` | `showFooterShortcuts` | shortcuts slot | 是否显示快捷项。 | `boolean` | `true` |
| `shortcuts` | `shortcuts` | `shortcuts` | 快捷日期。 | `Array<{ label: string; days: number }>` | demo shortcuts |
| `disabledDate` | `disabledDate` | `disabled-date` | 禁用日期函数。 | `(date: Date) => boolean` | `undefined` |
| `change` / `update:open` | 同名 | `change` / visible change | 事件保持。 | event | - |

## Divider

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `orientation` | `orientation` | `direction` | 水平/垂直。 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `dashed` | `dashed` | `border-style` class | 虚线样式。 | `boolean` | `false` |
| `length` | `length` | style | 自定义长度。 | `number \| string` | `undefined` |
| `decorative` | `decorative` | `role` | `false` 时输出 separator 语义。 | `boolean` | `true` |

## Drawer

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 抽屉开关。 | `boolean` | `true` |
| `title` | `title` | `title` / header slot | 标题。 | `string` | `'对话框标题'` |
| `placement` | `position` | `direction` | `right/bottom` 映射 Element Plus direction。 | `'right' \| 'bottom'` | `'right'` |
| `divided` | `divider` | class | 是否显示分割线。 | `boolean` | `true` |
| `showActions` | `actions` | footer slot | 是否显示默认 footer actions。 | `boolean` | `true` |
| `icon` | `icon` + `iconName` | header slot | 旧布尔 + 图标名改为直接传图标。 | `IconName \| false` | `false` |
| `showBack` | `twoLevel` | header slot | 二级抽屉返回按钮。 | `boolean` | `false` |
| `closable` | `closeable` | `show-close` | 关闭按钮。 | `boolean` | `true` |
| `showHandle` | `handle` | class / handle node | bottom drawer 拖拽视觉 handle。 | `boolean` | `true` |
| `width` | `width` | `size` | right drawer 宽度。 | `number \| string` | `undefined` |
| `height` | `height` | `size` | bottom drawer 高度。 | `number \| string` | `undefined` |
| `cancelText` / `confirmText` / `backText` | 同名 | footer/header slot | 默认按钮文案。 | `string` | `'按钮'` / `'返回'` |
| `close` / `cancel` / `confirm` / `back` | 同名 | close / footer handlers | 事件保持。 | event | - |

## Dropdown

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `items` | `items` | `ElDropdownItem` data | 菜单项数据，支持 item/divider/header/avatar。 | `VisDropdownEntry[]` | `undefined` |
| `open` | `open` | `visible` / `trigger` control | 受控打开状态。 | `boolean` | `false` |
| `trigger` | `trigger` | `trigger` | `button` 作为 Vision 自带触发器，其余映射 Element Plus trigger。 | `'button' \| 'click' \| 'hover' \| 'contextmenu'` | `'button'` |
| `header` | `header` | dropdown header slot | 是否显示头部。 | `boolean` | `false` |
| `headerType` | `headerType` | header render | 头部类型。 | `'group' \| 'avatar'` | `'group'` |
| `buttonLabel` | `buttonLabel` | trigger slot | 默认按钮触发器文案。 | `string` | `'触发'` |
| `searchValue` | `searchValue` | 自研 input | 搜索值。 | `string` | `''` |
| `searchPlaceholder` | `searchPlaceholder` | input placeholder | 搜索占位。 | `string` | `'请输入关键字'` |
| `label` | item/header `label` | item text | 菜单项/分组名。 | `string` | `'菜单选项'` |
| `active` | item `active` | selected class | 选中态。 | `boolean` | `false` |
| `checkable` | item `checkable` | `aria-checked` | 可勾选菜单项。 | `boolean` | `false` |
| `disabled` | item `disabled` | `disabled` | 禁用菜单项。 | `boolean` | `false` |
| `icon` | item `iconName` | icon slot | 菜单项图标。 | `IconName` | `'settings-01'` |
| `select` | `select` | `command` | 选择事件。 | event | - |

## FeaturedIcon

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `size` | `size` | 自研 | 特征图标尺寸。 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'xs'` |
| `tone` | `color` | CSS var | 颜色语义。旧 `grey` 映射 `neutral`。 | `VisTone` | `'brand'` |
| `variant` | `type` | class | 视觉容器形态。 | `VisFeaturedIconVariant` | `'solid-round'` |
| `icon` | `icon` | icon slot | 图标名称。 | `IconName` | `'download-cloud-02'` |
| `label` | `label` | `aria-label` | 非 decorative 时作为可访问名称。 | `string` | `undefined` |
| `decorative` | `decorative` | `aria-hidden` | 装饰性图标。 | `boolean` | `true` |

## Icon

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `name` | `name` | 自研 SVG registry | 图标名。此 API 是产品 API，不改为 `VisIcon` 前缀。 | `IconName` | 必填 |
| `size` | `size` | style | 图标尺寸。 | `number \| string` | `16` |
| `strokeWidth` | `strokeWidth` | SVG attr | 线宽。 | `number \| string` | SVG 默认 |
| `label` | `label` | `aria-label` | 非 decorative 时的可访问名称。 | `string` | `undefined` |
| `decorative` | `decorative` | `aria-hidden` | 装饰性图标。 | `boolean` | `true` |

## Input

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 输入值。 | `string` | `undefined` |
| `placeholder` | `placeholder` | `placeholder` | 占位文案。 | `string` | `'请输入'` |
| `readonlyValue` | `valueText` | wrapper text | 只读展示文案。 | `string` | `'已输入内容'` |
| `status` | `state` | class / validate state | `error` 映射 `danger`。 | `VisFieldStatus` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `filled` | `filled` | class | 填充背景样式。 | `boolean` | `false` |
| `readonlyView` | `readView` | `readonly` + wrapper | 只读展示态。 | `boolean` | `false` |
| `prefixIcon` | `prefix` + `prefixIcon` | `prefix-icon` / slot | 旧 `prefix` 为显示开关。 | `IconName` | `'user-01'` |
| `suffixIcon` | `suffix` + `suffixIcon` | `suffix-icon` / slot | 后置图标。 | `IconName` | `'copy-03'` |
| `addonBefore` | `addonLeft` + `addonLeftText` | prepend slot | 前置 addon。 | `string \| slot` | `'http://'` |
| `addonAfter` | `addonRight` + `addonRightText` | append slot | 后置 addon。 | `string \| slot` | `'.com'` |
| `maxLength` | `maxLength` | `maxlength` / `show-word-limit` | `false` 表示不限制。 | `number \| false` | `false` |
| `type` | `type` | `type` | 原生 input 类型。 | `string` | `'text'` |
| `clear` / `focus` / `blur` | 同名 | `clear` / `focus` / `blur` | 事件保持。 | event | - |

## InputNumber

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 数字值。 | `number \| null` | `0` |
| `width` | `width` | style | 外层宽度。 | `number \| string` | `undefined` |
| `controlsPosition` | `position` / `rightControls` | `controls-position` | `rightControls=true` 映射右侧控制器。 | `'default' \| 'right'` | `'default'` |
| `status` | `state` | class | 字段状态。 | `VisFieldStatus` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `readonlyView` | `readView` / `readview` | readonly wrapper | 兼容两个旧拼写。 | `boolean` | `false` |
| `prefixIcon` | `prefixIcon` + `prefixIconName` | prefix slot | 图标前缀。 | `IconName \| false` | `'currency-yen'` |
| `suffixIcon` | `suffixIcon` + `suffixIconName` | suffix slot | 图标后缀。 | `IconName \| false` | `'percent-02'` |
| `min` / `max` / `step` | 同名 | `min` / `max` / `step` | 数值边界和步进。 | `number` | `undefined` / `1` |
| `focus` / `blur` | 同名 | `focus` / `blur` | 事件保持。 | event | - |

## InputSearchBox

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 搜索值。 | `string` | `undefined` |
| `placeholder` | `placeholder` | `placeholder` | 占位文案。 | `string` | `'请输入关键字'` |
| `readonlyValue` | `valueText` | wrapper text | 展示值。 | `string` | `'关键字'` |
| `filled` | `filled` | class | 填充样式。 | `boolean` | `false` |
| `showFilter` | `filter` | suffix button | 过滤按钮。 | `boolean` | `false` |
| `simple` | `simple` | class | 简洁样式。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `status` | `state` | class | 字段状态。 | `VisFieldStatus` | `'default'` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `undefined` |
| `clear` / `filter` / `focus` | 同名 | handlers | 事件保持。 | event | - |

## InputTextarea

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 文本值。 | `string` | `undefined` |
| `placeholder` | `placeholder` | `placeholder` | 占位文案。 | `string` | `'请输入文字'` |
| `readonlyValue` | `valueText` | wrapper text | 只读展示值。 | `string` | sample text |
| `status` | `state` | class | 字段状态。 | `VisFieldStatus` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `filled` | `filled` | class | 填充样式。 | `boolean` | `false` |
| `readonlyView` | `readView` | readonly wrapper | 只读展示态。 | `boolean` | `false` |
| `maxLength` | `maxLength` | `maxlength` / `show-word-limit` | `false` 表示不限制。 | `number \| false` | `false` |
| `name` / `ariaLabel` | 同名 | DOM attr | 原生属性。 | `string` | `undefined` |
| `focus` / `blur` | 同名 | `focus` / `blur` | 事件保持。 | event | - |

## Loading

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `size` | `size` | 自研 | spinner 尺寸。 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'xs'` |
| `tone` | `color` | CSS var | `brand/grey/white/danger` 统一映射为 tone。 | `VisLoadingTone` | `'brand'` |
| `showText` | `text` | 自研 | 是否显示文字。 | `boolean` | `false` |
| `label` | `label` | text / aria-label | loading 文案。 | `string` | `'loading...'` |
| `decorative` | `decorative` | `aria-hidden` | 装饰性 loading。 | `boolean` | `false` |

## Markdown

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `source` | default slot / markdown source | 自研 | Markdown 内容。旧组件支持 slot，迁移后建议显式 source，同时保留 slot fallback。 | `string` | `''` |
| `theme` | `LeoMarkdownTheme` | class | 明暗主题。 | `'light' \| 'dark'` | `'light'` |
| `streamStatus` | `LeoMarkdownStreamStatus` | class | 流式输出状态。 | `'loading' \| 'done'` | `'done'` |
| `incompleteType` | `LeoMarkdownIncompleteType` | parser option | 未完成 Markdown 类型。 | `string` | `undefined` |
| `components` | `LeoMarkdownComponentMap` | custom renderer | 自定义组件映射。 | `Record<string, Component \| string>` | `{}` |
| `sanitize` | 内部 DOMPurify | sanitizer | 安全策略必须默认开启。 | `boolean` | `true` |
| `default` slot | default slot | slot | 内容 fallback。 | slot | - |

## Menu

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `mode` | `mode` | `collapse` / class | 菜单展开模式。 | `'expanded' \| 'collapsed'` | `'expanded'` |
| `items` | `items` | `ElMenuItem` data | 菜单数据。 | `VisMenuItemConfig[]` | demo items |
| `activeId` | `activeId` | `default-active` | 当前激活项。 | `string` | `'dashboard'` |
| `search` | `search` | header slot | 是否显示搜索入口。 | `boolean` | `true` |
| `userCard` | `userCard` | footer slot | 是否显示用户卡片。 | `boolean` | `true` |
| `label` | group/item `label` | item title | 菜单组或项标题。 | `string` | `'菜单名称'` |
| `collapsed` | item `collapse` | `collapse` | item 接收折叠状态。 | `boolean` | `false` |
| `disabled` | item `disabled` | `disabled` | 禁用项。 | `boolean` | `false` |
| `icon` | item `icon` + `iconName` | item icon slot | 图标。 | `IconName \| false` | `'bar-chart-square-01'` |
| `open` | item `open` | `opened` / sub-menu | 子菜单展开态。 | `boolean` | `undefined` |
| `level` | item `subLevel` | class | 子级层级。 | `number` | `0` |
| `badgeCount` | `badgeCount` | badge slot | 尾部徽标。 | `string \| number` | `10` |
| `select` / `collapse` | 同名 | `select` / collapse button | 事件保持。 | event | - |

## Message

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | `type` | 旧 API 与 Element Plus API 均为 `type`，因此 Vision 继续使用 `type`；`danger` 在 adapter 内映射 Element Plus `error`。 | `'info' \| 'success' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| `text` | `text` | `message` | 提示内容。 | `string` | `'这里是提示内容'` |
| `modelValue` | `modelValue` | visible state | 组件式 message 可见性。 | `boolean` | `true` |
| `autoClose` | `autoClose` | `duration` | 是否自动关闭。 | `boolean` | `false` |
| `duration` | `duration` | `duration` | 自动关闭延迟。 | `number` | `3000` |
| `close` / `afterLeave` | `close` / `after-leave` | close / transition end | 事件命名转 camelCase。 | event | - |
| `default` slot | default slot | message slot | 自定义内容。 | slot | - |

## Modal

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 弹窗开关。 | `boolean` | `true` |
| `title` | `title` | `title` / header slot | 标题。 | `string` | `'对话框标题'` |
| `description` | confirm `description` | default slot | 确认弹窗描述。 | `string` | `undefined` |
| `status` | confirm `type` | class / icon | `confirm/info/success/warning/danger`。 | `VisModalStatus` | `'confirm'` |
| `divided` | `divider` | class | 分割线。 | `boolean` | `true` |
| `footer` | `footer` | footer slot | 是否显示默认 footer。 | `boolean` | `true` |
| `icon` | `icon` | header icon slot | 图标区域。 | `IconName \| false` | `false` |
| `showBack` | `twoLevel` | header slot | 二级返回。 | `boolean` | `false` |
| `menuItems` | `withMenu` + `menuItems` | side menu slot | 有 menuItems 时进入菜单弹窗模式。 | `VisModalMenuItem[]` | demo items |
| `activeMenuKey` | `activeMenuKey` | side menu active | 当前菜单项。 | `string` | `'overview'` |
| `closable` | `closeable` | `show-close` | 关闭按钮。 | `boolean` | `true` |
| `width` / `height` | 同名 | `width` / body style | 尺寸。 | `number \| string` | `undefined` |
| `cancelText` / `confirmText` / `okText` | 同名 | footer buttons | 默认按钮文案。 | `string` | `'取消'` / `'确认'` / `'知道了'` |
| `close` / `cancel` / `confirm` / `back` / `menuSelect` | `menu-select` 等 | handlers | 事件保持，kebab 事件在类型中用 camelCase 别名。 | event | - |

## Notification

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | `type` | 旧 API 与 Element Plus API 均为 `type`，因此 Vision 继续使用 `type`；`danger` 在 adapter 内映射 Element Plus `error`。 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| `title` | `title` | `title` | 标题。 | `string` | `undefined` |
| `description` | `description` | `message` | 描述内容。 | `string` | `undefined` |
| `showActions` | `actions` | action slot | 是否显示默认操作。 | `boolean` | `true` |
| `closable` | `closeable` | `show-close` | 关闭按钮。 | `boolean` | `true` |
| `modelValue` | `modelValue` | visible state | 组件式可见性。 | `boolean` | `true` |
| `width` | `width` | custom style | 宽度。 | `number \| string` | `384` |
| `icon` | `iconName` | icon slot | 通知图标。 | `IconName` | `'download-cloud-01'` |
| `avatar` | `avatarImageVariant/avatarName/avatarTime` | avatar slot | 用户通知头像信息，建议合并为对象。 | `VisNotificationAvatar` | demo avatar |
| `autoClose` | `autoClose` | `duration` | 自动关闭。 | `boolean` | `true` |
| `actionPrimary` / `actionSecondary` | `action-primary` / `action-secondary` | action handlers | 事件改 camelCase，同时保留 kebab emit。 | event | - |

## PageHeader

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `title` | `title` | 自研 | 页面标题。 | `string` | `'这里是页面的标题'` |
| `description` | `description` + `descriptionText` | 自研 | `description` 改为文本，旧布尔改 `showDescription`。 | `string` | demo text |
| `showDescription` | `description` | class | 是否显示描述。 | `boolean` | `true` |
| `breadcrumbs` | `breadcrumbItems` | Breadcrumb | 面包屑数据。 | `VisBreadcrumbItem[]` | demo items |
| `showBreadcrumb` | `breadcrumb` | Breadcrumb | 是否显示面包屑。 | `boolean` | `false` |
| `parentLink` | `parentLink` | Button link | 是否显示返回上级。 | `boolean` | `false` |
| `tabs` | `tabItems` | Tabs | 标签页数据。 | `VisTabsItem[]` | demo tabs |
| `activeTab` | `activeTab` | Tabs model-value | 当前标签。 | `VisTabsValue` | `undefined` |
| `icon` | `icon` + `iconName` | FeaturedIcon | 页面图标。 | `IconName \| false` | `false` |
| `tag` | `headerSuffix/tagLabel/tagIconName` | Tag | 标题后缀标签。 | `VisTagProps \| false` | demo tag |
| `actions` | `actions` | actions slot | 页面操作。 | `boolean \| VisAction[]` | `true` |
| `update:activeTab` / `tabChange` | 同名 | Tabs events | 标签切换事件。 | event | - |

## Pagination

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `current-page` | 当前页。 | `number` | `1` |
| `total` | `total` | `total` | 总数。 | `number` | `196` |
| `pageSize` | `pageSize` | `page-size` | 每页数量。 | `number` | `20` |
| `pageSizeOptions` | `pageSizeOptions` | `page-sizes` | 每页数量选项。 | `number[]` | `[10,20,50,100]` |
| `pageCount` | `pageCount` | `page-count` | 总页数。 | `number` | `undefined` |
| `size` | `size` | `size` | `sm/md` 映射 Element Plus `small/default`。 | `'sm' \| 'md'` | `'md'` |
| `simple` | `simple` | layout | 简洁分页。 | `boolean` | `false` |
| `showTotal` | `count` | layout total | 是否显示总数。 | `boolean` | `true` |
| `showSizeChanger` | `quantity` | layout sizes | 是否显示 page size 选择。 | `boolean` | `true` |
| `showJumper` | `goto` | layout jumper | 是否显示跳转。 | `boolean` | `true` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `change` / `pageSizeChange` | 同名 | `current-change` / `size-change` | 事件保持。 | event | - |

## Popover

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `visible` | 受控显示。 | `boolean` | `undefined` |
| `placement` | `position` | `placement` | 位置命名对齐 Element Plus。 | `VisPopoverPlacement` | `'top'` |
| `trigger` | `trigger` | `trigger` | `manual/hover/focus/click`。 | `VisPopoverTrigger` | `'click'` |
| `disabled` | `disabled` | `disabled` | 禁用触发。 | `boolean` | `false` |
| `arrow` | `arrow` | `show-arrow` | 是否显示箭头。 | `boolean` | `true` |
| `title` | `title` | `title` / title slot | 标题。 | `string` | `'Header'` |
| `content` | `content` | `content` / default slot | 内容。 | `string` | `'Popover content'` |
| `showTitle` | `showTitle` | title slot visibility | 是否显示标题区。 | `boolean` | `true` |
| `icon` | `icon` + `iconName` | title slot | 标题图标。 | `IconName \| false` | `false` |
| `showActions` | `actions` | actions slot | 默认操作按钮。 | `boolean` | `false` |
| `closable` | `closeButton` | close button | 关闭按钮。 | `boolean` | `false` |
| `width` | `width` | `width` | 宽度。 | `number \| string` | `256` |
| `show` / `hide` / `cancel` / `confirm` / `close` | 同名 | handlers | 事件保持。 | event | - |

## ProgressBar

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `value` | `value` | `percentage` | 进度值。 | `number` | `undefined` |
| `status` | `status` | `status` / class | 进度状态。 | `VisProgressStatus` | `'default'` |
| `showLabel` | `label` | `show-text` | 单进度中旧 `label` 是枚举，multiple 中是布尔；Vision 拆清。 | `boolean` | `false` |
| `labelText` | `labelText` | text slot | 标签文本。 | `string` | `undefined` |
| `loading` | `loading` | class | 加载态。 | `boolean` | `false` |
| `segments` | multiple `segments` | 自研 | 多段进度。 | `VisProgressSegment[]` | demo segments |
| `width` | `width` | style | 宽度。 | `number \| string` | `400` |
| `decorative` | `decorative` | aria | 是否装饰性。 | `boolean` | `false` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `undefined` |

## ProgressCircle

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `size` | `size` | 自研 SVG | 圆形进度尺寸。 | `VisProgressCircleSize` | `'xs'` |
| `value` | `value` | `percentage` | 进度值。 | `number` | 必填 |
| `status` | `status` | class | 进度状态。 | `VisProgressStatus` | `'default'` |
| `showLabel` | `label` | text slot | 是否显示中心标签。 | `boolean` | `false` |
| `labelText` | `labelText` | text slot | 标签文本。 | `string` | `undefined` |
| `description` | `description` | text | 描述文本。 | `string` | `'当前进度'` |
| `decorative` | `decorative` | aria | 是否装饰性。 | `boolean` | `false` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `undefined` |

## Radio

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 单项旧值为 boolean，group 为选中值。 | `boolean \| VisRadioValue` | `false` / `null` |
| `value` | `value` | `value` | 单项 value。 | `string \| number \| boolean` | `undefined` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `visualState` | `state` | class | hover 演示态。 | `'default' \| 'hover'` | `'default'` |
| `variant` | `radioButton` | `ElRadioButton` | button radio 形态。 | `'default' \| 'button'` | `'default'` |
| `showLabel` | `label` | default slot visibility | 是否显示文本。 | `boolean` | `true` |
| `options` | group `options` | group options | RadioGroup 选项。 | `VisRadioOption[]` | `[]` |
| `direction` | group `align` | class | 布局方向。 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `name` / `ariaLabel` | 同名 | DOM attr | 原生和可访问属性。 | `string` | `undefined` |
| `change` | `change` | `change` | 事件保持。 | event | - |

## Rate

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 评分值。 | `number` | `0` |
| `count` | `count` | `max` | 最大星数。 | `number` | `5` |
| `allowHalf` | `allowHalf` | `allow-half` | 半星。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `readonly` | `readonly` | `disabled` + class | 只读但视觉不一定禁用。 | `boolean` | `false` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `'评分'` |
| `change` | `change` | `change` | 事件保持。 | event | - |

## RichTextEditor

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | 自研 / editor value | 富文本内容。 | `string` | `undefined` |
| `placeholder` | `placeholder` | editor placeholder | 占位文案。 | `string` | `'请输入文字'` |
| `disabled` | `disabled` | editor disabled | 禁用编辑。 | `boolean` | `false` |
| `maxLength` | `maxLength` | editor option | 最大长度；`false` 表示不限制。 | `number \| false` | `200` |
| `toolbar` | `tooltip` | toolbar slot | 旧 Tooltip 实际是编辑器工具栏，迁移为 `toolbar`。 | `boolean \| VisToolbarConfig` | `true` |
| `width` / `height` | 同名 | style | 编辑器尺寸。 | `number \| string` | `800` / `400` |
| `compact` | tooltip `compact` | toolbar class | 工具栏紧凑模式。 | `boolean` | `false` |
| `activeCommands` | tooltip `activeCommands` | toolbar state | 当前激活命令。 | `VisRichTextCommand[]` | `[]` |
| `command` | tooltip `command` | toolbar handler | 工具栏命令事件。 | event | - |

## ScrollShadow

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `variant` | `variant` | 自研 | 阴影背景语义。 | `VisScrollShadowVariant` | `'surface'` |
| `orientation` | `orientation` | 自研 | 滚动方向。 | `'vertical' \| 'horizontal'` | `'vertical'` |
| `size` | `size` | CSS var | 阴影尺寸。 | `number` | `80` |
| `hideScrollbar` | `hideScrollBar` | CSS | 统一 camelCase。 | `boolean` | `true` |
| `default` slot | default slot | slot | 滚动内容。 | slot | - |

## Segmented

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 当前值。 | `string \| number` | `undefined` |
| `defaultValue` | `defaultValue` | initial value | 非受控初始值。 | `string \| number` | `undefined` |
| `options` | `options` | `options` | 选项。 | `VisSegmentedOption[]` | demo options |
| `size` | `size` | `size` / class | 尺寸。 | `'md' \| 'lg'` | `'md'` |
| `showIcon` | `icon` | option icon slot | 是否显示图标。 | `boolean` | `true` |
| `showText` | `text` | option label | 是否显示文字。 | `boolean` | `true` |
| `disabled` | `disabled` | `disabled` | 整体禁用。 | `boolean` | `false` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `'分段控制器'` |
| `label` slot | `label` slot | option slot | 自定义选项 label。 | slot | - |
| `change` | `change` | `change` | 事件保持。 | event | - |

## Select

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 选择值。 | `VisSelectValue \| VisSelectValue[] \| null` | `undefined` |
| `options` | `options` | `ElOption` data | 选项。 | `VisSelectOption[]` | demo options |
| `variant` | `type` | class / multiple | `default/customize` 为视觉形态，`multiSelect` 才是多选行为。 | `VisSelectVariant` | `'default'` |
| `status` | `state` | class / validate state | 字段状态。 | `VisFieldStatus` | `'default'` |
| `placeholder` | `placeholder` | `placeholder` | 占位。 | `string` | `'请选择'` |
| `prefixIcon` | `prefix` + `prefixIcon` | prefix slot | 前置图标。 | `IconName \| false` | `'user-01'` |
| `multiple` | `multiSelect` | `multiple` | 多选。 | `boolean` | `false` |
| `filterable` | `filterable` | `filterable` | 可搜索。 | `boolean` | `false` |
| `readonlyView` | `readView` | readonly wrapper | 只读展示。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `loading` | `loading` | `loading` | 加载态。 | `boolean` | `false` |
| `open` | `open` | `visible` | 受控打开。 | `boolean` | `undefined` |
| `searchValue` | `searchValue` | query | 搜索关键字。 | `string` | `''` |
| `width` | `width` | style | 宽度。 | `number \| string` | `240` |
| `change` / `focus` / `blur` | 同名 | events | 事件保持。 | event | - |

## Slider

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 滑块值。 | `number \| [number, number]` | `50` |
| `range` | `type` | `range` | `type="range"` 改为布尔。 | `boolean` | `false` |
| `min` / `max` / `step` | 同名 | `min` / `max` / `step` | 范围和步长。 | `number` | `0` / `100` / `1` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `showLabel` | `label` | marks / tooltip | 是否显示 label。 | `boolean` | `false` |
| `width` | `width` | style | 宽度。 | `number \| string` | `240` |
| `change` | `change` | `change` | 事件保持。 | event | - |

## Steps

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `items` | `items` | `ElStep` data | 步骤数据。 | `VisStepsItem[]` | `[]` |
| `current` | `current` | `active` | 当前步骤。 | `number` | `1` |
| `align` | `align` | `direction` / class | 布局方向。 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `variant` | `type` | class | 旧 `type` 改为视觉形态。 | `VisStepsVariant` | `'icon'` |
| `itemWidth` | `itemWidth` | style | 单项宽度。 | `number \| string` | `160` |
| `status` | item `status` | `status` | 单项状态。 | `VisStepsStatus` | item 内定义 |

## Tabs

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 当前 tab。 | `string \| number` | `undefined` |
| `defaultValue` | `defaultValue` | initial active | 非受控初始 tab。 | `string \| number` | `undefined` |
| `items` | `items` | `ElTabPane` data | 标签项。 | `VisTabsItem[]` | demo items |
| `align` | `align` | tab position / class | 布局方向和对齐。 | `VisTabsAlign` | `'horizontal'` |
| `showActions` | `actions` | action slot | 右侧操作区。 | `boolean` | `false` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 标签组可访问名称。 | `string` | `'标签页'` |
| `label` slot | `label` slot | label slot | 自定义标签内容。 | slot | - |
| `actions` slot | `actions` slot | actions slot | 自定义操作区。 | slot | - |
| `change` / `action` | 同名 | tab-click / action handler | 事件保持。 | event | - |

## Tag

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | `type` / class | 旧 API 与 Element Plus API 均为 `type`，因此 Vision 继续使用 `type`；额外视觉差异用 Vision class 控制。 | `VisTagType` | `'default'` |
| `checkable` | `checkable` | 自研 checkbox/button | 可选中标签。 | `boolean` | `false` |
| `checked` | `checked` | checked state | 选中状态。 | `boolean` | `false` |
| `closable` | `closable` | `closable` | 可关闭。 | `boolean` | `false` |
| `closeState` | `closeState` | class | 关闭按钮视觉态。 | `VisTagCloseState` | `'default'` |
| `label` | `label` | default slot | 文案。 | `string` | `'标签'` |
| `icon` | `iconName` | icon slot | 前置图标。 | `IconName` | `'archive'` |
| `avatar` | `avatarSrc/avatarVariant/avatarAlt` | avatar slot | 头像型标签。 | `VisAvatarProps` | demo avatar |
| `update:checked` / `change` / `close` | 同名 | handlers | 事件保持。 | event | - |
| `leading` slot | `leading` slot | slot | 前置自定义内容。 | slot | - |

## TimePicker

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 时间值，range 时为元组。 | `string \| [string, string] \| null` | `null` |
| `range` | `range` | `is-range` | 范围选择。 | `boolean` | `false` |
| `format` | `type` | `format` | 旧 `HH MM SS` / `HH MM` 映射格式字符串。 | `'HH:mm:ss' \| 'HH:mm'` | `'HH:mm:ss'` |
| `timeSelect` | `timeSelect` | picker type | 是否时间选择模式。 | `boolean` | `false` |
| `status` | `state` | class | 字段状态。 | `VisFieldStatus` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `readonlyView` | `readView` | readonly wrapper | 只读展示。 | `boolean` | `false` |
| `placeholder` | `placeholder` | `placeholder` | 单值占位。 | `string` | `'请选择时间'` |
| `startPlaceholder` / `endPlaceholder` | 同名 | range placeholders | 范围占位。 | `string` | `'选择开始时间'` / `'选择结束时间'` |
| `open` | `open` | visible | 受控打开。 | `boolean` | `undefined` |
| `change` / `clear` / `update:open` | 同名 | events | 事件保持。 | event | - |

## Toggle

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 开关值。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `loading` | `state="loading"` | `loading` / class | loading 从 `state` 拆出为正式 API。 | `boolean` | `false` |
| `visualState` | `state` | class | hover/focus 演示态。 | `VisToggleVisualState` | `'default'` |
| `showIcon` | `icon` | active/inactive icons | 是否显示图标。 | `boolean` | `false` |
| `showText` | `text` | active/inactive text | 是否显示文字。 | `boolean` | `false` |
| `id` / `name` / `value` | 同名 | DOM attr | 表单属性。 | `string \| number \| boolean` | `undefined` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `undefined` |
| `change` | `change` | `change` | 事件保持。 | event | - |

## ToggleButton

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | 自研 pressed state | 受控按下状态。 | `boolean` | `undefined` |
| `defaultPressed` | `defaultPressed` | initial state | 非受控初始状态。 | `boolean` | `false` |
| `size` | `size` | class | 尺寸。 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `visualState` | `state` | class | 视觉态。 | `VisToggleButtonVisualState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `iconOnly` | `iconOnly` | aria-label | 仅图标按钮。 | `boolean` | `false` |
| `prefixIcon` | `prefix` + `iconName` | icon slot | 前置图标。 | `IconName` | `'plus'` |
| `suffixIcon` | `suffix` + `suffixIconName` | icon slot | 后置图标。 | `IconName` | `'chevron-down'` |
| `label` | `label` | default slot | 文案。 | `string` | `undefined` |
| `nativeType` | `htmlType` | native button type | 原生类型。 | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `change` | `change` | handler | 状态变化事件。 | event | - |

## Tooltip

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `content` | `content` | `content` | 提示内容。 | `string` | `'Tooltip'` |
| `modelValue` | `modelValue` | `visible` | 手动受控显示。 | `boolean` | `undefined` |
| `placement` | `position` | `placement` | 位置命名对齐 Element Plus。 | `VisTooltipPlacement` | `'top'` |
| `trigger` | `trigger` | `trigger` | 触发方式。 | `'manual' \| 'hover' \| 'focus' \| 'click'` | `'hover'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `arrow` | `arrow` | `show-arrow` | 箭头。 | `boolean` | `true` |
| `content` slot | `content` slot | content slot | 自定义内容。 | slot | - |
| `show` / `hide` | 同名 | visible change | 显隐事件。 | event | - |

## TreeView

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `items` | `items` | `data` | 树数据。 | `VisTreeItem[]` | `[]` |
| `expandedKeys` | `expandedKeys` | `default-expanded-keys` / controlled | 展开 keys。 | `VisTreeKey[]` | `[]` |
| `selectedKey` | `selectedKey` | `current-node-key` | 当前选中 key。 | `VisTreeKey \| null` | `null` |
| `checkedKeys` | `checkedKeys` | `checked-keys` | 勾选 keys。 | `VisTreeKey[]` | `[]` |
| `checkable` | `checkable` | `show-checkbox` | 是否可勾选。 | `boolean` | `true` |
| `draggable` | `draggable` | `draggable` | 是否可拖拽。 | `boolean` | `false` |
| `showIcon` | `icon` | render-content | 是否显示图标。 | `boolean` | `true` |
| `showActions` | `actions` | render-content | 是否显示节点操作。 | `boolean` | `true` |
| `expanderVariant` | `folderType` | render-content | `+/-` 映射为 plus-minus 展开器。 | `'default' \| 'plus-minus'` | `'default'` |
| `width` | `width` | style | 宽度。 | `number \| string` | `300` |
| `expand` / `select` / `check` / `actionClick` | `action-click` 等 | node events | 事件保持并提供 camelCase 别名。 | event | - |

## Upload

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `file-list` | 文件列表。 | `VisUploadFileItem[]` | `undefined` |
| `variant` | `type` | list type / class | 上传形态，旧 `button/drag` 映射 Vision variant。 | `VisUploadVariant` | `'button'` |
| `uploaded` | `uploaded` | file status | 是否展示已上传态。 | `boolean` | `false` |
| `showDescription` | `description` | helper text | 是否显示说明。 | `boolean` | `true` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `multiple` | `multiple` | `multiple` | 多文件。 | `boolean` | `false` |
| `accept` | `accept` | `accept` | 文件类型。 | `string` | `undefined` |
| `buttonText` | `buttonText` | trigger slot | 按钮文案。 | `string` | `'点击上传'` |
| `dragTitle` | `dragTitle` | drag slot | 拖拽标题。 | `string` | `'点击或拖拽文件到此处上传'` |
| `dragDescription` | `dragDescription` | drag slot | 拖拽说明。 | `string` | old long description |
| `descriptionText` | `descriptionText` | helper text | 辅助说明。 | `string` | `'jpg/png files with a size less than 500KB.'` |
| `fileIcon` | `fileIconName` | file item icon slot | 文件图标。 | `IconName` | `'file-06'` |
| `change` / `remove` / `progress` / `success` / `error` | 旧组件仅 `update:modelValue` | Element Upload events | 迁移时补齐上传事件矩阵。 | event | - |

## HelloWorld

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| 不迁移 | `HelloWorld.vue` | 无 | 示例组件，不属于设计系统 API。 | - | - |

## Figma API 同步改名清单

以下清单只列 Figma 设计稿中需要从旧 API 改名为 Vision API 的项。未出现在清单中的同名 API，例如 `modelValue`、`disabled`、`loading`、`placeholder`、`options`、`size`、`width`、`height` 等，默认保持不变。

### 按新规则保持不变

| 组件 | 旧 API | 新 API | 原因 |
| --- | --- | --- | --- |
| Alert | `type` | `type` | 旧 API 与 Element Plus API 都是 `type`。 |
| Message | `type` | `type` | 旧 API 与 Element Plus API 都是 `type`。 |
| Notification | `type` | `type` | 旧 API 与 Element Plus API 都是 `type`。 |
| Tag | `type` | `type` | 旧 API 与 Element Plus API 都是 `type`。 |

### 需要同步改名

| 组件             | Figma 旧 API                                        | Figma 新 API        | 备注                                      |
| -------------- | -------------------------------------------------- | ------------------ | --------------------------------------- |
| Accordion      | `icon`                                             | `showIcon`         | 布尔显示控制。                                 |
| Alert          | `description`                                      | `showDescription`  | 旧布尔控制项。                                 |
| Alert          | `descriptionText`                                  | `description`      | 描述内容。                                   |
| Alert          | `actions`                                          | `showActions`      | 默认操作区显示控制。                              |
| Alert          | `closeable`                                        | `closable`         | 统一拼写。                                   |
| Avatar         | `type`                                             | `variant`          | 自研头像形态，不映射 Element `type`。              |
| Avatar         | `shapeSquare`                                      | `shape`            | 值改为 `circle/square`。                    |
| Avatar         | `imageSrc`                                         | `src`              | 图片地址。                                   |
| Avatar         | `imageAlt`                                         | `alt`              | 图片替代文本。                                 |
| Avatar         | `text`                                             | `name`             | 文本头像名称。                                 |
| AvatarLabel    | `title`                                            | `name`             | 主文本。                                    |
| AvatarLabel    | `subtitle`                                         | `description`      | 副文本。                                    |
| Avatar         | `badgeColorType`                                   | `badgeTone`        | 角标色彩语义。                                 |
| Badge          | `colorType`                                        | `tone`             | 色彩语义。                                   |
| Badge          | `type` / `solid` / `subtle`                        | `variant`          | 旧 Badge type 不直接映射 Element `type`。      |
| Badge          | `iconName`                                         | `icon`             | 图标名统一。                                  |
| Breadcrumb     | `type`                                             | `variant`          | 旧值为 `button/link`，不直接映射 Element `type`。 |
| Button         | `danger`                                           | `tone`             | 危险意图色。                                  |
| Button         | `state`                                            | `visualState`      | 仅视觉回归用。                                 |
| Button         | `iconName`                                         | `prefixIcon`       | 前置/主图标。                                 |
| Button         | `suffixIconName`                                   | `suffixIcon`       | 后置图标。                                   |
| Button         | `htmlType`                                         | `nativeType`       | 原生按钮类型。                                 |
| Checkbox       | `state`                                            | `visualState`      | 仅视觉回归用。                                 |
| Checkbox       | `label`                                            | `showLabel`        | 旧布尔控制项。                                 |
| CheckboxGroup  | `align`                                            | `direction`        | 布局方向。                                   |
| CodeBlock      | `type`                                             | `variant`          | 自研视觉形态。                                 |
| CodeBlock      | `heading`                                          | `showHeader`       | 头部显示控制。                                 |
| CodeBlock      | `copy`                                             | `copyable`         | 复制能力开关。                                 |
| DatePicker     | `readView`                                         | `readonlyView`     | 统一只读展示命名。                               |
| DatePicker     | `state`                                            | `status`           | 字段状态。                                   |
| Drawer         | `position`                                         | `placement`        | 浮层位置。                                   |
| Drawer         | `divider`                                          | `divided`          | 分割线。                                    |
| Drawer         | `actions`                                          | `showActions`      | 默认操作区显示控制。                              |
| Drawer         | `iconName`                                         | `icon`             | 图标名统一。                                  |
| Drawer         | `twoLevel`                                         | `showBack`         | 二级返回。                                   |
| Drawer         | `closeable`                                        | `closable`         | 统一拼写。                                   |
| Drawer         | `handle`                                           | `showHandle`       | handle 显示控制。                            |
| DropdownItem   | `iconName`                                         | `icon`             | 图标名统一。                                  |
| FeaturedIcon   | `color`                                            | `tone`             | 色彩语义。                                   |
| FeaturedIcon   | `type`                                             | `variant`          | 自研容器形态。                                 |
| Input          | `valueText`                                        | `readonlyValue`    | 只读展示值。                                  |
| Input          | `state`                                            | `status`           | 字段状态。                                   |
| Input          | `readView`                                         | `readonlyView`     | 只读展示。                                   |
| Input          | `addonLeft` / `addonLeftText`                      | `addonBefore`      | 前置 addon。                               |
| Input          | `addonRight` / `addonRightText`                    | `addonAfter`       | 后置 addon。                               |
| InputNumber    | `position` / `rightControls`                       | `controlsPosition` | 控制器位置。                                  |
| InputNumber    | `state`                                            | `status`           | 字段状态。                                   |
| InputNumber    | `readView` / `readview`                            | `readonlyView`     | 只读展示。                                   |
| InputNumber    | `prefixIconName`                                   | `prefixIcon`       | 前置图标。                                   |
| InputNumber    | `suffixIconName`                                   | `suffixIcon`       | 后置图标。                                   |
| InputSearchBox | `valueText`                                        | `readonlyValue`    | 展示值。                                    |
| InputSearchBox | `filter`                                           | `showFilter`       | 过滤按钮显示控制。                               |
| InputSearchBox | `state`                                            | `status`           | 字段状态。                                   |
| InputTextarea  | `valueText`                                        | `readonlyValue`    | 只读展示值。                                  |
| InputTextarea  | `state`                                            | `status`           | 字段状态。                                   |
| InputTextarea  | `readView`                                         | `readonlyView`     | 只读展示。                                   |
| Loading        | `color`                                            | `tone`             | 色彩语义。                                   |
| Loading        | `text`                                             | `showText`         | 文本显示控制。                                 |
| Menu           | `collapse`                                         | `collapsed`        | 折叠状态。                                   |
| MenuItem       | `iconName`                                         | `icon`             | 图标名统一。                                  |
| MenuItem       | `subLevel`                                         | `level`            | 层级。                                     |
| Message        | `after-leave`                                      | `afterLeave`       | 事件名 camelCase。                          |
| Modal          | `divider`                                          | `divided`          | 分割线。                                    |
| Modal          | `twoLevel`                                         | `showBack`         | 二级返回。                                   |
| Modal          | `withMenu` + `menuItems`                           | `menuItems`        | 有菜单数据即菜单模式。                             |
| Modal          | `closeable`                                        | `closable`         | 统一拼写。                                   |
| ModalConfirm   | `type`                                             | `status`           | 确认弹窗状态不直接映射 Element `type`。             |
| Modal          | `menu-select`                                      | `menuSelect`       | 事件名 camelCase。                          |
| Notification   | `actions`                                          | `showActions`      | 默认操作区显示控制。                              |
| Notification   | `closeable`                                        | `closable`         | 统一拼写。                                   |
| Notification   | `iconName`                                         | `icon`             | 图标名统一。                                  |
| Notification   | `avatarImageVariant` / `avatarName` / `avatarTime` | `avatar`           | 合并为对象。                                  |
| Notification   | `action-primary`                                   | `actionPrimary`    | 事件名 camelCase。                          |
| Notification   | `action-secondary`                                 | `actionSecondary`  | 事件名 camelCase。                          |
| PageHeader     | `descriptionText`                                  | `description`      | 描述文本。                                   |
| PageHeader     | `description`                                      | `showDescription`  | 旧布尔控制项。                                 |
| PageHeader     | `breadcrumbItems`                                  | `breadcrumbs`      | 面包屑数据。                                  |
| PageHeader     | `breadcrumb`                                       | `showBreadcrumb`   | 面包屑显示控制。                                |
| PageHeader     | `tabItems`                                         | `tabs`             | 标签页数据。                                  |
| PageHeader     | `iconName`                                         | `icon`             | 图标名统一。                                  |
| PageHeader     | `headerSuffix` / `tagLabel` / `tagIconName`        | `tag`              | 合并为标签对象。                                |
| Pagination     | `count`                                            | `showTotal`        | 总数显示。                                   |
| Pagination     | `quantity`                                         | `showSizeChanger`  | 每页数量选择。                                 |
| Pagination     | `goto`                                             | `showJumper`       | 跳页输入。                                   |
| Popover        | `position`                                         | `placement`        | 浮层位置。                                   |
| Popover        | `iconName`                                         | `icon`             | 图标名统一。                                  |
| Popover        | `actions`                                          | `showActions`      | 默认操作区显示控制。                              |
| Popover        | `closeButton`                                      | `closable`         | 关闭按钮。                                   |
| ProgressBar    | `label`                                            | `showLabel`        | 标签显示控制。                                 |
| ProgressCircle | `label`                                            | `showLabel`        | 标签显示控制。                                 |
| Radio          | `state`                                            | `visualState`      | 仅视觉回归用。                                 |
| Radio          | `radioButton`                                      | `variant`          | button 形态。                              |
| Radio          | `label`                                            | `showLabel`        | 文本显示控制。                                 |
| RadioGroup     | `align`                                            | `direction`        | 布局方向。                                   |
| RichTextEditor | `tooltip`                                          | `toolbar`          | 旧 Tooltip 实际是工具栏。                       |
| ScrollShadow   | `hideScrollBar`                                    | `hideScrollbar`    | 统一 camelCase。                           |
| Segmented      | `icon`                                             | `showIcon`         | 图标显示控制。                                 |
| Segmented      | `text`                                             | `showText`         | 文本显示控制。                                 |
| Select         | `type`                                             | `variant`          | 旧 Select type 不直接映射 Element `type`。     |
| Select         | `state`                                            | `status`           | 字段状态。                                   |
| Select         | `multiSelect`                                      | `multiple`         | 多选。                                     |
| Select         | `readView`                                         | `readonlyView`     | 只读展示。                                   |
| Slider         | `type`                                             | `range`            | 旧 `type="range"` 改为布尔。                  |
| Slider         | `label`                                            | `showLabel`        | 标签显示控制。                                 |
| Steps          | `type`                                             | `variant`          | 步骤视觉形态。                                 |
| Tabs           | `actions`                                          | `showActions`      | 操作区显示控制。                                |
| Tag            | `iconName`                                         | `icon`             | 图标名统一。                                  |
| Tag            | `avatarSrc` / `avatarVariant` / `avatarAlt`        | `avatar`           | 合并为头像对象。                                |
| TimePicker     | `type`                                             | `format`           | 时间格式。                                   |
| TimePicker     | `state`                                            | `status`           | 字段状态。                                   |
| TimePicker     | `readView`                                         | `readonlyView`     | 只读展示。                                   |
| Toggle         | `state="loading"`                                  | `loading`          | loading 拆成正式 API。                       |
| Toggle         | `state`                                            | `visualState`      | 其他视觉态。                                  |
| Toggle         | `icon`                                             | `showIcon`         | 图标显示控制。                                 |
| Toggle         | `text`                                             | `showText`         | 文本显示控制。                                 |
| ToggleButton   | `state`                                            | `visualState`      | 视觉态。                                    |
| ToggleButton   | `iconName`                                         | `prefixIcon`       | 前置图标。                                   |
| ToggleButton   | `suffixIconName`                                   | `suffixIcon`       | 后置图标。                                   |
| ToggleButton   | `htmlType`                                         | `nativeType`       | 原生按钮类型。                                 |
| Tooltip        | `position`                                         | `placement`        | 浮层位置。                                   |
| TreeView       | `icon`                                             | `showIcon`         | 图标显示控制。                                 |
| TreeView       | `actions`                                          | `showActions`      | 节点操作显示控制。                               |
| TreeView       | `folderType`                                       | `expanderVariant`  | 展开器形态。                                  |
| TreeView       | `action-click`                                     | `actionClick`      | 事件名 camelCase。                          |
| Upload         | `type`                                             | `variant`          | 上传形态。                                   |
| Upload         | `description`                                      | `showDescription`  | 说明显示控制。                                 |
| Upload         | `fileIconName`                                     | `fileIcon`         | 文件图标。                                   |

## 类型命名规则

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `Vis*Type` | `Leo*Type` | Element `type` | 当旧 API 与 Element Plus API 都叫 `type` 时，类型也保留 `Type` 命名。 | type alias | - |
| `Vis*Variant` | `Leo*Type` | class / 自研结构 | 旧 `type` 不直接映射 Element `type`、只表示视觉结构时改为 `Variant`。 | type alias | - |
| `Vis*Status` | `Leo*State` / 非 Element `type` | Element status / validate state | 旧 `state` 或非 Element `type` 表示信息等级、校验状态时改为 `Status`。 | type alias | - |
| `Vis*VisualState` | `Leo*State` | class | 强制视觉态只用于 demo 和视觉回归。 | type alias | - |
| `IconName` | `IconName` | 自研 icon registry | 图标类型保持原名。 | type alias | - |

## 验收要求

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| API 对照表 | 旧组件 props/events/slots | Element Plus props/events/slots | 每个迁移组件文档必须包含本文件同结构表格。 | markdown | 必填 |
| Adapter | 旧 API alias | `elProps` | 基于 Element Plus 的组件必须有 `*.adapter.ts`，Vision API 覆盖冲突的 `elProps`。 | source file | 必填 |
| Token 检查 | `--leo-*` / 旧 token | `--el-*` | 样式必须落到 `--vis-*` 或 Vision token，Element Plus 变量统一从 `element-plus.css` 映射。 | CSS | 必填 |
| 构建检查 | 旧导出 | package exports | 迁移后需要 root export、subpath export、library entry、style import。 | build | 必填 |
