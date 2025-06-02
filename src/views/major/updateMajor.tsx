'use client'
import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Grid,
  MenuItem
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { KeyedMutator } from 'swr'
import type { InferInput } from 'valibot'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import * as v from 'valibot'

import { useMajorStore } from '@/stores/major/major'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import majorService from '@/services/major.service'
import { typeMajorOptions } from '@/schema/majorSchema'

type UpdateMajorProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  majorName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên chuyên ngành không được để trống'),
    v.minLength(3, 'Tên chuyên ngành phải có ít nhất 3 ký tự'),
    v.maxLength(255, 'Tên chuyên ngành không được quá 255 ký tự')
  ),
  typeMajor: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Loại ngành không được để trống'),
    v.minLength(1, 'Loại ngành phải có ít nhất 1 ký tự'),
    v.maxLength(100, 'Loại ngành không được quá 100 ký tự')
  )
})

type FormData = InferInput<typeof schema>

export default function UpdateMajor({ mutate }: UpdateMajorProps) {
  const { openUpdateMajor, toogleUpdateMajor, major } = useMajorStore()

  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      majorName: '',
      typeMajor: ''
    }
  })

  useEffect(() => {
    if (major) {
      reset(major)
    }
  }, [major, reset])

  const handleClose = () => {
    toogleUpdateMajor()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    setLoading(true)

    if (!major) {
      return
    }

    await majorService.update(
      major?._id,
      data,
      () => {
        toast.success('Chỉnh sửa chuyên ngành thành công')
        setLoading(false)
        handleClose()
        mutate()
      },
      err => {
        switch (err.message) {
          case 'Major name already exists':
            toast.error('Tên chuyên ngành đã tồn tại')
            setError('majorName', { type: 'manual', message: 'Tên chuyên ngành đã tồn tại' })
            break
          default:
            toast.error('Chỉnh sửa chuyên ngành thất bại')
        }

        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openUpdateMajor} onClose={handleClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Chỉnh sửa chuyên ngành</Typography>
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
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name='majorName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên chuyên ngành'
                    {...(errors.majorName && { error: true, helperText: errors.majorName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='typeMajor'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Loại ngành'
                    {...(errors.typeMajor && { error: true, helperText: errors.typeMajor.message })}
                    select
                  >
                    {typeMajorOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton type='submit' loading={loading} variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
