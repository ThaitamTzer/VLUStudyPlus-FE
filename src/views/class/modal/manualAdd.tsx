'use client'

import { useState, useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { Grid, Autocomplete, CircularProgress, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import type { KeyedMutator } from 'swr'
import useSWR from 'swr'

import { toast } from 'react-toastify'

import { useShare } from '@/hooks/useShare'

import { useClassStore } from '@/stores/class/class'

import lecturerService from '@/services/lecturer.service'
import CustomTextField from '@/@core/components/mui/TextField'
import classService from '@/services/class.service'

type ManualAddClassProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  lectureId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn giảng viên')),
  classId: v.pipe(
    v.string(),
    v.nonEmpty('Vui lòng nhập mã lớp'),
    v.minLength(9, 'Mã lớp phải có ít nhất 9 ký tự'),
    v.maxLength(11, 'Mã lớp không được vượt quá 11 ký tự')
  ),
  cohortId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn niên khóa')),
  majorId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn ngành')),
  numberStudent: v.pipe(
    v.number(),
    v.integer('Số lượng học viên phải là số nguyên'),
    v.minValue(1, 'Số lượng học viên phải lớn hơn 0')
  )
})

type ManualAddClassInput = InferInput<typeof schema>

export default function ManualAddClass({ mutate }: ManualAddClassProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pageCount, setPageCount] = useState<number>(1)
  const [lecturers, setLecturers] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const { toogleOpenAddClassModal } = useClassStore()

  const { data: lecturersData, isLoading } = useSWR(
    ['lecturerOptions', searchQuery, pageCount],
    () => lecturerService.getAll(pageCount, 10, '', '', searchQuery),
    {
      revalidateOnFocus: false,
      keepPreviousData: true
    }
  )

  const { cohorOptions, majorOptions } = useShare()

  useEffect(() => {
    if (!lecturersData?.lecturers) return

    setLecturers(prev => {
      const newLecturers = lecturersData.lecturers.filter(
        newLecturer => !prev.some(existing => existing._id === newLecturer._id)
      )

      return newLecturers.length > 0 ? [...prev, ...newLecturers] : prev
    })

    setTotalItems(lecturersData.pagination.totalItems)
  }, [lecturersData])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ManualAddClassInput>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      lectureId: '',
      classId: '',
      cohortId: '',
      majorId: '',
      numberStudent: 0
    }
  })

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    const toastId = toast.loading('Đang thêm lớp niên chế...')

    await classService.add(
      {
        ...data,
        statusImport: false
      },
      () => {
        toast.update(toastId, {
          render: 'Thêm lớp niên chế thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        mutate()
        onClose()
        setLoading(false)
      },
      err => {
        err.message.map(
          (m: any) =>
            toast.update(toastId, {
              render: m,
              type: 'error',
              isLoading: false,
              autoClose: 3000
            }),
          3000
        )
        setLoading(false)
      }
    )

    // Xử lý logic khi submit form
  })

  const handleScrollDownEvent = () => {
    const lazyContainer = document.querySelector('#lectureId-listbox')

    if (lazyContainer) {
      lazyContainer.addEventListener('scroll', () => {
        const isAtBottom =
          Math.abs(lazyContainer.scrollHeight - lazyContainer.scrollTop - lazyContainer.clientHeight) < 5

        // Nếu đã load hết dữ liệu, không tăng pageCount nữa
        if (isAtBottom && lecturers.length < totalItems) {
          setPageCount(prev => prev + 1)
        }
      })
    }
  }

  const onClose = () => {
    reset()
    toogleOpenAddClassModal()
  }

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
                value={lecturers.find(lecturer => lecturer._id === value) || null}
                onChange={(_, newValue) => onChange(newValue ? newValue._id : '')}
                options={lecturers}
                getOptionLabel={option => option.userName}
                loading={isLoading}
                onInputChange={(event, value) => {
                  if (value.length >= 3 || value === '') {
                    setSearchQuery(value)
                    setLecturers([])
                    setPageCount(1)
                  }
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Giảng viên'
                    {...(errors.lectureId && { error: true, helperText: errors.lectureId.message })}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                ListboxProps={{
                  sx: {
                    maxHeight: 300
                  }
                }}
                onOpen={() => {
                  setTimeout(() => {
                    handleScrollDownEvent()
                  }, 100)
                }}
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
            name='majorId'
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                id='majorId'
                value={majorOptions?.find(major => major._id === value) || null}
                onChange={(_, newValue) => onChange(newValue ? newValue._id : '')}
                options={majorOptions || []}
                getOptionLabel={option => option.majorName}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Ngành'
                    {...(errors.majorId && { error: true, helperText: errors.majorId.message })}
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
                  let numericValue = inputValue === '' ? 0 : Number(inputValue)

                  // Không cho phép nhập số âm
                  if (numericValue < 0) {
                    numericValue = 0
                  }

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
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant='outlined' className='ml-4'>
            Hủy
          </Button>
          <LoadingButton type='submit' variant='contained' loading={loading} loadingPosition='start'>
            Lưu
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  )
}
