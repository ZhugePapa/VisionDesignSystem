# Leoht Design API 语义兼容字典表

来源项目：`/Users/leiwang/Documents/Project/LeohtDesign/leoht-design`

目标项目：`/Users/leiwang/Documents/Project/VisionDesignSystem`

本文用于指导 AI 将 `leoht-design` 组件迁移为 Vision Design System 的二次封装组件。API 策略以旧项目和 Figma 设计稿兼容为主：旧 API 名默认就是 Vision 对外主 API；只有旧 API 与 Vue/Element Plus 约定冲突、拼写确认为错误、或会造成长期歧义时，才新增更语义化的别名。每个组件独立一张表，表内字段含义如下：

| 字段 | 说明 |
| --- | --- |
| API 名 | Vision 对外主 API。默认沿用 `leoht-design` / Figma 旧 API 名。 |
| 旧 API | `leoht-design` 中对应的旧 props / events / slots。 |
| Element Plus API | 建议映射到的 Element Plus API；自研组件写 `自研` 或 `DOM`。 |
| 说明 | 迁移规则、兼容策略、冲突处理。 |
| 类型 | Vision API 推荐类型。 |
| 默认值 | 旧组件默认值或 Vision 推荐默认值。 |

## 全局约定

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| 保持旧名 | 同名旧 API | 视组件而定 | 默认策略。Figma 已存在且业务代码可能依赖的 API 不主动改名，避免 Figma、旧代码、组件实现三边维护映射。 | 视组件而定 | 视组件而定 |
| `type` | `type` | `type` / class | 旧项目大量组件使用 `type` 表达视觉形态或状态。即使内部不直接映射 Element Plus `type`，对外也优先保留 `type`。 | `string` | 视组件而定 |
| `state` | `state` | class / validate state | 旧 `state` 优先保留为视觉状态或字段状态 API；内部可映射为 hover/focus/error/danger 等 class 或 Element validate state。 | `string` | `'default'` |
| `color` / `colorType` | `color` / `colorType` | class / CSS var | 旧项目中 `color` 与 `colorType` 语义不同，均按原名保留；内部可归一到 tone token。旧 `grey` 在视觉 token 层映射，不改 public API。 | `string` | 视组件而定 |
| `readView` / `readview` | `readView` / `readview` | `readonly` + wrapper view | 仅在组件自身 Figma API 仍包含该语义时保留；Input、Input Password 和 DatePicker 已按设计稿移除。 | `boolean` | `false` |
| `iconName` / `suffixIconName` | 同名 | icon slot / prefix icon | 旧图标命名保留。新组件可支持 `icon` 作为补充别名，但 Figma 对齐以旧名为准。 | `IconName` | 视组件而定 |
| `htmlType` | `htmlType` | `native-type` | 原生 button type 对外保留旧名 `htmlType`；内部映射 Element Plus `native-type`。 | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `closeable` | `closeable` | `show-close` / close icon | 旧项目使用 `closeable` 时保留旧拼写；`closable` 可作为 Vue/Element 生态别名。 | `boolean` | 视组件而定 |
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
| `actions` | `actions` | action slot | 控制默认操作按钮；推荐用 `actions` slot，保持旧 API。 | `boolean` | `true` |
| `closeable` | `closeable` | `closable` | 关闭按钮，保持旧 API；可支持 `closable` 别名。 | `boolean` | `true` |
| `detailLabel` | `detailLabel` | action slot | 默认详情按钮文案。 | `string` | `'查看详情'` |
| `ignoreLabel` | `ignoreLabel` | action slot | 默认忽略按钮文案。 | `string` | `'忽略'` |
| `close` | `close` | `close` | 关闭事件。 | event | - |
| `ignore` / `detail` | `ignore` / `detail` | action handlers | 保留旧动作语义。 | event | - |

## Avatar

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | 自研 | 头像形态，保持旧/Figma API。 | `'image' \| 'icon' \| 'text'` | `'image'` |
| `size` | `size` | `size` / class | Avatar 视觉尺寸自研，不直接使用 Element Plus 默认尺寸。 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'sm'` |
| `state` | `state` | class | 视觉态演示，保持旧 API。 | `'default' \| 'hover'` | `'default'` |
| `shape` | `shapeSquare` / group `shape` | `shape` | 统一为 `circle/square`。 | `'circle' \| 'square'` | `'circle'` |
| `src` | `imageSrc` | `src` | 图片地址。 | `string` | `undefined` |
| `imageVariant` | `imageVariant` / `avatarImageVariant` | 自研 demo asset | 旧内置头像资源兼容项，不作为核心 API 推荐。 | `LeoAvatarImageVariant` | `'09'` |
| `alt` | `imageAlt` / `avatarImageAlt` | `alt` | 图片替代文本。 | `string` | `undefined` |
| `name` | `text` / label `title` | 自研 | 文本头像或 AvatarLabel 主标题。 | `string` | `'诸葛'` |
| `description` | label `subtitle` | 自研 | AvatarLabel 副标题。 | `string` | `'zhangdashan'` |
| `icon` | `icon` / `avatarIcon` | icon slot | 图标头像。 | `IconName` | `'user-03'` |
| `badge` | `badge` | 自研 / Badge | 头像角标类型。 | `'none' \| 'dot' \| 'icon' \| 'number' \| 'state'` | `'none'` |
| `badgeColorType` | `badgeColorType` | Badge color token | 角标颜色语义，保持旧 API。 | `VisBadgeColorType` | `'danger'` |
| `items` | group `items` | 自研 | AvatarGroup 成员。 | `VisAvatarGroupItem[]` | `[]` |

## Badge

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `colorType` | `colorType` | class / CSS var | 保持 Figma/旧项目 API。内部映射到 Badge 颜色 token，`info` 继续表示灰/信息色。 | `VisBadgeColorType` | `'danger'` |
| `type` | `type` | `is-dot` / `value` / class | Badge 形态主 API。`status/text/icon/dot` 由 Vision 自研结构控制，`number` 保留旧 API 并复用 text 视觉。 | `'status' \| 'text' \| 'icon' \| 'dot' \| 'number'` | `'status'` |
| `solid` | `solid` | class | 保留旧布尔 API，控制实色风格。与 `subtle` 同时传入时按组件实现定义优先级。 | `boolean` | `false` |
| `subtle` | `subtle` | class | 保留旧布尔 API，控制柔和风格。 | `boolean` | `false` |
| `label` | `label` | 自研 | 文本内容。 | `string` | `undefined` |
| `count` | `count` | `value` | 数字角标。内部可映射 Element Plus `value`。 | `string \| number` | `undefined` |
| `iconName` | `iconName` | icon slot | 图标角标名称，保持旧 API。 | `IconName` | `undefined` |
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

| API 名         | 旧 API                       | Element Plus API        | 说明                                                                   | 类型                                | 默认值              |
| ------------- | --------------------------- | ----------------------- | -------------------------------------------------------------------- | --------------------------------- | ---------------- |
| `variant`     | `variant`                   | `type` / class          | `primary/secondary/text/link-*` 映射 Element Plus type 与 Vision class。 | `VisButtonVariant`                | `'primary'`      |
| `danger`      | `danger`                    | `type="danger"` / class | 保持旧/Figma API。为 `true` 时覆盖危险色视觉；内部可映射 Element Plus danger 或 Vision danger class。 | `boolean`                         | `false`          |
| `size`        | `size`                      | `size`                  | `sm/md/lg` 映射 `small/default/large`。                                 | `'sm' \| 'md' \| 'lg'`            | `'md'`           |
| `state`       | `state`                     | class                   | 保持旧/Figma API。仅用于视觉演示和回归；真实状态由交互驱动。 | `VisButtonState`                  | `'default'`      |
| `disabled`    | `disabled`                  | `disabled`              | 禁用原生点击。                                                              | `boolean`                         | `false`          |
| `loading`     | `loading`                   | `loading`               | loading 时禁用点击，可替换 loading slot。                                      | `boolean`                         | `false`          |
| `iconOnly`    | `iconOnly`                  | class / aria-label      | icon-only 必须有可访问名称。                                                  | `boolean`                         | `false`          |
| `prefix`      | `prefix`                    | icon slot visibility    | 是否显示前置图标，保持旧布尔 API。                                                | `boolean`                         | `false`          |
| `suffix`      | `suffix`                    | icon slot visibility    | 是否显示后置图标，保持旧布尔 API。                                                | `boolean`                         | `false`          |
| `iconName`    | `iconName`                  | icon slot               | 前置/主图标名称，保持旧 API。                                                   | `IconName`                        | `'plus'`         |
| `suffixIconName` | `suffixIconName`         | icon slot               | 后置图标名称，保持旧 API。                                                     | `IconName`                        | `'chevron-down'` |
| `label`       | `label`                     | default slot            | 按钮文本，也作为 icon-only aria-label fallback。                              | `string`                          | `undefined`      |
| `htmlType`    | `htmlType`                  | `native-type`           | 原生按钮类型，保持旧 API。                                                     | `'button' \| 'submit' \| 'reset'` | `'button'`       |
| `elProps`     | 无                           | `ElButton` props        | 逃生口；`type/size/loading/disabled` 冲突时 Vision 优先。                      | `Partial<ButtonProps>`            | `{}`             |

## Checkbox

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 单个 checkbox 选中值；group 为数组。 | `boolean \| VisCheckboxValue[]` | `false` / `[]` |
| `indeterminate` | `indeterminate` | `indeterminate` | 半选状态。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `state` | `state` | class | hover 演示态，保持旧 API。 | `'default' \| 'hover'` | `'default'` |
| `label` | `label` | default slot visibility | 文本显示控制，保持旧布尔 API。 | `boolean` | `true` |
| `value` | `value` | `value` | 表单提交值或 group option value。 | `string \| number \| boolean` | `undefined` |
| `options` | group `options` | `ElCheckboxGroup` options | group 数据。 | `VisCheckboxOption[]` | `[]` |
| `align` | group `align` | class | 布局方向，保持旧 API；内部映射 horizontal/vertical。 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `name` | `name` | `name` | 原生 name。 | `string` | `undefined` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 无 label 时必须提供或自动兜底。 | `string` | `undefined` |
| `change` | `change` | `change` | payload 保留 checked、indeterminate、value。 | event | - |

## CodeBlock

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `type` | `type` | 自研 | 保持旧/Figma API，表示代码块视觉形态。 | `VisCodeBlockType` | `'default'` |
| `collapsed` | `collapsed` | 自研 | 是否折叠。 | `boolean` | `false` |
| `heading` | `heading` | 自研 | 是否显示头部，保持旧 API。 | `boolean` | `false` |
| `copy` | `copy` | 自研 | 是否显示复制按钮，保持旧 API。 | `boolean` | `true` |
| `language` | `language` | 自研 | 语言标签。 | `string` | `'Javascript'` |
| `code` | `code` | 自研 | 代码内容。 | `string` | `''` |
| `copy-click` / `copyClick` | 无 | 自研 | 如需新增复制事件，建议同时支持 kebab 与 camelCase。 | event | - |

## DatePicker

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 日期值，range 时为元组。 | `Date \| string \| [Date \| string, Date \| string] \| null` | `null` |
| `range` | `range` | `type="daterange"` | 是否范围选择。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `state` | `state` | class / validate state | 字段状态，按 Figma DatePicker 变体使用 `default`、`hover`、`focus`、`danger`。 | `VisDatePickerState` | `'default'` |
| `placeholder` | `placeholder` | `placeholder` | 单日期占位。 | `string` | `'请选择日期'` |
| `startPlaceholder` | `startPlaceholder` | `start-placeholder` | 范围开始占位。 | `string` | `'选择开始日期'` |
| `endPlaceholder` | `endPlaceholder` | `end-placeholder` | 范围结束占位。 | `string` | `'选择结束日期'` |
| `open` | `open` | `visible` / controlled popper | 受控打开状态。 | `boolean` | `undefined` |
| `prefix` | `prefix` | prefix slot visibility | 是否显示前缀图标，保持旧 API。 | `boolean` | `true` |
| `prefixIcon` | `prefixIcon` | `prefix-icon` | 前缀图标名，保持旧 API。 | `IconName` | `'calendar'` |
| `showFooterShortcuts` | `showFooterShortcuts` | shortcuts slot | 是否显示快捷项。 | `boolean` | `true` |
| `shortcuts` | `shortcuts` | `shortcuts` | 快捷日期。 | `Array<{ label: string; days: number }>` | demo shortcuts |
| `disabledDate` | `disabledDate` | `disabled-date` | 禁用日期函数。 | `(date: Date) => boolean` | `undefined` |
| `change` / `update:open` | 同名 | `change` / visible change | 事件保持。 | event | - |

## Description

旧项目无 Description 源码，Vision API 以 Figma `Description 描述列表` 组件属性为基线，并与 Element Plus Descriptions 语义对齐。

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `border` | Figma `Border` | `border` | 切换无边框列表与网格边框样式。 | `boolean` | `false` |
| `direction` | Figma `Direction` | `direction` | 字段名和值横向排列或纵向堆叠。 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `columns` | Figma layout | `column` | 每行描述项数量。 | `number` | `3` |
| `title` | Figma `Title` | title slot | 是否显示标题。 | `boolean` | `true` |
| `titleText` | Figma title text | title slot | 默认标题文案。 | `string` | `'基本信息'` |
| `foldable` | Figma `Foldable` | 无直接对应 | 是否显示标题折叠按钮。 | `boolean` | `false` |
| `collapsed` | Figma fold state | 无直接对应 | 受控折叠状态。 | `boolean` | `undefined` |
| `alert` | Figma `Alert` | 无直接对应 | 是否显示品牌信息提示。 | `boolean` | `false` |
| `alertText` | Figma alert text | 无直接对应 | 默认提示文案。 | `string` | `'信息提示'` |
| `labelWidth` | Figma label width | `label-width` | 统一字段名宽度。 | `number \| string` | `84` / `120` |
| `ariaLabel` | 无 | `aria-label` | 描述列表区域的可访问名称。 | `string` | `titleText` |
| `update:collapsed` | 无 | 无直接对应 | 折叠状态变化事件。 | event | - |
| `toggle` | 无 | 无直接对应 | 点击折叠按钮后触发。 | event | - |

## DescriptionItem

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `label` | Figma label | `label` | 字段名，可由 label 插槽覆盖。 | `string` | `'字段名'` |
| `value` | Figma value | default slot | 普通文本字段值。 | `string \| number` | `'字段值'` |
| `type` | Figma `type` | default slot | 文本、标签组或自定义内容。 | `'text' \| 'tag' \| 'customize'` | `'text'` |
| `tags` | Figma TagGroup | default slot | tag 类型的数据源，内部复用 `VisTag`。 | `VisDescriptionTag[]` | 内置示例 |
| `icon` | Figma `icon` | label slot | 是否显示字段图标。 | `boolean` | `false` |
| `iconName` | Figma icon instance | label slot | 字段图标名称。 | `IconName` | `'user-01'` |
| `span` | Figma grid span | `span` | 描述项占据的列数。 | `number` | `1` |
| `border` | Figma `Border` | parent `border` | 独立使用时覆盖边框模式。 | `boolean` | `undefined` |
| `direction` | Figma `Direction` | parent `direction` | 独立使用时覆盖排列方向。 | `VisDescriptionDirection` | `undefined` |
| `labelWidth` | Figma label width | `label-width` | 覆盖当前项字段名宽度。 | `number \| string` | `undefined` |

## DescriptionTitle

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `title` | Figma title text | title slot | 标题文案。 | `string` | `'基本信息'` |
| `foldable` | Figma `Foldable` | 无直接对应 | 是否显示折叠按钮。 | `boolean` | `false` |
| `collapsed` | Figma fold state | 无直接对应 | 折叠按钮的可访问状态。 | `boolean` | `false` |
| `toggle` | 无 | 无直接对应 | 点击折叠按钮时触发。 | event | - |

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
| `position` | `position` | `direction` | 抽屉位置，保持旧 API；内部映射 Element Plus direction。 | `'right' \| 'bottom'` | `'right'` |
| `divider` | `divider` | class | 是否显示分割线，保持旧 API。 | `boolean` | `true` |
| `actions` | `actions` | footer slot | 是否显示默认 footer actions，保持旧 API。 | `boolean` | `true` |
| `icon` | `icon` + `iconName` | header slot | 旧布尔 + 图标名改为直接传图标。 | `IconName \| false` | `false` |
| `twoLevel` | `twoLevel` | header slot | 二级抽屉返回按钮，保持旧 API。 | `boolean` | `false` |
| `closeable` | `closeable` | `show-close` | 关闭按钮，保持旧 API。 | `boolean` | `true` |
| `handle` | `handle` | class / handle node | bottom drawer 拖拽视觉 handle，保持旧 API。 | `boolean` | `true` |
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
| `color` | `color` | CSS var | 保持旧/Figma API。内部映射颜色 token，旧 `grey` 不改名。 | `VisFeaturedIconColor` | `'brand'` |
| `type` | `type` | class | 视觉容器形态，保持旧/Figma API。 | `VisFeaturedIconType` | `'solid-round'` |
| `icon` | `icon` | icon slot | 图标名称。 | `IconName` | `'download-cloud-02'` |
| `label` | `label` | `aria-label` | 非 decorative 时作为可访问名称。 | `string` | `undefined` |
| `decorative` | `decorative` | `aria-hidden` | 装饰性图标。 | `boolean` | `true` |

## Form

旧项目无 Form 源码，Vision API 以 Figma `Form` 组件属性为兼容基线，并复用 Element Plus 校验能力。

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `model` | Figma data | `model` | 表单数据对象。 | `Record<string, any>` | `{}` |
| `rules` | Figma validation | `rules` | async-validator 校验规则。 | `VisFormRules` | `undefined` |
| `alignLeft` | `AlignLeft` | `label-position="left"` | 标签左置；关闭时标签位于字段上方。 | `boolean` | `false` |
| `column` | `Column` | wrapper grid | 一列或二列布局。 | `1 \| 2` | `1` |
| `button` | `Button` | actions/default slot | 展示由 `VisButton` 构成的默认操作组。 | `boolean` | `false` |
| `width` | component width | style | 覆盖宽度；一列默认 400px，二列默认 800px。 | `number \| string` | 按 `column` 推导 |
| `labelWidth` | left label width | `label-width` | 左侧标签宽度并向 FormItem 继承。 | `number \| string` | `84` |
| `submitText` | button label | actions slot | 默认确认按钮文案。 | `string` | `'确认'` |
| `cancelText` | button label | actions slot | 默认取消按钮文案。 | `string` | `'取消'` |
| `disabled` | `disabled` | `disabled` | 表单禁用上下文。 | `boolean` | `false` |
| `showMessage` | message visibility | `show-message` | 是否显示 Vision 校验信息。 | `boolean` | `true` |
| `validateOnRuleChange` | validation behavior | `validate-on-rule-change` | rules 变化后是否立即校验。 | `boolean` | `true` |
| `scrollToError` | validation behavior | `scroll-to-error` | 校验失败时滚动到首个错误项。 | `boolean` | `false` |
| `scrollIntoViewOptions` | validation behavior | `scroll-into-view-options` | 错误项滚动配置。 | `boolean \| ScrollIntoViewOptions` | `true` |
| `submit` | confirm action | native submit | 默认确认或原生提交事件。 | event | - |
| `cancel` | cancel action | 无直接对应 | 默认取消事件。 | event | - |
| `validate` | validation event | `validate` | 任一字段完成校验后触发。 | event | - |

## FormItem

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `prop` | field binding | `prop` | model 字段键名或路径。 | `string \| string[]` | `undefined` |
| `label` | label text | `label` | 标签文本。 | `string` | `'输入框'` |
| `type` | `Type` | wrapper class | Figma 字段类型，用于匹配引用组件尺寸。 | `VisFormItemType` | `'input'` |
| `alignLeft` | `AlignLeft` | `label-position` | 覆盖当前项标签位置。 | `boolean` | `undefined` |
| `labelWidth` | left label width | `label-width` | 覆盖当前项标签宽度。 | `number \| string` | `undefined` |
| `span` | form layout | wrapper grid | 二列布局中的占列数。 | `1 \| 2` | `1` |
| `required` | `Required` | `required` | 显示必填星号并参与规则校验。 | `boolean` | 按规则推导 |
| `optional` | `Optional` | label slot | 展示“(选填)”。 | `boolean` | `false` |
| `tooltip` | `Tooltip` | label slot | 使用 `VisTooltip` 和 `help-circle` 图标。 | `boolean` | `false` |
| `tooltipText` | tooltip content | label slot | 标签提示内容。 | `string` | `'提示信息'` |
| `description` | `Description` | 无直接对应 | 辅助说明；true 使用 Figma 默认文案。 | `boolean \| string` | `false` |
| `rules` | field rules | `rules` | 当前字段独立校验规则。 | `VisFormItemRule \| VisFormItemRule[]` | `undefined` |
| `error` | validation error | `error` | 直接设置错误文本和危险态。 | `string` | `''` |
| `showMessage` | message visibility | `show-message` | 覆盖当前项错误信息可见性。 | `boolean` | `undefined` |
| `validateStatus` | validation state | `validate-status` | 直接设置字段校验状态。 | `FormItemValidateState` | `undefined` |
| `for` | label target | `for` | 标签关联的原生控件 id。 | `string` | `undefined` |

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
| `valueText` | `valueText` | wrapper text | 非受控 `filled=true` 演示态的默认填充文案。 | `string` | `'已输入内容'` |
| `state` | `state` | class / validate state | 保持旧/Figma API。`error` 内部映射危险态或 Element validate state。 | `VisInputState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `filled` | `filled` | class | 填充背景样式。 | `boolean` | `false` |
| `prefix` | `prefix` | prefix slot visibility | 是否显示前缀图标，保持旧布尔 API。 | `boolean` | `false` |
| `suffix` | `suffix` | suffix slot visibility | 是否显示后缀图标，保持旧布尔 API。 | `boolean` | `false` |
| `prefixIcon` | `prefixIcon` | `prefix-icon` / slot | 前缀图标名；旧项目当前输入框已使用该名。 | `IconName` | `'user-01'` |
| `suffixIcon` | `suffixIcon` | `suffix-icon` / slot | 后缀图标名；旧项目当前输入框已使用该名。 | `IconName` | `'copy-03'` |
| `addonLeft` | `addonLeft` | prepend slot visibility | 是否显示前置 addon，保持旧 API。 | `boolean` | `false` |
| `addonRight` | `addonRight` | append slot visibility | 是否显示后置 addon，保持旧 API。 | `boolean` | `false` |
| `addonLeftText` | `addonLeftText` | prepend slot | 前置 addon 文案。 | `string` | `'http://'` |
| `addonRightText` | `addonRightText` | append slot | 后置 addon 文案。 | `string` | `'.com'` |
| `maxLength` | `maxLength` | `maxlength` / `show-word-limit` | `false` 表示不限制。 | `number \| false` | `false` |
| `type` | `type` | `type` | 原生 input 类型。 | `string` | `'text'` |
| `clear` / `focus` / `blur` | 同名 | `clear` / `focus` / `blur` | 事件保持。 | event | - |

## InputNumber

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 数字值。 | `number \| null` | `0` |
| `width` | `width` | style | 外层宽度。 | `number \| string` | `undefined` |
| `position` | `position` | `controls-position` | 控制器位置，保持旧 API。 | `'default' \| 'right'` | `'default'` |
| `rightControls` | `rightControls` | `controls-position="right"` | 是否使用右侧控制器，保持旧 API。 | `boolean` | `false` |
| `state` | `state` | class | 字段状态，保持旧 API。 | `VisFieldState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `readView` / `readview` | `readView` / `readview` | readonly wrapper | 兼容两个旧拼写。 | `boolean` | `false` |
| `prefixIcon` | `prefixIcon` | prefix slot visibility | 是否显示前缀图标，保持旧 API。 | `boolean` | `false` |
| `prefixIconName` | `prefixIconName` | prefix slot | 前缀图标名，保持旧 API。 | `IconName` | `'currency-yen'` |
| `suffixIcon` | `suffixIcon` | suffix slot visibility | 是否显示后缀图标，保持旧 API。 | `boolean` | `false` |
| `suffixIconName` | `suffixIconName` | suffix slot | 后缀图标名，保持旧 API。 | `IconName` | `'percent-02'` |
| `min` / `max` / `step` | 同名 | `min` / `max` / `step` | 数值边界和步进。 | `number` | `undefined` / `1` |
| `focus` / `blur` | 同名 | `focus` / `blur` | 事件保持。 | event | - |

## InputSearchBox

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 搜索值。 | `string` | `undefined` |
| `placeholder` | `placeholder` | `placeholder` | 占位文案。 | `string` | `'请输入关键字'` |
| `valueText` | `valueText` | wrapper text | 展示值，保持旧 API。 | `string` | `'关键字'` |
| `filled` | `filled` | class | 填充样式。 | `boolean` | `false` |
| `filter` | `filter` | suffix button | 过滤按钮，保持旧 API。 | `boolean` | `false` |
| `simple` | `simple` | class | 简洁样式。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `state` | `state` | class | 字段状态，保持旧 API。 | `VisFieldState` | `'default'` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `undefined` |
| `clear` / `filter` / `focus` | 同名 | handlers | 事件保持。 | event | - |

## InputTextarea

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 文本值。 | `string` | `undefined` |
| `placeholder` | `placeholder` | `placeholder` | 占位文案。 | `string` | `'请输入文字'` |
| `valueText` | `valueText` | wrapper text | 只读展示值，保持旧 API。 | `string` | sample text |
| `state` | `state` | class | 字段状态，保持旧 API。 | `VisFieldState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `filled` | `filled` | class | 填充样式。 | `boolean` | `false` |
| `readView` | `readView` | readonly wrapper | 只读展示态，保持旧 API。 | `boolean` | `false` |
| `maxLength` | `maxLength` | `maxlength` / `show-word-limit` | `false` 表示不限制。 | `number \| false` | `false` |
| `name` / `ariaLabel` | 同名 | DOM attr | 原生属性。 | `string` | `undefined` |
| `focus` / `blur` | 同名 | `focus` / `blur` | 事件保持。 | event | - |

## Loading

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `size` | `size` | 自研 | spinner 尺寸。 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'xs'` |
| `color` | `color` | CSS var | 保持旧/Figma API。`brand/grey/white/danger` 内部映射 loading 颜色 token。 | `VisLoadingColor` | `'brand'` |
| `text` | `text` | 自研 | 是否显示文字，保持旧/Figma API。 | `boolean` | `false` |
| `label` | `label` | text / aria-label | loading 文案。 | `string` | `'loading...'` |
| `decorative` | `decorative` | `aria-hidden` | 装饰性 loading。 | `boolean` | `false` |

## LoadingText

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `label` | Figma text | 自研 | 加载文案，配合 `atom-02` 图标和流光动效展示。 | `string` | `'正在思考...'` |
| `decorative` | 无 | `aria-hidden` | 标记为装饰内容；关闭时使用 `status` / `aria-live="polite"` 语义。 | `boolean` | `false` |
| `default` slot | Figma text | slot | 覆盖 `label` 展示自定义文案。 | slot | - |

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
| `type` | confirm `type` | class / icon | 确认弹窗状态，保持旧/Figma API。`confirm/info/success/warning/danger` 内部映射图标和色彩。 | `VisModalConfirmType` | `'confirm'` |
| `divider` | `divider` | class | 分割线，保持旧/Figma API。 | `boolean` | `true` |
| `footer` | `footer` | footer slot | 是否显示默认 footer。 | `boolean` | `true` |
| `icon` | `icon` | header icon slot | 图标区域。 | `IconName \| false` | `false` |
| `twoLevel` | `twoLevel` | header slot | 二级返回，保持旧/Figma API。 | `boolean` | `false` |
| `withMenu` | `withMenu` | side menu slot visibility | 是否显示左侧菜单，保持旧/Figma API。 | `boolean` | `false` |
| `menuItems` | `menuItems` | side menu data | 菜单数据。 | `VisModalMenuItem[]` | demo items |
| `activeMenuKey` | `activeMenuKey` | side menu active | 当前菜单项。 | `string` | `'overview'` |
| `closeable` | `closeable` | `show-close` | 关闭按钮，保持旧/Figma API。 | `boolean` | `true` |
| `width` / `height` | 同名 | `width` / body style | 尺寸。 | `number \| string` | `undefined` |
| `cancelText` / `confirmText` / `okText` | 同名 | footer buttons | 默认按钮文案。 | `string` | `'取消'` / `'确认'` / `'知道了'` |
| `close` / `cancel` / `confirm` / `back` / `menu-select` | 同名 | handlers | 事件保持。可额外支持 `menuSelect`，但 Figma/旧 API 主名为 `menu-select`。 | event | - |

## Notification

| API 名                               | 旧 API                                      | Element Plus API | 说明                                                                                                    | 类型                                             | 默认值                   |
| ----------------------------------- | ------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------- |
| `type`                              | `type`                                     | `type`           | 旧 API 与 Element Plus API 均为 `type`，因此 Vision 继续使用 `type`；`danger` 在 adapter 内映射 Element Plus `error`。 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'`              |
| `title`                             | `title`                                    | `title`          | 标题。                                                                                                   | `string`                                       | `undefined`           |
| `description`                       | `description`                              | `message`        | 描述内容。                                                                                                 | `string`                                       | `undefined`           |
| `actions`                           | `actions`                                  | action slot      | 是否显示默认操作，保持旧 API。                                                                                  | `boolean`                                      | `true`                |
| `closeable`                         | `closeable`                                | `show-close`     | 关闭按钮，保持旧 API。                                                                                        | `boolean`                                      | `true`                |
| `modelValue`                        | `modelValue`                               | visible state    | 组件式可见性。                                                                                               | `boolean`                                      | `true`                |
| `width`                             | `width`                                    | custom style     | 宽度。                                                                                                   | `number \| string`                             | `384`                 |
| `iconName`                          | `iconName`                                 | icon slot        | 通知图标，保持旧 API。                                                                                        | `IconName`                                     | `'download-cloud-01'` |
| `avatar`                            | `avatarImageVariant/avatarName/avatarTime` | avatar slot      | 用户通知头像信息，建议合并为对象。                                                                                     | `VisNotificationAvatar`                        | demo avatar           |
| `autoClose`                         | `autoClose`                                | `duration`       | 自动关闭。                                                                                                 | `boolean`                                      | `true`                |
| `action-primary` / `action-secondary` | `action-primary` / `action-secondary`    | action handlers  | 保持旧 kebab 事件；TS 类型可额外提供 camelCase。                                                               | event                                          | -                     |

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
| `actions` | `actions` | actions slot | 默认操作按钮，保持旧 API。 | `boolean` | `false` |
| `closeButton` | `closeButton` | close button | 关闭按钮，保持旧 API。 | `boolean` | `false` |
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
| `state` | `state` | class | hover 演示态，保持旧 API。 | `'default' \| 'hover'` | `'default'` |
| `radioButton` | `radioButton` | `ElRadioButton` | button radio 形态，保持旧 API。 | `boolean` | `false` |
| `label` | `label` | default slot visibility | 是否显示文本，保持旧 API。 | `boolean` | `true` |
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
| `hideScrollBar` | `hideScrollBar` | CSS | 隐藏滚动条，保持旧/Figma API。 | `boolean` | `true` |
| `default` slot | default slot | slot | 滚动内容。 | slot | - |

## Segmented

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 当前值。 | `string \| number` | `undefined` |
| `defaultValue` | `defaultValue` | initial value | 非受控初始值。 | `string \| number` | `undefined` |
| `options` | `options` | `options` | 选项。 | `VisSegmentedOption[]` | demo options |
| `size` | `size` | `size` / class | 尺寸。 | `'md' \| 'lg'` | `'md'` |
| `icon` | `icon` | option icon slot | 是否显示图标，保持旧 API。 | `boolean` | `true` |
| `text` | `text` | option label | 是否显示文字，保持旧 API。 | `boolean` | `true` |
| `disabled` | `disabled` | `disabled` | 整体禁用。 | `boolean` | `false` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `'分段控制器'` |
| `label` slot | `label` slot | option slot | 自定义选项 label。 | slot | - |
| `change` | `change` | `change` | 事件保持。 | event | - |

## Select

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 选择值。 | `VisSelectValue \| VisSelectValue[] \| null` | `undefined` |
| `options` | `options` | `ElOption` data | 选项。 | `VisSelectOption[]` | demo options |
| `type` | `type` | class / multiple | `default/customize` 为视觉形态，保持旧 API；`multiSelect` 才是多选行为。 | `VisSelectType` | `'default'` |
| `state` | `state` | class / validate state | 字段状态，保持旧 API。 | `VisFieldState` | `'default'` |
| `placeholder` | `placeholder` | `placeholder` | 占位。 | `string` | `'请选择'` |
| `prefix` | `prefix` | prefix slot visibility | 是否显示前置图标，保持旧 API。 | `boolean` | `false` |
| `prefixIcon` | `prefixIcon` | prefix slot | 前置图标名，保持旧 API。 | `IconName` | `'user-01'` |
| `multiSelect` | `multiSelect` | `multiple` | 多选，保持旧 API。 | `boolean` | `false` |
| `filterable` | `filterable` | `filterable` | 可搜索。 | `boolean` | `false` |
| `readView` | `readView` | readonly wrapper | 只读展示，保持旧 API。 | `boolean` | `false` |
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
| `type` | `type` | `format` | 时间格式，保持旧项目与 Figma 的枚举；适配 Element Plus 时分别映射为 `HH:mm:ss` 和 `HH:mm`。 | `'HH MM SS' \| 'HH MM'` | `'HH MM SS'` |
| `timeSelect` | `timeSelect` | picker type | 是否时间选择模式。 | `boolean` | `false` |
| `state` | `state` | class | 字段状态，保持旧 API。 | `VisFieldState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `readView` | `readView` | readonly wrapper | 只读展示，保持旧 API。 | `boolean` | `false` |
| `placeholder` | `placeholder` | `placeholder` | 单值占位。 | `string` | `'请选择时间'` |
| `startPlaceholder` / `endPlaceholder` | 同名 | range placeholders | 范围占位。 | `string` | `'选择开始时间'` / `'选择结束时间'` |
| `open` | `open` | visible | 受控打开。 | `boolean` | `undefined` |
| `change` / `clear` / `update:open` | 同名 | events | 事件保持。 | event | - |

## Toggle

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | `model-value` | 开关值。 | `boolean` | `false` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `state` | `state` | `loading` / class | 保持旧 API。`state="loading"` 内部映射 loading 行为，其余值映射视觉态。 | `VisToggleState` | `'default'` |
| `icon` | `icon` | active/inactive icons | 是否显示图标，保持旧 API。 | `boolean` | `false` |
| `text` | `text` | active/inactive text | 是否显示文字，保持旧 API。 | `boolean` | `false` |
| `id` / `name` / `value` | 同名 | DOM attr | 表单属性。 | `string \| number \| boolean` | `undefined` |
| `ariaLabel` | `ariaLabel` | `aria-label` | 可访问名称。 | `string` | `undefined` |
| `change` | `change` | `change` | 事件保持。 | event | - |

## ToggleButton

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `modelValue` | `modelValue` | 自研 pressed state | 受控按下状态。 | `boolean` | `undefined` |
| `defaultPressed` | `defaultPressed` | initial state | 非受控初始状态。 | `boolean` | `false` |
| `size` | `size` | class | 尺寸。 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `state` | `state` | class | 视觉态，保持旧 API。 | `VisToggleButtonState` | `'default'` |
| `disabled` | `disabled` | `disabled` | 禁用。 | `boolean` | `false` |
| `iconOnly` | `iconOnly` | aria-label | 仅图标按钮。 | `boolean` | `false` |
| `prefix` | `prefix` | icon slot visibility | 是否显示前置图标，保持旧 API。 | `boolean` | `false` |
| `suffix` | `suffix` | icon slot visibility | 是否显示后置图标，保持旧 API。 | `boolean` | `false` |
| `iconName` | `iconName` | icon slot | 前置图标名，保持旧 API。 | `IconName` | `'plus'` |
| `suffixIconName` | `suffixIconName` | icon slot | 后置图标名，保持旧 API。 | `IconName` | `'chevron-down'` |
| `label` | `label` | default slot | 文案。 | `string` | `undefined` |
| `htmlType` | `htmlType` | native button type | 原生类型，保持旧 API。 | `'button' \| 'submit' \| 'reset'` | `'button'` |
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

## Figma API 对齐清单

当前策略是不要求 Figma 设计稿批量改名。Figma 中已经存在的旧 API 名默认保持不变，Vision 组件实现负责在内部映射到 Element Plus 或 Vision token。只有在旧 API 明显无法表达组件能力、与 Vue 标准事件冲突、或确认为拼写错误时，才补充新别名。

### 优先保持不变

| 组件 | Figma / 旧 API | Vision 主 API | 备注 |
| --- | --- | --- | --- |
| Badge | `colorType` / `type` / `solid` / `subtle` / `iconName` | 同名 | 已迁移组件按旧 API 实现。 |
| Loading | `color` / `text` | 同名 | 已迁移组件按旧 API 实现。 |
| Button | `variant` / `danger` / `state` / `prefix` / `suffix` / `iconName` / `suffixIconName` / `htmlType` | 同名 | `danger`、`state`、`htmlType` 不再要求改成 `tone`、`visualState`、`nativeType`。 |
| Input | `valueText` / `state` / `addonLeft` / `addonRight` / `addonLeftText` / `addonRightText` | 同名 | Input 与 Input Password 已按 Figma 移除 `readView`，不再支持 `readonlyView` 别名。 |
| Modal | `divider` / `twoLevel` / `withMenu` / `closeable` / `menu-select` | 同名 | `closable`、`showBack`、`menuSelect` 只可作为兼容别名。 |
| FeaturedIcon | `color` / `type` | 同名 | 不再要求改为 `tone` / `variant`。 |
| CodeBlock | `type` / `heading` / `copy` | 同名 | 不再要求改为 `variant` / `showHeader` / `copyable`。 |
| ScrollShadow | `hideScrollBar` | 同名 | 保留旧 camelCase。 |
| Alert / Message / Notification / Tag | `type` | 同名 | 旧 API 与 Element Plus 主 API 一致，保持不变。 |
| 通用表单项 | `modelValue` / `disabled` / `placeholder` / `size` / `width` / `height` | 同名 | Vue 和 Element Plus 生态通用 API 保持不变。 |

### 可新增别名但不要求 Figma 修改

| 组件                                       | 旧 API                                            | 可选别名                                          | 使用规则                                            |
| ---------------------------------------- | ------------------------------------------------ | --------------------------------------------- | ----------------------------------------------- |
| Button                                   | `htmlType`                                       | `nativeType`                                  | 代码侧如需贴近 Element Plus 可支持别名；Figma 仍用 `htmlType`。 |
| Modal / Drawer / Alert / Notification    | `closeable`                                      | `closable`                                    | 可支持 Element/Vue 社区常见拼写；Figma 仍用 `closeable`。    |
| Select / TimePicker                      | `readView`                                       | `readonlyView`                                | 仅作为可选语义别名；Input、Input Password 和 DatePicker 已按 Figma 移除此 prop。 |
| 事件                                       | `menu-select` / `after-leave` / `action-primary` | `menuSelect` / `afterLeave` / `actionPrimary` | Vue 模板优先 kebab-case，TS emit 类型可额外声明 camelCase。  |
| 色彩类 API                                  | `color` / `colorType`                            | `tone`                                        | 只作为内部 token 概念或未来新增 API；不作为迁移期主 API。            |
| 状态类 API                                  | `state`                                          | `status` / `visualState`                      | 只作为内部分类概念；旧 `state` 继续作为 public API。            |

## 类型命名规则

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| `Vis*Type` | `Leo*Type` | Element `type` / class | 当 public API 保留 `type` 时，类型也优先保留 `Type` 命名，即使内部是自研 class。 | type alias | - |
| `Vis*State` | `Leo*State` | class / validate state | 当 public API 保留 `state` 时，类型保留 `State` 命名；内部可再细分 status 或 visual state。 | type alias | - |
| `Vis*Color` / `Vis*ColorType` | `Leo*Color` / `Leo*ColorType` | CSS var / token | 当 public API 为 `color` 或 `colorType` 时，类型名跟随 public API。 | type alias | - |
| `Vis*Variant` / `Vis*Status` / `Vis*VisualState` | 无或新增别名 | class / validate state | 仅用于没有旧 API 约束的新组件，或作为内部 adapter 类型，不作为默认迁移命名。 | type alias | - |
| `IconName` | `IconName` | 自研 icon registry | 图标类型保持原名。 | type alias | - |

## 验收要求

| API 名 | 旧 API | Element Plus API | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| API 对照表 | 旧组件 props/events/slots | Element Plus props/events/slots | 每个迁移组件文档必须包含本文件同结构表格。 | markdown | 必填 |
| Adapter | 旧 API alias | `elProps` | 基于 Element Plus 的组件必须有 `*.adapter.ts`，Vision API 覆盖冲突的 `elProps`。 | source file | 必填 |
| Token 检查 | `--leo-*` / 旧 token | `--el-*` | 样式必须落到 `--vis-*` 或 Vision token，Element Plus 变量统一从 `element-plus.css` 映射。 | CSS | 必填 |
| 构建检查 | 旧导出 | package exports | 迁移后需要 root export、subpath export、library entry、style import。 | build | 必填 |
