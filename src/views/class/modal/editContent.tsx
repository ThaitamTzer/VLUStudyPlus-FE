'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Autocomplete, Button, Grid, Stack } from '@mui/material'

import * as v from 'valibot'

import { useForm, Controller } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { mutate } from 'swr'

import { LoadingButton } from '@mui/lab'

import { toast } from 'react-toastify'

import { useShare } from '@/hooks/useShare'

import CustomTextField from '@/@core/components/mui/TextField'
import type { ClassData } from '@/types/management/classType'
import { useAuth } from '@/hooks/useAuth'
import classService from '@/services/class.service'
import { useClassStore } from '@/stores/class/class'

const schema = v.object({
  lectureId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn giảng viên')),
  classId: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập mã lớp')),
  cohortId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn niên khóa')),
  numberStudent: v.pipe(
    v.number(),
    v.integer('Số lượng học viên phải là số nguyên'),
    v.minValue(1, 'Số lượng học viên phải lớn hơn 0')
  )
})

type ManualUpdateClassInput = v.InferInput<typeof schema>

export default function EditContent({
  classData,
  lecturer,
  handleClose
}: {
  classData: ClassData | undefined
  lecturer: string | undefined
  handleClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const sortField = searchParams.get('sortField') || ''
  const sortOrder = searchParams.get('sortOrder') || ''
  const typeList = searchParams.get('typeList') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const { lecturerData } = useAuth()
  const { setClassID } = useClassStore()

  const { cohorOptions } = useShare()

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
    if (!classData) {
      return
    }

    reset({
      lectureId: lecturer,
      classId: classData.classId,
      cohortId: classData.cohortId._id,
      numberStudent: classData.numberStudent
    })
  }, [classData, reset, lecturer])

  const onSubmit = handleSubmit(async data => {
    if (!classData) return

    setLoading(true)
    const toastId = toast.loading('Đang cập nhật lớp niên chế...')

    await classService.update(
      classData._id,
      {
        ...data,
        statusImport: classData.statusImport
      },
      () => {
        toast.update(toastId, {
          render: 'Cập nhật lớp niên chế thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        mutate(['/api/classData', page, limit, filterField, filterValue, sortField, sortOrder, typeList, searchKey])
        setLoading(false)
        setClassID('')
        reset(
          {
            lectureId: '',
            classId: '',
            cohortId: '',
            numberStudent: 0
          },
          { keepValues: false }
        )
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
    <form onSubmit={onSubmit} autoComplete='off'>
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
                getOptionLabel={option => option.userName}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Giảng viên'
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
                value={cohorOptions?.find(cohort => cohort._id === value) || null}
                onChange={(_, newValue) => onChange(newValue ? newValue._id : '')}
                options={cohorOptions || []}
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
        <Grid item xs={12}>
          <Stack justifyContent='flex-end' spacing={2} direction='row' mt={2}>
            <Button type='button' onClick={handleClose} variant='outlined'>
              Hủy
            </Button>
            <LoadingButton type='submit' loading={loading} variant='contained'>
              Lưu
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  )
}
