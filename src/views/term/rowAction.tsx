'use client'

import { useCallback, useState } from 'react'

import { IconButton, Menu, MenuItem } from '@mui/material'

import Iconify from '@/components/iconify'

import type { Term } from '@/types/management/termType'
import { useTermStore } from '@/stores/term/term'

type RowActionProps = {
  term: Term
}

export default function RowAction({ term }: RowActionProps) {
  const [isOpen, setOpen] = useState<null | HTMLElement>(null)
  const { toogleDeleteTerm, toogleUpdateTerm } = useTermStore()

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(null)
  }, [])

  return (
    <>
      <IconButton onClick={handleOpen}>
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
              width: 'f'
            }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            toogleUpdateTerm()
            useTermStore.getState().setTerm(term)
          }}
        >
          <Iconify icon='solar:pen-2-linear' />
          Sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            toogleDeleteTerm()
            useTermStore.getState().setTerm(term)
          }}
        >
          <Iconify icon='solar:trash-bin-trash-outline' />
          Xóa
        </MenuItem>
      </Menu>
    </>
  )
}
