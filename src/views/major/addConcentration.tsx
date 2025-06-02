'use client'

import { useCallback, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import * as v from 'valibot'

import { toast } from 'react-toastify'

import { mutate } from 'swr'

import { LoadingButton } from '@mui/lab'

import { Button, Grid } from '@mui/material'

import { CustomDialog } from '@/components/CustomDialog'

import { useMajorStore } from '@/stores/major/major'
import majorService from '@/services/major.service'
import CustomTextField from '@/@core/components/mui/TextField'

const schema = v.object({
  concentrationName: v.pipe(v.string(), v.minLength(1, 'Tên chuyên ngành không được để trống'))
})

type FormData = v.InferInput<typeof schema>

export default function AddConcentration() {
  const { openAddConcentration, toogleAddConcentration, major } = useMajorStore()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'all',
    defaultValues: {
      concentrationName: ''
    },
    resolver: valibotResolver(schema)
  })

  const handleClose = useCallback(() => {
    toogleAddConcentration()
    reset()
  }, [toogleAddConcentration, reset])

  const onSubmit = handleSubmit(async data => {
    setLoading(true)

    if (!major) return

    const payload = {
      majorId: major._id,
      concentrationName: data.concentrationName
    }

    const toastId = toast.loading('Đang thêm chuyên ngành...')

    await majorService.createConcentration(
      payload,
      () => {
        mutate(`/api/major/view-list-concentration/${major._id}`)
        toast.update(toastId, {
          render: 'Thêm chuyên ngành thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        handleClose()
        setLoading(false)
      },
      err => {
        toast.update(toastId, {
          render: err.message || 'Thêm chuyên ngành thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        setLoading(false)
      }
    )
  })

  return (
    <CustomDialog
      open={openAddConcentration}
      onClose={handleClose}
      title='Thêm chuyên ngành'
      onSubmit={onSubmit}
      maxWidth='sm'
      fullWidth
      actions={
        <>
          <Button variant='outlined' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name='concentrationName'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Tên chuyên ngành'
                error={!!errors.concentrationName}
                helperText={errors.concentrationName?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
