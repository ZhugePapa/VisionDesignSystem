import type { App, Plugin } from 'vue'

import VisButton from './components/button/VisButton.vue'
import VisCodeBlock from './components/code-block/VisCodeBlock.vue'
import VisConfigProvider from './components/config-provider/VisConfigProvider.vue'
import { VisFeaturedIcon } from './components/featured-icon'
import VisInput from './components/input/VisInput.vue'
import VisModal from './components/modal/VisModal.vue'
import VisModalConfirm from './components/modal/VisModalConfirm.vue'
import VisScrollShadow from './components/scroll-shadow/VisScrollShadow.vue'
import { Icon } from './components/icons'
import './styles/style.css'

export {
  Icon,
  VisButton,
  VisCodeBlock,
  VisConfigProvider,
  VisFeaturedIcon,
  VisInput,
  VisModal,
  VisModalConfirm,
  VisScrollShadow,
}
export type {
  VisButtonProps,
  VisButtonSize,
  VisButtonState,
  VisButtonVariant,
} from './components/button/button.types'
export type { VisCodeBlockProps, VisCodeBlockType } from './components/code-block/code-block.types'
export type { VisConfigProviderProps, VisTheme } from './components/config-provider/config-provider.types'
export type {
  VisFeaturedIconColor,
  VisFeaturedIconProps,
  VisFeaturedIconSize,
  VisFeaturedIconType,
} from './components/featured-icon/featured-icon.types'
export type { IconComponentProps, IconName } from './components/icons'
export type { VisInputProps, VisInputState } from './components/input/input.types'
export type {
  VisModalConfirmProps,
  VisModalConfirmType,
  VisModalMenuItem,
  VisModalProps,
} from './components/modal/modal.types'
export type {
  VisScrollShadowOrientation,
  VisScrollShadowProps,
  VisScrollShadowVariant,
} from './components/scroll-shadow/scroll-shadow.types'

const components = [
  VisConfigProvider,
  VisButton,
  VisInput,
  VisModal,
  VisModalConfirm,
  Icon,
  VisFeaturedIcon,
  VisScrollShadow,
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
