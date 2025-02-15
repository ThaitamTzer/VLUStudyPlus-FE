'use client'

import { useState } from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton, Grid } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import type { KeyedMutator } from 'swr'

import { valibotResolver } from '@hookform/resolvers/valibot'

import type { InferInput } from 'valibot'

import { Controller, useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { useMajorStore } from '@/stores/major/major'
import Iconify from '@/components/iconify'
import { schema } from '@/schema/majorSchema'
import CustomTextField from '@/@core/components/mui/TextField'

import majorService from '@/services/major.service'

type AddMajorProps = {
  mutate: KeyedMutator<any>
}

type FormData = InferInput<typeof schema>

export default function AddMajor({ mutate }: AddMajorProps) {
  const { openAddMajor, toogleAddMajor } = useMajorStore()
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
      majorId: ''
    }
  })

  const handleClose = () => {
    toogleAddMajor()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    await majorService.create(
      data,
      () => {
        toast.success('Thêm ngành thành công')
        setLoading(false)
        handleClose()
        mutate()
      },
      err => {
        switch (err.message) {
          case 'MajorId already exists':
            setError('majorId', { type: 'manual', message: 'Mã ngành đã tồn tại' })
            break
          case 'Major name already exists':
            setError('majorName', { type: 'manual', message: 'Tên ngành đã tồn tại' })
            break
          default:
            toast.error('Thêm ngành thất bại')
        }

        console.log(err)
        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openAddMajor} onClose={handleClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Thêm ngành</Typography>
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
                name='majorId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    autoFocus
                    label='Mã ngành'
                    {...(errors.majorId && { error: true, helperText: errors.majorId.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='majorName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên ngành'
                    {...(errors.majorName && { error: true, helperText: errors.majorName.message })}
                  />
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
