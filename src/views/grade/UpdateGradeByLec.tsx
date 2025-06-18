'use client'

import { memo, useCallback, useState, useEffect } from 'react'

import { Grid, Box, Button, Chip, Card, CardContent, Typography, Divider } from '@mui/material'

import useSWR, { mutate } from 'swr'

import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'
import CustomTextField from '@/@core/components/mui/TextField'
import termService from '@/services/term.service'
import gradeService from '@/services/grade.service'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

const gradeSchema = v.object({
  term: v.pipe(v.string(), v.nonEmpty('Mã học kỳ không được để trống')),
  grade: v.pipe(
    v.number('Điểm phải là số'),
    v.minValue(0, 'Điểm không được âm'),
    v.maxValue(10, 'Điểm không được lớn hơn 10')
  )
})

type GradeSchema = InferInput<typeof gradeSchema>

function UpdateGradeByLec() {
  const { openUpdateGrade, toogleUpdateGrade, studentId, subject, studentGrade, idClass } = useGradeStore()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { data: terms, isLoading: isLoadingTerms } = useSWR(
    ['terms', page, 100, '', '', '', searchTerm],
    () => termService.getAll(page, 100, '', '', '', '', '', searchTerm),
    {
      onSuccess: data => {
        setTotal(data.pagination.totalItems)
      }
    }
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<GradeSchema>({
    mode: 'all',
    resolver: valibotResolver(gradeSchema),
    defaultValues: {
      term: '',
      grade: 0
    }
  })

  // Reset search when modal opens
  useEffect(() => {
    if (openUpdateGrade) {
      setSearchTerm('')
      setPage(1)
      reset()
    }
  }, [openUpdateGrade, reset])

  const handleClose = useCallback(() => {
    toogleUpdateGrade()
    reset() // Reset form when closing
    setSearchTerm('') // Clear search term
    setPage(1) // Reset page
  }, [toogleUpdateGrade, reset])

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget

    if (
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1 &&
      !isLoadingTerms &&
      terms?.terms.length &&
      terms?.terms.length < total
    ) {
      setPage(prev => prev + 1)
    }
  }

  const onSubmit = handleSubmit(data => {
    const dataFormat = {
      termGrades: [
        {
          term: data.term,
          gradeOfSubject: [
            {
              subjectId: subject?._id,
              grade: data.grade
            }
          ]
        }
      ]
    }

    console.log(dataFormat)

    const toastId = toast.loading('Đang cập nhật điểm...')

    setIsLoading(true)

    gradeService.importGrades(
      studentId,
      dataFormat,
      () => {
        setIsLoading(false)
        mutate([`/api/grade/view-grade-GV/${idClass}`, idClass])
        handleClose()
        toast.update(toastId, {
          render: 'Cập nhật điểm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setIsLoading(false)
        toast.update(toastId, {
          render: err?.message || 'Cập nhật điểm thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  })

  return (
    <CustomDialog
      canDrag
      open={openUpdateGrade}
      onClose={handleClose}
      title={`Nhập điểm cho ${studentGrade?.userName} - ${subject?.courseName}`}
      maxWidth='md'
      fullWidth
      onSubmit={onSubmit}
      actions={
        <>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Đóng
          </Button>
          <LoadingButton disabled={!isValid} loading={isLoading} type='submit' variant='contained' color='primary'>
            Lưu
          </LoadingButton>
        </>
      }
    >
      {/* Thông tin sinh viên và môn học */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom color='primary'>
            Thông tin nhập điểm
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Sinh viên:
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {studentGrade?.userName || 'Chưa xác định'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Mã SV: {studentGrade?.userId || 'Chưa xác định'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Môn học:
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {subject?.courseName || 'Chưa xác định'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Mã MH: {subject?.courseCode || 'Chưa xác định'} | Tín chỉ: {subject?.credits || 'Chưa xác định'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Typography variant='h6' gutterBottom>
        Nhập điểm số
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name={`term`}
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={terms?.terms.sort((a, b) => a.abbreviatName.localeCompare(b.abbreviatName)) || []}
                getOptionLabel={option => option.abbreviatName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.abbreviatName} -{' '}
                    <Chip
                      label={option.status}
                      size='small'
                      color={option.status === 'Đã kết thúc' ? 'success' : 'default'}
                    />
                  </li>
                )}
                onChange={(_, value) => {
                  if (value) {
                    field.onChange(value._id)
                    setSearchTerm('') // Clear search term when option is selected
                  } else {
                    field.onChange('')
                    setSearchTerm('') // Clear search term when value is cleared
                  }
                }}
                value={terms?.terms.find(term => term._id === field.value) || null}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Học kỳ'
                    {...(errors.term && {
                      error: true,
                      helperText: errors.term.message?.toString()
                    })}
                    onChange={e => {
                      const value = e.target.value

                      setSearchTerm(value)

                      if (!value) {
                        setPage(1) // Reset page when clearing search
                      }
                    }}
                    onFocus={() => {
                      // When focusing on empty field, show all options
                      if (!field.value) {
                        setSearchTerm('')
                        setPage(1)
                      }
                    }}
                  />
                )}
                ListboxProps={{
                  onScroll: handleScroll
                }}
                loading={isLoadingTerms}
                noOptionsText='Không tìm thấy học kỳ'
                filterOptions={(options, state) => {
                  // If there's no input value, return all options
                  if (!state.inputValue) {
                    return options || []
                  }

                  const filtered = options?.filter(
                    option =>
                      option.termName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                      option.abbreviatName.toLowerCase().includes(state.inputValue.toLowerCase())
                  )

                  return filtered || []
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name={`grade`}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Điểm số'
                type='number'
                fullWidth
                onChange={e => {
                  const value = e.target.value === '' ? '' : parseFloat(e.target.value)

                  if (value === '' || !isNaN(value)) {
                    field.onChange(value)
                  }
                }}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                {...(errors.grade && {
                  error: true,
                  helperText: errors.grade.message?.toString()
                })}
                helperText={errors.grade?.message?.toString() || 'Nhập điểm từ 0 đến 10'}
                placeholder='Ví dụ: 8.5'
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  )
}

export default memo(UpdateGradeByLec)
