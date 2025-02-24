'use client'
import { useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import type { KeyedMutator } from 'swr'
import * as v from 'valibot'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import Iconify from '@/components/iconify'
import { useTypeProcessStore } from '@/stores/typeprocess/typeProcess.store'
import CustomTextField from '@/@core/components/mui/TextField'
import typeProcessService from '@/services/typeprocess.service'

type AddTypeProcessProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  typeProcessingId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Mã loại xử lý không được để trống'),
    v.maxLength(10, 'Mã loại xử lý không được quá 10 ký tự')
  ),
  typeProcessingName: v.pipe(
    v.string(),
    v.nonEmpty('Tên loại xử lý không được để trống'),
    v.maxLength(50, 'Tên loại xử lý không được quá 50 ký tự')
  )
})

type AddTypeProcessForm = v.InferInput<typeof schema>

export default function AddTypeProcess(props: AddTypeProcessProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)

  const { openAddTypeProcess, toogleAddTypeProcess } = useTypeProcessStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AddTypeProcessForm>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      typeProcessingId: '',
      typeProcessingName: ''
    }
  })

  const handleClose = () => {
    toogleAddTypeProcess()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    const toastID = toast.loading('Đang thêm loại xử lý...')

    setLoading(true)
    await typeProcessService.add(
      data,
      () => {
        toast.update(toastID, {
          render: 'Thêm loại xử lý thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
        handleClose()
        mutate()
      },
      err => {
        toast.update(toastID, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openAddTypeProcess} onClose={handleClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Thêm loại xử lý</Typography>
          <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
            <Iconify icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name='typeProcessingId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mã loại xử lý'
                    {...(errors.typeProcessingId && { error: true, helperText: errors.typeProcessingId.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='typeProcessingName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên loại xử lý'
                    {...(errors.typeProcessingName && { error: true, helperText: errors.typeProcessingName.message })}
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
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
