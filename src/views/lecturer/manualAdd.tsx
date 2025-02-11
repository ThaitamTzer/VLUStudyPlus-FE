'use client'

import { useEffect, useState } from 'react'

import { Button, DialogActions, Grid, MenuItem } from '@mui/material'
import { Controller, useForm, useWatch } from 'react-hook-form'
import type { KeyedMutator } from 'swr'
import useSWR from 'swr'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { LoadingButton } from '@mui/lab'
import type { InferInput } from 'valibot'
import { toast } from 'react-toastify'
import * as v from 'valibot'

import { useLecturerStore } from '@/stores/lecturer/lecturer'
import roleService from '@/services/role.service'
import lecturerService from '@/services/lecturer.service'
import CustomTextField from '@/@core/components/mui/TextField'

const schema = v.object({
  userId: v.pipe(
    v.string(),
    v.nonEmpty('Mã sinh viên không được để trống'),
    v.minLength(10, 'Mã giảng viên không hợp lệ'),
    v.maxLength(10, 'Mã giảng viên không hợp lệ')
  ),
  userName: v.pipe(
    v.string(),
    v.nonEmpty('Tên giảng viên không được để trống'),
    v.minLength(3, 'Tên giảng viên không hợp lệ'),
    v.maxLength(100, 'Tên giảng viên không quá')
  ),
  typeLecturer: v.pipe(
    v.union([v.literal('permanent'), v.literal('visiting')]),
    v.nonEmpty('Loại giảng viên không được để trống')
  ),
  mail: v.pipe(v.string(), v.nonEmpty('Email không được để trống'), v.includes('@vlu.edu.vn', 'Email không hợp lệ')),
  role: v.pipe(v.string(), v.nonEmpty('Vai trò khônsg được để trống'))
})

type FormData = InferInput<typeof schema>

type Props = {
  mutate: KeyedMutator<any>
}

export default function ManualAdd({ mutate }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { toogleAddLecturer } = useLecturerStore()

  const { data: roles } = useSWR('roles', () => roleService.getAll(1, 9999, ''))

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      userId: '',
      userName: '',
      typeLecturer: 'permanent',
      mail: '',
      role: ''
    }
  })

  const userName = useWatch({ control, name: 'userName' })

  useEffect(() => {
    if (userName) {
      // Get last name (first word)
      const lastNameInitials = userName
        .split(' ')
        .slice(0, -1)
        .map(word => word.charAt(0).toLowerCase())
        .join('')

      // Get first name (last word)
      const firstName = userName.split(' ').pop()?.toLowerCase() || ''

      // Normalize Vietnamese characters
      const normalizedFirstName = firstName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')

      const normalizedLastName = lastNameInitials
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')

      const email = `${normalizedFirstName}.${normalizedLastName}@vlu.edu.vn`

      setValue('mail', email)
    }
  }, [userName, setValue])

  const handleClose = () => {
    toogleAddLecturer()
    reset()
    setLoading(false)
  }

  const onSubmit = handleSubmit(async data => {
    setLoading(true)

    const toastID = toast.loading('Đang thêm giảng viên...')

    await lecturerService.create(
      data,
      () => {
        toast.update(toastID, {
          render: 'Thêm giảng viên thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        mutate()
        handleClose()
      },
      err => {
        toast.update(toastID, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  })

  return (
    <form onSubmit={onSubmit} autoComplete='off'>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='userId'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Mã giảng viên'
                error={Boolean(errors.userId)}
                helperText={errors.userId?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='userName'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Tên giảng viên'
                error={Boolean(errors.userName)}
                helperText={errors.userName?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='mail'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Email'
                error={Boolean(errors.mail)}
                helperText={errors.mail?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='typeLecturer'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Loại giảng viên'
                select
                error={Boolean(errors.role)}
                helperText={errors.role?.message}
                fullWidth
              >
                <MenuItem value='permanent'>Cơ hửu</MenuItem>
                <MenuItem value='visiting'>Thỉnh giảng</MenuItem>
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='role'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Vai trò'
                select
                error={Boolean(errors.role)}
                helperText={errors.role?.message}
                fullWidth
              >
                {roles?.data?.roles?.map(role => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>
      </Grid>
      <DialogActions
        sx={{
          px: 0
        }}
      >
        <Button onClick={toogleAddLecturer} variant='outlined' color='primary'>
          Hủy
        </Button>
        <LoadingButton loading={loading} type='submit' variant='contained' color='primary'>
          Lưu
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
