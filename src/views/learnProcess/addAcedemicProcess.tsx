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
import CustomTextField from '@/@core/components/mui/TextField'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'

type AddAcedemicProcessProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  title: v.pipe(
    v.string(),
    v.nonEmpty('Tiêu đề xử lý không được để trống'),
    v.maxLength(255, 'Tiêu đề xử lý không được quá 255 ký tự')
  )
})

type AddAcedemicProcessForm = v.InferInput<typeof schema>

export default function AddAcedemicProcess(props: AddAcedemicProcessProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)

  const { openAddAcedemicProcess, toogleAddAcedemicProcess } = useAcedemicProcessStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AddAcedemicProcessForm>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      title: ''
    }
  })

  const handleClose = () => {
    toogleAddAcedemicProcess()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    const toastID = toast.loading('Đang thêm...')

    setLoading(true)
    await learnProcessService.create(
      data,
      () => {
        toast.update(toastID, {
          render: 'Thêm thành công',
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
    <Dialog open={openAddAcedemicProcess} onClose={handleClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Thêm kỳ xử lý học tập</Typography>
          <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
            <Iconify icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tiêu đề xử lý'
                    {...(errors.title && { error: true, helperText: errors.title.message })}
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
