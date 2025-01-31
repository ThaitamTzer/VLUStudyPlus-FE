// ** Icon Imports
import type { IconProps } from '@iconify/react'
import { Icon } from '@iconify/react'

const Iconify = ({ icon, ...rest }: IconProps) => {
  return <Icon icon={icon} fontSize='1.375rem' {...rest} />
}

export default Iconify
