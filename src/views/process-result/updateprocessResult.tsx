'use client'
import { useEffect, useState } from 'react'

import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Typography
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { toast } from 'react-toastify'

import type { KeyedMutator } from 'swr'

import resultProcessService from '@/services/resultProcess.service'
import { useResultProcessStore } from '@/stores/resultProcess.store'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'

const schema = v.object({
  processingResultName: v.pipe(
    v.string(),
    v.nonEmpty('Tên kết quả xử lý không được để trống'),
    v.maxLength(255, 'Tên kết quả không được quá 255 ký tự')
  ),
  commitment: v.boolean(),
  formTemplateId: v.string()
})

type FormData = InferInput<typeof schema>

export default function UpdateProcessResult({
  mutate,
  formTemplateData
}: {
  mutate: KeyedMutator<any>
  formTemplateData: any[]
}) {
  const { toolEditResultProcess, openEditResultProcess, resultProcessData, setResultProcessData } =
    useResultProcessStore()

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      processingResultName: resultProcessData?.processingResultName || '',
      commitment: resultProcessData?.commitment || false,
      formTemplateId: resultProcessData?.formTemplateId || ''
    }
  })

  useEffect(() => {
    if (!resultProcessData) return

    reset({
      processingResultName: resultProcessData.processingResultName,
      commitment: resultProcessData.commitment,
      formTemplateId: resultProcessData.formTemplateId
    })
  }, [resultProcessData, reset])

  const onClose = () => {
    reset()
    setResultProcessData(null)
    toolEditResultProcess()
  }

  const onSubmit = handleSubmit(async data => {
    if (!resultProcessData) return toast.error('Không tìm thấy kết quả xử lý')

    const toastId = toast.loading('Đang cập nhật kết quả xử lý')

    setLoading(true)

    await resultProcessService.update(
      resultProcessData?._id,
      data,
      () => {
        onClose()
        mutate()
        setLoading(false)
        toast.update(toastId, {
          render: 'Cập nhật kết quả xử lý thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openEditResultProcess} onClose={onClose} maxWidth='sm' fullWidth>
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
            <Iconify icon='mdi:close' />
          </IconButton>
          <Typography variant='h4'>Cập nhật danh mục kết quả xử lý</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='processingResultName'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Tên danh mục kết quả xử lý'
                    fullWidth
                    {...(errors.processingResultName && {
                      error: true,
                      helperText: errors.processingResultName.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='commitment'
                render={({ field }) => (
                  <FormControlLabel
                    label='Có làm đơn cam kết ?'
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        {...(errors.commitment && {
                          error: true,
                          helperText: errors.commitment.message?.toString()
                        })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='formTemplateId'
                render={({ field }) => (
                  <CustomTextField {...field} label='Mẫu đơn' fullWidth select>
                    {formTemplateData?.map(item => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onClose}>
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
