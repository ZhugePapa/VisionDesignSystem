import type { App, Plugin } from 'vue'

import VisAlert from './components/alert/VisAlert.vue'
import VisAccordion from './components/accordion/VisAccordion.vue'
import VisAccordionItem from './components/accordion/VisAccordionItem.vue'
import { VisAvatar, VisAvatarGroup, VisAvatarLabel } from './components/avatar'
import VisBadge from './components/badge/VisBadge.vue'
import VisBreadcrumb from './components/breadcrumb/VisBreadcrumb.vue'
import VisButton from './components/button/VisButton.vue'
import VisCheckbox from './components/checkbox/VisCheckbox.vue'
import VisCheckboxGroup from './components/checkbox/VisCheckboxGroup.vue'
import VisCodeBlock from './components/code-block/VisCodeBlock.vue'
import VisConfigProvider from './components/config-provider/VisConfigProvider.vue'
import VisDatePicker from './components/date-picker/VisDatePicker.vue'
import { VisDescription, VisDescriptionItem, VisDescriptionTitle } from './components/description'
import VisDivider from './components/divider/VisDivider.vue'
import VisDrawer from './components/drawer/VisDrawer.vue'
import { VisDropdown, VisDropdownDivider, VisDropdownHeader, VisDropdownItem } from './components/dropdown'
import { VisFeaturedIcon } from './components/featured-icon'
import { VisForm, VisFormItem } from './components/form'
import VisInput from './components/input/VisInput.vue'
import VisInputNumber from './components/input-number/VisInputNumber.vue'
import VisInputSearchBox from './components/input-search-box/VisInputSearchBox.vue'
import VisInputTextarea from './components/input-textarea/VisInputTextarea.vue'
import VisLoading from './components/loading/VisLoading.vue'
import { VisMarkdown } from './components/markdown'
import VisMessage from './components/message/VisMessage.vue'
import VisModal from './components/modal/VisModal.vue'
import VisModalConfirm from './components/modal/VisModalConfirm.vue'
import VisNotification from './components/notification/VisNotification.vue'
import VisPagination from './components/pagination/VisPagination.vue'
import VisPopover from './components/popover/VisPopover.vue'
import { VisProgressBar, VisProgressBarMultiple } from './components/progress-bar'
import { VisProgressCircle } from './components/progress-circle'
import VisRadio from './components/radio/VisRadio.vue'
import VisRadioGroup from './components/radio/VisRadioGroup.vue'
import VisRate from './components/rate/VisRate.vue'
import VisScrollShadow from './components/scroll-shadow/VisScrollShadow.vue'
import VisSegmented from './components/segmented/VisSegmented.vue'
import VisSelect from './components/select/VisSelect.vue'
import { VisSlider } from './components/slider'
import VisTabs from './components/tabs/VisTabs.vue'
import {
  VisTable,
  VisTableHeader,
  VisTableItem,
  VisTableLink,
  VisTableRow,
  VisTableSortIcon,
  VisTableTreePrefix,
  VisTableTrendIcon,
} from './components/table'
import VisTag from './components/tag/VisTag.vue'
import VisTimePicker from './components/time-picker/VisTimePicker.vue'
import VisToggle from './components/toggle/VisToggle.vue'
import VisToggleButton from './components/toggle-button/VisToggleButton.vue'
import VisTooltip from './components/tooltip/VisTooltip.vue'
import VisTreeView from './components/tree-view/VisTreeView.vue'
import VisUpload from './components/upload/VisUpload.vue'
import { Icon } from './components/icons'
import './styles/style.css'

export {
  Icon,
  VisAccordion,
  VisAccordionItem,
  VisAlert,
  VisAvatar,
  VisAvatarGroup,
  VisAvatarLabel,
  VisBadge,
  VisBreadcrumb,
  VisButton,
  VisCheckbox,
  VisCheckboxGroup,
  VisCodeBlock,
  VisConfigProvider,
  VisDatePicker,
  VisDescription,
  VisDescriptionItem,
  VisDescriptionTitle,
  VisDivider,
  VisDrawer,
  VisDropdown,
  VisDropdownDivider,
  VisDropdownHeader,
  VisDropdownItem,
  VisFeaturedIcon,
  VisForm,
  VisFormItem,
  VisInput,
  VisInputNumber,
  VisInputSearchBox,
  VisInputTextarea,
  VisLoading,
  VisMarkdown,
  VisMessage,
  VisModal,
  VisModalConfirm,
  VisNotification,
  VisPagination,
  VisPopover,
  VisProgressBar,
  VisProgressBarMultiple,
  VisProgressCircle,
  VisRadio,
  VisRadioGroup,
  VisRate,
  VisScrollShadow,
  VisSegmented,
  VisSelect,
  VisSlider,
  VisTabs,
  VisTable,
  VisTableHeader,
  VisTableItem,
  VisTableLink,
  VisTableRow,
  VisTableSortIcon,
  VisTableTreePrefix,
  VisTableTrendIcon,
  VisTag,
  VisTimePicker,
  VisToggle,
  VisToggleButton,
  VisTooltip,
  VisTreeView,
  VisUpload,
}
export type {
  VisAccordionItemData,
  VisAccordionItemKey,
  VisAccordionItemProps,
  VisAccordionProps,
} from './components/accordion/accordion.types'
export type { VisAlertProps, VisAlertType } from './components/alert/alert.types'
export type {
  VisAvatarBadge,
  VisAvatarGroupItem,
  VisAvatarGroupProps,
  VisAvatarGroupShape,
  VisAvatarGroupSize,
  VisAvatarImageVariant,
  VisAvatarLabelAlign,
  VisAvatarLabelProps,
  VisAvatarProps,
  VisAvatarRealImageVariant,
  VisAvatarSize,
  VisAvatarState,
  VisAvatarType,
} from './components/avatar/avatar.types'
export { resolveVisAvatarImage, visAvatarImageMap, visAvatarImageVariants } from './components/avatar'
export type { VisBadgeColorType, VisBadgeProps, VisBadgeType } from './components/badge/badge.types'
export type {
  VisBreadcrumbItem,
  VisBreadcrumbProps,
  VisBreadcrumbSeparator,
  VisBreadcrumbSize,
  VisBreadcrumbType,
} from './components/breadcrumb/breadcrumb.types'
export type {
  VisButtonProps,
  VisButtonSize,
  VisButtonState,
  VisButtonVariant,
} from './components/button/button.types'
export type {
  VisCheckboxGroupAlign,
  VisCheckboxGroupProps,
  VisCheckboxOption,
  VisCheckboxProps,
  VisCheckboxState,
  VisCheckboxValue,
} from './components/checkbox/checkbox.types'
export type { VisCodeBlockProps, VisCodeBlockType } from './components/code-block/code-block.types'
export type { VisConfigProviderProps, VisTheme } from './components/config-provider/config-provider.types'
export type {
  VisDatePickerProps,
  VisDatePickerRangeValue,
  VisDatePickerShortcut,
  VisDatePickerSingleValue,
  VisDatePickerState,
  VisDatePickerValue,
} from './components/date-picker/date-picker.types'
export type {
  VisDescriptionDirection,
  VisDescriptionItemProps,
  VisDescriptionItemType,
  VisDescriptionProps,
  VisDescriptionTag,
  VisDescriptionTitleProps,
} from './components/description/description.types'
export type {
  VisDividerOrientation,
  VisDividerProps,
  VisDividerType,
} from './components/divider/divider.types'
export type { VisDrawerPosition, VisDrawerProps } from './components/drawer/drawer.types'
export type {
  VisDropdownEntry,
  VisDropdownHeaderProps,
  VisDropdownHeaderType,
  VisDropdownItemProps,
  VisDropdownItemState,
  VisDropdownItemType,
  VisDropdownProps,
  VisDropdownTrigger,
} from './components/dropdown/dropdown.types'
export type {
  VisFeaturedIconColor,
  VisFeaturedIconProps,
  VisFeaturedIconSize,
  VisFeaturedIconType,
} from './components/featured-icon/featured-icon.types'
export type {
  VisFormColumn,
  VisFormItemProp,
  VisFormItemProps,
  VisFormItemRule,
  VisFormItemSpan,
  VisFormItemType,
  VisFormItemValidateState,
  VisFormProps,
  VisFormRules,
  VisFormValidateCallback,
  VisFormValidationResult,
} from './components/form/form.types'
export type { IconComponentProps, IconName } from './components/icons'
export type { VisInputProps, VisInputState } from './components/input/input.types'
export type {
  VisInputNumberPosition,
  VisInputNumberProps,
  VisInputNumberState,
} from './components/input-number/input-number.types'
export type { VisInputSearchBoxProps, VisInputSearchBoxState } from './components/input-search-box/input-search-box.types'
export type { VisInputTextareaProps, VisInputTextareaState } from './components/input-textarea/input-textarea.types'
export type { VisLoadingColor, VisLoadingProps, VisLoadingSize } from './components/loading/loading.types'
export type {
  VisMarkdownComponentMap,
  VisMarkdownIncompleteType,
  VisMarkdownStreamingOption,
  VisMarkdownStreamStatus,
  VisMarkdownTailConfig,
  VisMarkdownTheme,
} from './components/markdown'
export type { VisMessageProps, VisMessageType } from './components/message/message.types'
export type {
  VisModalConfirmProps,
  VisModalConfirmType,
  VisModalMenuItem,
  VisModalProps,
} from './components/modal/modal.types'
export type { VisNotificationProps, VisNotificationType } from './components/notification/notification.types'
export type { VisPaginationProps, VisPaginationSize } from './components/pagination/pagination.types'
export type { VisPopoverPosition, VisPopoverProps, VisPopoverTrigger } from './components/popover/popover.types'
export type {
  VisProgressBarColor,
  VisProgressBarLabel,
  VisProgressBarMultipleProps,
  VisProgressBarProps,
  VisProgressBarSegment,
  VisProgressBarStatus,
} from './components/progress-bar/progress-bar.types'
export type {
  VisProgressCircleProps,
  VisProgressCircleSize,
  VisProgressCircleStatus,
} from './components/progress-circle/progress-circle.types'
export type {
  VisRadioGroupAlign,
  VisRadioGroupProps,
  VisRadioOption,
  VisRadioProps,
  VisRadioState,
  VisRadioValue,
} from './components/radio/radio.types'
export type { VisRateProps } from './components/rate/rate.types'
export type {
  VisScrollShadowOrientation,
  VisScrollShadowProps,
  VisScrollShadowVariant,
} from './components/scroll-shadow/scroll-shadow.types'
export type {
  VisSegmentedOption,
  VisSegmentedProps,
  VisSegmentedSize,
  VisSegmentedValue,
} from './components/segmented/segmented.types'
export type {
  VisSelectModelValue,
  VisSelectOption,
  VisSelectProps,
  VisSelectState,
  VisSelectType,
  VisSelectValue,
} from './components/select/select.types'
export type { VisSliderProps, VisSliderType, VisSliderValue } from './components/slider/slider.types'
export type { VisTabsAlign, VisTabsItem, VisTabsProps, VisTabsValue } from './components/tabs/tabs.types'
export type {
  VisTableAction,
  VisTableAlign,
  VisTableAppearance,
  VisTableColumn,
  VisTableDefaultSortOrder,
  VisTableFixed,
  VisTableHeaderProps,
  VisTableHeaderType,
  VisTableItemProps,
  VisTableItemPropsResolver,
  VisTableItemType,
  VisTableLinkProps,
  VisTableProps,
  VisTableRowData,
  VisTableRowKey,
  VisTableRowProps,
  VisTableSort,
  VisTableSortIconProps,
  VisTableSortOrder,
  VisTableSortable,
  VisTableSortChange,
  VisTableState,
  VisTableTreeLevel,
  VisTableTreePrefixProps,
  VisTableTrend,
  VisTableTrendIconProps,
} from './components/table/table.types'
export type { VisTagAvatarVariant, VisTagCloseState, VisTagProps, VisTagType } from './components/tag/tag.types'
export type {
  VisTimePickerProps,
  VisTimePickerRangeValue,
  VisTimePickerSingleValue,
  VisTimePickerState,
  VisTimePickerType,
  VisTimePickerValue,
} from './components/time-picker/time-picker.types'
export type { VisToggleChangePayload, VisToggleProps, VisToggleState } from './components/toggle/toggle.types'
export type {
  VisToggleButtonNativeType,
  VisToggleButtonProps,
  VisToggleButtonSize,
  VisToggleButtonState,
} from './components/toggle-button/toggle-button.types'
export type { VisTooltipPosition, VisTooltipProps, VisTooltipTrigger } from './components/tooltip/tooltip.types'
export type {
  VisTreeViewFolderType,
  VisTreeViewItem,
  VisTreeViewKey,
  VisTreeViewProps,
} from './components/tree-view/tree-view.types'
export type { VisUploadFileItem, VisUploadFileStatus, VisUploadProps, VisUploadType } from './components/upload/upload.types'

const components = [
  VisConfigProvider,
  VisAccordion,
  VisAccordionItem,
  VisAlert,
  VisAvatar,
  VisAvatarGroup,
  VisAvatarLabel,
  VisBadge,
  VisBreadcrumb,
  VisButton,
  VisCheckbox,
  VisCheckboxGroup,
  VisDatePicker,
  VisDescription,
  VisDescriptionItem,
  VisDescriptionTitle,
  VisDivider,
  VisDrawer,
  VisDropdown,
  VisDropdownDivider,
  VisDropdownHeader,
  VisDropdownItem,
  VisForm,
  VisFormItem,
  VisInput,
  VisInputNumber,
  VisInputSearchBox,
  VisInputTextarea,
  VisLoading,
  VisMarkdown,
  VisMessage,
  VisModal,
  VisModalConfirm,
  VisNotification,
  VisPagination,
  VisPopover,
  VisProgressBar,
  VisProgressBarMultiple,
  VisProgressCircle,
  VisRadio,
  VisRadioGroup,
  VisRate,
  Icon,
  VisFeaturedIcon,
  VisScrollShadow,
  VisSegmented,
  VisSelect,
  VisSlider,
  VisTabs,
  VisTag,
  VisTimePicker,
  VisToggle,
  VisToggleButton,
  VisTooltip,
  VisTreeView,
  VisUpload,
  VisCodeBlock,
]

const VisionDesignSystem: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name ?? '', component)
    })
  },
}

export default VisionDesignSystem
