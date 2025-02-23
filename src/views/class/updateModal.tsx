'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import type { InferInput } from 'valibot'
import {
  Grid,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  DialogContent,
  DialogActions
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import type { KeyedMutator } from 'swr'
import useSWR from 'swr'

import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'

import { useClassStore } from '@/stores/class/class'

import CustomTextField from '@/@core/components/mui/TextField'
import cohortService from '@/services/cohort.service'
import classService from '@/services/class.service'
import Iconify from '@/components/iconify'

type ManualUpdateClassProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  lectureId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn giảng viên')),
  classId: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập mã lớp')),
  cohortId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn niên khóa')),
  numberStudent: v.pipe(
    v.number(),
    v.integer('Số lượng học viên phải là số nguyên'),
    v.minValue(1, 'Số lượng học viên phải lớn hơn 0'),
    v.maxValue(100, 'Số lượng học viên không được vượt quá 100')
  )
})

type ManualUpdateClassInput = InferInput<typeof schema>

export default function UpdateModal({ mutate }: ManualUpdateClassProps) {
  const { openEditClassModal, toogleOpenEditClassModal, classRoom } = useClassStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { lecturerData } = useAuth()

  const { data: cohortsData } = useSWR('cohortOptions', () => cohortService.getAll(), {
    revalidateOnFocus: false
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ManualUpdateClassInput>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      lectureId: '',
      classId: '',
      cohortId: '',
      numberStudent: 0
    }
  })

  useEffect(() => {
    if (!classRoom) {
      return
    }

    reset({
      lectureId: classRoom.lectureId,
      classId: classRoom.classId,
      cohortId: classRoom.cohortId._id,
      numberStudent: classRoom.numberStudent
    })
  }, [reset, classRoom])

  const onClose = () => {
    toogleOpenEditClassModal()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    if (!classRoom) return

    setLoading(true)
    const toastId = toast.loading('Đang cập nhật lớp niên chế...')

    await classService.update(
      classRoom._id,
      {
        ...data,
        statusImport: false
      },
      () => {
        toast.update(toastId, {
          render: 'Cập nhật lớp niên chế thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        mutate()
        onClose()
        setLoading(false)
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
    <Dialog open={openEditClassModal} onClose={onClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Cập nhật lớp niên chế</Typography>
          <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
            <Iconify icon='eva:close-outline' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name='classId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Mã lớp niên chế'
                    fullWidth
                    {...(errors.classId && { error: true, helperText: errors.classId.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='lectureId'
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    {...field}
                    id='lectureId'
                    value={lecturerData?.find(lecturer => lecturer._id === value) || null}
                    onChange={(_, newValue) => onChange(newValue ? newValue._id : '')}
                    options={lecturerData || []}
                    getOptionLabel={option => option.userName} // Đổi label hiển thị thành tên giảng viên
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Tìm kiếm giảng viên'
                        {...(errors.lectureId && { error: true, helperText: errors.lectureId.message })}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <>{params.InputProps.endAdornment}</>
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='cohortId'
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    {...field}
                    id='cohortId'
                    value={cohortsData?.find(cohort => cohort._id === value) || null}
                    onChange={(_, newValue) => onChange(newValue ? newValue._id : '')}
                    options={cohortsData || []}
                    getOptionLabel={option => option.cohortId}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Niên khóa'
                        {...(errors.cohortId && { error: true, helperText: errors.cohortId.message })}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='numberStudent'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomTextField
                    value={value === 0 ? '' : value}
                    onChange={e => {
                      // Loại bỏ số 0 đứng đầu
                      const inputValue = e.target.value.replace(/^0+/, '')

                      // Chuyển đổi sang số (nếu chuỗi rỗng thì đặt thành 0 hoặc giá trị khác theo yêu cầu)
                      const numericValue = inputValue === '' ? 0 : Number(inputValue)

                      onChange(numericValue)
                    }}
                    label='Số lượng học viên'
                    type='number'
                    fullWidth
                    {...(errors.numberStudent && { error: true, helperText: errors.numberStudent.message })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <LoadingButton loading={loading} variant='contained' type='submit' color='primary' disableElevation>
            Cập nhật
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
