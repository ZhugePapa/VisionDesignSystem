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
import VisDivider from './components/divider/VisDivider.vue'
import VisDrawer from './components/drawer/VisDrawer.vue'
import { VisDropdown, VisDropdownDivider, VisDropdownHeader, VisDropdownItem } from './components/dropdown'
import { VisFeaturedIcon } from './components/featured-icon'
import VisInput from './components/input/VisInput.vue'
import VisLoading from './components/loading/VisLoading.vue'
import VisModal from './components/modal/VisModal.vue'
import VisModalConfirm from './components/modal/VisModalConfirm.vue'
import VisRadio from './components/radio/VisRadio.vue'
import VisRadioGroup from './components/radio/VisRadioGroup.vue'
import VisScrollShadow from './components/scroll-shadow/VisScrollShadow.vue'
import VisTag from './components/tag/VisTag.vue'
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
  VisDivider,
  VisDrawer,
  VisDropdown,
  VisDropdownDivider,
  VisDropdownHeader,
  VisDropdownItem,
  VisFeaturedIcon,
  VisInput,
  VisLoading,
  VisModal,
  VisModalConfirm,
  VisRadio,
  VisRadioGroup,
  VisScrollShadow,
  VisTag,
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
  VisDividerOrientation,
  VisDividerProps,
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
export type { IconComponentProps, IconName } from './components/icons'
export type { VisInputProps, VisInputState } from './components/input/input.types'
export type { VisLoadingColor, VisLoadingProps, VisLoadingSize } from './components/loading/loading.types'
export type {
  VisModalConfirmProps,
  VisModalConfirmType,
  VisModalMenuItem,
  VisModalProps,
} from './components/modal/modal.types'
export type {
  VisRadioGroupAlign,
  VisRadioGroupProps,
  VisRadioOption,
  VisRadioProps,
  VisRadioState,
  VisRadioValue,
} from './components/radio/radio.types'
export type {
  VisScrollShadowOrientation,
  VisScrollShadowProps,
  VisScrollShadowVariant,
} from './components/scroll-shadow/scroll-shadow.types'
export type { VisTagAvatarVariant, VisTagCloseState, VisTagProps, VisTagType } from './components/tag/tag.types'

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
  VisDivider,
  VisDrawer,
  VisDropdown,
  VisDropdownDivider,
  VisDropdownHeader,
  VisDropdownItem,
  VisInput,
  VisLoading,
  VisModal,
  VisModalConfirm,
  VisRadio,
  VisRadioGroup,
  Icon,
  VisFeaturedIcon,
  VisScrollShadow,
  VisTag,
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
