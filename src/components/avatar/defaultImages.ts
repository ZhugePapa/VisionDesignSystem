import avatar01 from '../../assets/avatars/avatar-01.png'
import avatar02 from '../../assets/avatars/avatar-02.png'
import avatar03 from '../../assets/avatars/avatar-03.png'
import avatar04 from '../../assets/avatars/avatar-04.png'
import avatar05 from '../../assets/avatars/avatar-05.png'
import avatar06 from '../../assets/avatars/avatar-06.png'
import avatar07 from '../../assets/avatars/avatar-07.png'
import avatar08 from '../../assets/avatars/avatar-08.png'
import avatar09 from '../../assets/avatars/avatar-09.png'
import type { VisAvatarImageVariant, VisAvatarRealImageVariant } from './avatar.types'

export const visAvatarImageMap: Record<VisAvatarRealImageVariant, string> = {
  '01': avatar01,
  '02': avatar02,
  '03': avatar03,
  '04': avatar04,
  '05': avatar05,
  '06': avatar06,
  '07': avatar07,
  '08': avatar08,
  '09': avatar09,
}

export const visAvatarImageVariants = Object.keys(visAvatarImageMap) as VisAvatarRealImageVariant[]

export function resolveVisAvatarImage(variant: VisAvatarImageVariant): string | undefined {
  if (variant === '00') return undefined
  return visAvatarImageMap[variant]
}
