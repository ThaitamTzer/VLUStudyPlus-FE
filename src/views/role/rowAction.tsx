'use client'

import { useCallback, useState } from 'react'

import { Menu, MenuItem, IconButton, Typography } from '@mui/material'

import { useRoleStore } from '@/stores/role/role'
import Iconify from '@/components/iconify'
import type { Role } from '@/types/management/roleType'

export default function RowAction({ role }: { role: Role }) {
  const [isOpen, setOpen] = useState<null | HTMLElement>(null)
  const { toogleEditRoleModal, toogleDeleteRoleModal } = useRoleStore()

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
              width: 120
            }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            toogleEditRoleModal()
            useRoleStore.getState().setRole(role)
          }}
        >
          <Iconify icon='solar:pen-2-linear' />
          <Typography variant='body1' sx={{ ml: 1 }}>
            Sửa
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            toogleDeleteRoleModal()
            useRoleStore.getState().setRole(role)
          }}
        >
          <Iconify icon='solar:trash-bin-trash-outline' />
          <Typography variant='body1' sx={{ ml: 1 }}>
            Xóa
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
