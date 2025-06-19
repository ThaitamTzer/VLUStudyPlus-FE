'use client'
import { useState } from 'react'

import { Button, Grid } from '@mui/material'
import type { KeyedMutator } from 'swr'
import * as v from 'valibot'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import CustomTextField from '@/@core/components/mui/TextField'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import { CustomDialog } from '@/components/CustomDialog'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { useShare } from '@/hooks/useShare'

type AddAcedemicProcessProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  title: v.pipe(
    v.string(),
    v.nonEmpty('Tiêu đề xử lý không được để trống'),
    v.maxLength(255, 'Tiêu đề xử lý không được quá 255 ký tự')
  ),
  termId: v.pipe(v.string(), v.nonEmpty('Học kỳ không được để trống'))
})

type AddAcedemicProcessForm = v.InferInput<typeof schema>

export default function AddAcedemicProcess(props: AddAcedemicProcessProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)
  const { termOptions } = useShare()

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
      title: '',
      termId: ''
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
    <CustomDialog
      canDrag
      open={openAddAcedemicProcess}
      onClose={handleClose}
      title='Thêm kỳ xử lý học tập'
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
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='termId'
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={termOptions.sort((b, a) => a.abbreviatName.localeCompare(b.abbreviatName)) || []}
                getOptionLabel={option => option.abbreviatName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => <li {...props}>{option.abbreviatName}</li>}
                onChange={(_, value) => {
                  if (value) {
                    field.onChange(value._id)
                  } else {
                    field.onChange('')
                  }
                }}
                value={termOptions.find(term => term._id === field.value) || null}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Học kỳ'
                    {...(errors.termId && {
                      error: true,
                      helperText: errors.termId.message?.toString()
                    })}
                  />
                )}
                noOptionsText='Không tìm thấy học kỳ'
              />
            )}
          />
        </Grid>
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
    </CustomDialog>
  )
}
