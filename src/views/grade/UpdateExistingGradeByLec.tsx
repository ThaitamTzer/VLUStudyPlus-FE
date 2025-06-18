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
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import gradeService from '@/services/grade.service'
import termService from '@/services/term.service'

const gradeSchema = v.object({
  term: v.pipe(v.string(), v.nonEmpty('Học kỳ không được để trống')),
  grade: v.pipe(
    v.number('Điểm phải là số'),
    v.minValue(0, 'Điểm không được âm'),
    v.maxValue(10, 'Điểm không được lớn hơn 10')
  )
})

type GradeSchema = InferInput<typeof gradeSchema>

function UpdateExistingGradeByLec() {
  const {
    openUpdateExistingGrade,
    toogleUpdateExistingGrade,
    subject,
    studentGrade,
    idClass,
    currentTermGrade,
    currentGradeSubjectIndex,
    setCurrentTermGrade,
    setCurrentGradeSubjectIndex,
    setIsUpdatingExisting,
    currentGradeId,
    currentTermGradeId,
    setCurrentGradeId,
    setCurrentTermGradeId
  } = useGradeStore()

  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const currentGradeOfSubject = currentTermGrade?.gradeOfSubject[currentGradeSubjectIndex]

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

  // Set initial values when modal opens
  useEffect(() => {
    if (openUpdateExistingGrade && currentGradeOfSubject && currentTermGrade) {
      reset({
        term: currentTermGrade.term._id,
        grade: currentGradeOfSubject.grade || 0
      })
    }
  }, [openUpdateExistingGrade, currentGradeOfSubject, currentTermGrade, reset])

  const handleClose = useCallback(() => {
    toogleUpdateExistingGrade()
    setCurrentTermGrade(null as any)
    setCurrentGradeSubjectIndex(-1)
    setIsUpdatingExisting(false)
    setCurrentGradeId('')
    setCurrentTermGradeId('')
    setSearchTerm('')
    setPage(1)
    reset()
  }, [
    toogleUpdateExistingGrade,
    setCurrentTermGrade,
    setCurrentGradeSubjectIndex,
    setIsUpdatingExisting,
    setCurrentGradeId,
    setCurrentTermGradeId,
    reset
  ])

  const onSubmit = handleSubmit(data => {
    if (!currentTermGrade || currentGradeSubjectIndex === -1 || !currentGradeId || !currentTermGradeId) {
      toast.error('Không tìm thấy thông tin điểm cần cập nhật')

      return
    }

    // Tạo bản copy của termGrade hiện tại và cập nhật điểm mới
    const updatedGradeOfSubject = [...currentTermGrade.gradeOfSubject]

    updatedGradeOfSubject[currentGradeSubjectIndex] = {
      ...updatedGradeOfSubject[currentGradeSubjectIndex],
      grade: data.grade
    }

    const dataFormat = {
      termGrades: [
        {
          term: data.term, // Sử dụng học kỳ từ form
          gradeOfSubject: updatedGradeOfSubject.map(grade => ({
            subjectId: grade.subjectId._id,
            grade: grade.grade
          }))
        }
      ]
    }

    const toastId = toast.loading('Đang cập nhật điểm...')

    setIsLoading(true)

    gradeService.updateGrade(
      currentGradeId, // gradeId từ store
      currentTermGradeId, // termGradeId từ store
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
      open={openUpdateExistingGrade}
      onClose={handleClose}
      title={`Cập nhật điểm ${subject?.courseName} - ${studentGrade?.userName}`}
      maxWidth='md'
      fullWidth
      onSubmit={onSubmit}
      actions={
        <>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Đóng
          </Button>
          <LoadingButton disabled={!isValid} loading={isLoading} type='submit' variant='contained' color='primary'>
            Cập nhật
          </LoadingButton>
        </>
      }
    >
      {/* Thông tin sinh viên và môn học */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom color='primary'>
            Thông tin cập nhật điểm
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

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Học kỳ:
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {currentTermGrade?.term?.termName || 'Chưa xác định'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Mã HK: {currentTermGrade?.term?.abbreviatName || 'Chưa xác định'} | Năm học:{' '}
                  {currentTermGrade?.term?.academicYear || 'Chưa xác định'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Điểm hiện tại:
                </Typography>
                <Chip
                  label={currentGradeOfSubject?.grade || 0}
                  color={
                    (currentGradeOfSubject?.grade || 0) >= 8
                      ? 'success'
                      : (currentGradeOfSubject?.grade || 0) >= 6.5
                        ? 'warning'
                        : (currentGradeOfSubject?.grade || 0) < 5
                          ? 'error'
                          : 'default'
                  }
                  size='medium'
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Typography variant='h6' gutterBottom>
        Cập nhật điểm số
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name='term'
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
                    setSearchTerm('')
                  } else {
                    field.onChange('')
                    setSearchTerm('')
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
                        setPage(1)
                      }
                    }}
                    onFocus={() => {
                      if (!field.value) {
                        setSearchTerm('')
                        setPage(1)
                      }
                    }}
                  />
                )}
                ListboxProps={{
                  onScroll: (event: React.SyntheticEvent) => {
                    const listboxNode = event.currentTarget

                    if (
                      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1 &&
                      !isLoadingTerms &&
                      terms?.terms.length &&
                      terms.terms.length < total
                    ) {
                      setPage(prev => prev + 1)
                    }
                  }
                }}
                loading={isLoadingTerms}
                noOptionsText='Không tìm thấy học kỳ'
                filterOptions={(options, state) => {
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
                label='Điểm số mới'
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

export default memo(UpdateExistingGradeByLec)
