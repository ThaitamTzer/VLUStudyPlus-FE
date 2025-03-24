'use client'

import { useCallback, useEffect, useState } from 'react'

import type { KeyedMutator } from 'swr'
import { Button, Grid, MenuItem } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'

import trainingProgramService from '@/services/trainingprogram.service'
import { useShare } from '@/hooks/useShare'
import { CustomDialog } from '@/components/CustomDialog'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import CustomTextField from '@/@core/components/mui/TextField'

const schema = v.object({
  title: v.pipe(v.string(), v.nonEmpty('Tên không được để trống'), v.maxLength(100, 'Độ dài tối đa 100 ký tự')),
  credit: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ phải lớn hơn 0')),
  cohortId: v.pipe(v.string(), v.nonEmpty('Khóa không được để trống'))
})

type FormData = InferInput<typeof schema>

type UpdateTrainingProgramProps = {
  mutate: KeyedMutator<any>
}

export default function UpdateTrainingProgram({ mutate }: UpdateTrainingProgramProps) {
  const { cohorOptions } = useShare()
  const [loading, setLoading] = useState(false)

  const { openUpdateTrainingProgram, toogleUpdateTrainingProgram, setTrainingProgram, trainingProgram } =
    useTrainingProgramStore()

  const {
    control,
    handleSubmit,
    reset,
    watch, // Theo dõi dữ liệu thay đổi
    formState: { errors }
  } = useForm<FormData>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: { title: '', credit: 0, cohortId: '' }
  })

  const watchedValues = watch() // Lấy dữ liệu đang nhập vào

  useEffect(() => {
    if (trainingProgram) {
      reset({
        title: trainingProgram.title || '',
        credit: trainingProgram.credit || 0,
        cohortId: trainingProgram?.cohortId?._id || ''
      })
    }
  }, [trainingProgram, reset])

  const getUpdatedFields = () => {
    if (!trainingProgram) return {}

    return Object.fromEntries(
      Object.entries(watchedValues).filter(
        ([key, value]) => trainingProgram[key as keyof typeof trainingProgram] !== value
      )
    )
  }

  const onClose = useCallback(() => {
    toogleUpdateTrainingProgram()
    setTrainingProgram({} as any)
    reset()
  }, [toogleUpdateTrainingProgram, reset, setTrainingProgram])

  const onSubmit = handleSubmit(async () => {
    if (!trainingProgram) return toast.error('Khung chương trình không tồn tại')

    const updatedFields = getUpdatedFields()

    if (Object.keys(updatedFields).length === 0) {
      toast.info('Không có thay đổi nào để cập nhật.')

      return onClose()
    }

    const toastId = toast.loading('Đang cập nhật khung chương trình đào tạo...')

    setLoading(true)

    await trainingProgramService.update(
      trainingProgram._id,
      updatedFields,
      () => {
        setLoading(false)
        mutate()
        toast.update(toastId, {
          render: 'Cập nhật thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        onClose()
      },
      err => {
        setLoading(false)
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
      }
    )
  })

  return (
    <CustomDialog
      open={openUpdateTrainingProgram}
      onClose={onClose}
      title='Cập nhật khung chương trình đào tạo'
      closeOutside
      maxWidth='sm'
      actions={
        <>
          <Button variant='outlined' color='inherit' onClick={onClose}>
            Hủy
          </Button>
          <LoadingButton variant='contained' type='submit' loading={loading} onClick={onSubmit} sx={{ marginLeft: 1 }}>
            Lưu
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Tên khung chương trình'
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='credit'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <CustomTextField
                {...field}
                label='Tổng số tín chỉ'
                error={!!errors.credit}
                helperText={errors.credit?.message}
                type='number'
                fullWidth
                onFocus={e => e.target.select()}
                onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='cohortId'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Khóa'
                error={!!errors.cohortId}
                helperText={errors.cohortId?.message}
                fullWidth
                select
              >
                {cohorOptions.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.cohortId}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
