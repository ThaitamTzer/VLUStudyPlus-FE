'use client'

import Iconify from '@/components/iconify'
import { useRoleStore } from '@/stores/role/role'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Stack,
  IconButton,
  MenuItem,
  Box,
  Chip
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useForm, Controller } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import permission from '@/libs/permission.json'
import CustomTextField from '@/@core/components/mui/TextField'
import roleService from '@/services/role.service'
import { KeyedMutator } from 'swr'
import { RoleType } from '@/types/management/roleType'
import { useState } from 'react'
import { toast } from 'react-toastify'

type AddRoleProp = {
  mutate: KeyedMutator<RoleType>
}

const renderValue = (value: unknown) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {(value as string[]).map((item, index) => (
        <Chip
          key={index}
          sx={{
            margin: 0.5,
            bgcolor: permission.find(i => i.id === Number(item))?.color.action_color + '3D',
            color: permission.find(i => i.id === Number(item))?.color.action_color
          }}
          label={permission.find(i => i.id === Number(item))?.namePermission.toLocaleUpperCase()}
        />
      ))}
    </Box>
  )
}

const schema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty('Tên vai trò là bắt buộc'),
    v.minLength(3, 'Tên vai trò phải có ít nhất 3 ký tự'),
    v.maxLength(50, 'Tên vai trò không được vượt quá 50 ký tự')
  ),
  permissionID: v.pipe(
    v.array(v.number()),
    v.nonEmpty('Phải chọn ít nhất một quyền'),
    v.minLength(1, 'Phải chọn ít nhất một quyền')
  )
})

type FormData = InferInput<typeof schema>

export default function AddRole(prop: AddRoleProp) {
  const { mutate } = prop
  const [loading, setLoading] = useState<boolean>(false)

  const { openAddRoleModal, toogleAddRoleModal } = useRoleStore()

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
      permissionID: []
    }
  })

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    await roleService.create(
      {
        name: data.name,
        permissionID: data.permissionID.map(Number),
        color: permission.find(i => i.id === Number(data.permissionID[0]))?.color.action_color,
        icon: 'icon'
      },
      () => {
        toast.success('Thêm mới vai trò thành công')
        mutate()
        reset()
        setLoading(false)
      },
      error => {
        toast.error('Thêm mới vai trò thất bại')
        setLoading(false)
        if (error.message === 'Role already exists') {
          setError('name', { type: 'manual', message: 'Vai trò đã tồn tại' })
        }
      }
    )
  })

  const handleClose = () => {
    toogleAddRoleModal()
    reset()
  }

  return (
    <Dialog open={openAddRoleModal} onClose={handleClose} maxWidth='sm' fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          <Typography variant='h4'>Thêm mới vai trò</Typography>
        </DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='material-symbols:close-rounded' />
        </IconButton>
        <DialogContent>
          <Stack spacing={2}>
            <Controller
              rules={{ required: true }}
              name='name'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label='Tên vai trò'
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name='permissionID'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  label='Quyền'
                  SelectProps={{
                    multiple: true,
                    renderValue: renderValue
                  }}
                  {...(errors.permissionID && { error: true, helperText: errors.permissionID.message })}
                >
                  {permission.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.namePermission.toLocaleUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction='row' spacing={1}>
            <Button variant='outlined' onClick={handleClose}>
              Hủy
            </Button>
            <LoadingButton loading={loading} type='submit' variant='contained' color='primary'>
              Thêm
            </LoadingButton>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  )
}
