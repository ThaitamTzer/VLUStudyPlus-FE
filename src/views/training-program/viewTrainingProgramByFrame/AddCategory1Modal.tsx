import { useCallback, useState } from 'react'

import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Grid } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import type { KeyedMutator } from 'swr'
import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import trainingProgramService from '@/services/trainingprogram.service'

const schema = v.object({
  titleN: v.pipe(v.string(), v.trim(), v.nonEmpty('Số TT danh mục không được để trống')),
  titleV: v.pipe(v.string(), v.trim(), v.nonEmpty('Tên danh mục không được để trống')),
  credits: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ không được nhỏ hơn 0'))
})

type CategoryForm = InferInput<typeof schema>

interface AddCategory1ModalProps {
  open: boolean
  onClose: () => void
  mutate: KeyedMutator<any>
  programId: string
}

export default function AddCategory1Modal({ open, onClose, mutate, programId }: AddCategory1ModalProps) {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CategoryForm>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      titleN: '',
      titleV: '',
      credits: 0
    }
  })

  const onSubmit = useCallback(
    async (data: CategoryForm) => {
      setLoading(true)
      const toastID = toast.loading('Đang thêm danh mục...')

      await trainingProgramService.createCategory1(
        programId,
        data,
        () => {
          toast.update(toastID, {
            render: 'Thêm danh mục thành công',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          })
          onClose()
          mutate()
          reset()
          setLoading(false)
        },
        (err: Error) => {
          toast.update(toastID, {
            render: err?.message || 'Có lỗi xảy ra',
            type: 'error',
            isLoading: false,
            autoClose: 2000
          })
          setLoading(false)
        }
      )
    },
    [mutate, onClose, programId, reset]
  )

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title='Thêm danh mục cấp 1'
      closeOutside
      actions={
        <>
          <Button variant='outlined' color='inherit' onClick={onClose}>
            Hủy
          </Button>
          <LoadingButton variant='contained' onClick={handleSubmit(onSubmit)} loading={loading}>
            Lưu
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name='titleN'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Số TT danh mục'
                error={!!errors.titleN}
                helperText={errors.titleN?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='titleV'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Tên danh mục'
                error={!!errors.titleV}
                helperText={errors.titleV?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='credits'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <CustomTextField
                {...field}
                label='Số tín chỉ'
                error={!!errors.credits}
                helperText={errors.credits?.message}
                type='number'
                fullWidth
                onFocus={e => e.target.select()}
                onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
