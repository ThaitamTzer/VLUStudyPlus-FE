import { useCallback, useState } from 'react'

import { IconButton, Menu } from '@mui/material'

import Iconify from './iconify'

type RowActionProps = {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}

export default function RowAction({ children, size }: RowActionProps) {
  const [isOpen, setOpen] = useState<null | HTMLElement>(null)

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(null)
  }, [])

  return (
    <>
      <IconButton onClick={handleOpen} size={size || 'medium'}>
        <Iconify icon='eva:more-vertical-fill' />
      </IconButton>
      <Menu
        anchorEl={isOpen}
        open={Boolean(isOpen)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        slotProps={{
          paper: {
            sx: {
              width: 'fit-content'
            }
          }
        }}
      >
        {children}
      </Menu>
    </>
  )
}
