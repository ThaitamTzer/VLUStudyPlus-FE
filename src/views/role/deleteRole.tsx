'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Typography } from '@mui/material'
import Iconify from '@/components/iconify'

import { useRoleStore } from '@/stores/role/role'
import roleService from '@/services/role.service'
import { KeyedMutator } from 'swr'
import { RoleType, Role } from '@/types/management/roleType'

type DeleteRoleProps = {
  mutate: KeyedMutator<RoleType>
}

export default function DeleteRole(prop: DeleteRoleProps) {
  const { mutate } = prop
  const [loading, setLoading] = useState<boolean>(false)
  const { openDeleteRoleModal, toogleDeleteRoleModal, role, setRole } = useRoleStore()

  const handleClose = () => {
    toogleDeleteRoleModal()
    setRole({} as Role)
  }

  const handleDeleteRole = async () => {
    setLoading(true)
    await roleService.delete(
      role._id,
      () => {
        mutate()
        toast.success('Xóa vai trò thành công')
        setLoading(false)
        handleClose()
      },
      error => {
        setLoading(false)
        toast.error(error.response.data.message)
        handleClose()
      }
    )
  }

  return (
    <Dialog open={openDeleteRoleModal} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {' '}
        <Typography variant='h4'>Xóa vai trò</Typography>
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8
        }}
      >
        <Iconify icon='material-symbols:close-rounded' />
      </IconButton>
      <DialogContent>
        <Typography variant='body1'>
          Bạn có chắc chắn muốn xóa vai trò <strong>{role.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={loading} onClick={handleClose} variant='outlined'>
          Hủy
        </LoadingButton>
        <LoadingButton loading={loading} onClick={handleDeleteRole} variant='contained' color='error'>
          Xóa
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
