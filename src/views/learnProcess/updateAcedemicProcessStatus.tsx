'use client'
import { useEffect, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'

import type { KeyedMutator } from 'swr'

import * as v from 'valibot'

import type { InferInput } from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { Controller, useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { useShare } from '@/hooks/useShare'
import Iconify from '@/components/iconify'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import learnProcessService from '@/services/learnProcess.service'

const schema = v.object({
  CVHTHandle: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn kết quả xử lý')),
  CVHTNote: v.optional(v.string())
})

type FormInput = InferInput<typeof schema>

export default function UpdateAcedemicProcessStatus({ mutate }: { mutate: KeyedMutator<any> }) {
  const { toogleUpdateAcedemicProcessStatus, openUpdateAcedemicProcessStatus, processing } = useAcedemicProcessStore()
  const [loading, setLoading] = useState(false)
  const { resultProcess } = useShare()

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset
  } = useForm<FormInput>({
    resolver: valibotResolver(schema),
    defaultValues: {
      CVHTHandle: processing?.CVHTHandle?._id || '',
      CVHTNote: processing?.CVHTNote || ''
    }
  })

  useEffect(() => {
    if (processing) {
      reset({
        CVHTHandle: processing?.CVHTHandle?._id || '',
        CVHTNote: processing?.CVHTNote || ''
      })
    }
  }, [processing, reset])

  const onClose = () => {
    toogleUpdateAcedemicProcessStatus()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    if (!processing) return toast.error('Vui lòng chờ xử lý xong')

    const toastId = toast.loading('Đang cập nhật kết quả xử lý')

    setLoading(true)

    await learnProcessService.updateStatusProcess(
      processing._id,
      data,
      () => {
        toast.update(toastId, {
          render: 'Cập nhật thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        onClose()
        mutate()
        setLoading(false)
      },
      err => {
        toast.update(toastId, {
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
    <Dialog open={openUpdateAcedemicProcessStatus} onClose={onClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
            onClick={onClose}
          >
            <Iconify icon='mdi:close' color='black' />
          </IconButton>
          <Typography variant='h4'>Cập nhật kết quả xử lý học vụ cho sinh viên</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='CVHTHandle'
                render={({ field: { value, onChange, ...field } }) => (
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    id='statusHandling'
                    options={resultProcess}
                    value={resultProcess.find(type => type._id === value) || null}
                    onChange={(_, newValue) => onChange(newValue ? newValue._id : '')}
                    getOptionLabel={option => option.processingResultName}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        label='Tình trạng xử lý'
                        {...(errors.CVHTHandle && {
                          error: true,
                          helperText: errors.CVHTHandle.message
                        })}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='CVHTNote'
                render={({ field }) => <CustomTextField {...field} fullWidth label='Ghi chú' multiline rows={4} />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
