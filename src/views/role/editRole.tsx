'use client'

import { useEffect, useState } from 'react'

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

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import permission from '@/libs/permission.json'
import CustomTextField from '@/@core/components/mui/TextField'
import roleService from '@/services/role.service'

import type { Role, RoleType } from '@/types/management/roleType'

import { useRoleStore } from '@/stores/role/role'
import Iconify from '@/components/iconify'

type EditRoleProp = {
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

export default function EditRole(prop: EditRoleProp) {
  const { openEditRoleModal, toogleEditRoleModal, role, setRole } = useRoleStore()
  const { mutate } = prop

  console.log(role)

  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      name: '',
      permissionID: []
    }
  })

  useEffect(() => {
    if (role) {
      reset({
        name: role.name || '',
        permissionID: role.permissionID?.map(Number) || []
      })
    }
  }, [role, reset])

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    await roleService.update(
      {
        _id: role._id,
        name: data.name,
        permissionID: data.permissionID.map(Number),
        color: permission.find(i => i.id === Number(data.permissionID[0]))?.color.action_color,
        icon: 'icon'
      },
      () => {
        toast.success('Cập nhật vai trò thành công')
        mutate()
        reset()
        setLoading(false)
        handleClose()
      },
      error => {
        toast.error(error.response.data.message)
        setLoading(false)
      }
    )
  })

  const handleClose = () => {
    toogleEditRoleModal()
    reset()
    setRole({} as Role)
  }

  return (
    <Dialog open={openEditRoleModal} maxWidth='sm' fullWidth onClose={handleClose}>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          <Typography variant='h4'>Điều chỉnh vai trò</Typography>
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
                  label='Chọn quyền'
                  error={!!errors.permissionID}
                  helperText={errors.permissionID?.message}
                  SelectProps={{
                    multiple: true,
                    renderValue: renderValue
                  }}
                >
                  {permission.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.namePermission}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='error' onClick={handleClose} startIcon={<Iconify icon='mdi:close' />}>
            Hủy
          </Button>
          <LoadingButton
            type='submit'
            variant='contained'
            color='primary'
            loading={loading}
            disabled={!isValid}
            loadingPosition='start'
            startIcon={<Iconify icon='mdi:content-save-edit' />}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
