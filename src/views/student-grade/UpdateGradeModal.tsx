'use client'

import { useCallback, useState, useEffect, useMemo } from 'react'

import { Grid, Box, Button, Typography, Card, CardContent, Divider, Chip } from '@mui/material'

import type { KeyedMutator } from 'swr'

import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'
import CustomTextField from '@/@core/components/mui/TextField'
import gradeService from '@/services/grade.service'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { useShare } from '@/hooks/useShare'

const gradeSchema = v.object({
  term: v.pipe(v.string(), v.nonEmpty('Mã học kỳ không được để trống')),
  grade: v.pipe(
    v.number('Điểm phải là số'),
    v.minValue(0, 'Điểm không được âm'),
    v.maxValue(10, 'Điểm không được lớn hơn 10')
  )
})

type GradeSchema = InferInput<typeof gradeSchema>

export default function ModalUpdateGrade({ mutate }: { mutate: KeyedMutator<any> }) {
  const { openUpdateGradeStudent, toogleUpdateGradeStudent, termGradeUpdate, subject, subjectId } = useGradeStore()
  const [isLoading, setIsLoading] = useState(false)

  const { termOptions } = useShare()

  // const { data: terms, isLoading: isLoadingTerms } = useSWR(
  //   ['termsOptions', page, 10, '', '', '', ''],
  //   () => termService.getAll(page, 10, '', '', '', '', '', ''),
  //   {
  //     onSuccess: data => {
  //       setTotal(data.pagination.totalItems)
  //     },
  //     revalidateOnMount: true
  //   }
  // )

  // Tìm điểm hiện tại của môn học
  const currentGradeOfSubject = useMemo(() => {
    if (!termGradeUpdate || !subjectId) return null

    return termGradeUpdate.gradeOfSubject.find(gradeSubject => gradeSubject.subjectId._id === subjectId)
  }, [termGradeUpdate, subjectId])

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

  // Set điểm hiện tại khi modal mở
  useEffect(() => {
    if (openUpdateGradeStudent && currentGradeOfSubject) {
      reset({
        term: termGradeUpdate?.term._id || '',
        grade: currentGradeOfSubject.grade || 0
      })
    }
  }, [openUpdateGradeStudent, currentGradeOfSubject, reset, termGradeUpdate?.term._id])

  const handleClose = useCallback(() => {
    toogleUpdateGradeStudent()
    reset()
  }, [toogleUpdateGradeStudent, reset])

  const onSubmit = handleSubmit(data => {
    if (!termGradeUpdate || !subjectId) {
      toast.error('Không tìm thấy thông tin điểm cần cập nhật')

      return
    }

    const toastId = toast.loading('Đang cập nhật điểm...')

    setIsLoading(true)

    // Tạo bản sao của toàn bộ gradeOfSubject từ học kỳ hiện tại
    const updatedGradeOfSubject = termGradeUpdate.gradeOfSubject.map(gradeSubject => {
      // Nếu là môn học đang được cập nhật, thay đổi điểm
      if (gradeSubject.subjectId._id === subjectId) {
        return {
          subjectId: gradeSubject.subjectId._id,
          grade: data.grade
        }
      }

      // Các môn khác giữ nguyên điểm cũ
      return {
        subjectId: gradeSubject.subjectId._id,
        grade: gradeSubject.grade
      }
    })

    // Tạo data cập nhật với toàn bộ dữ liệu môn học trong học kỳ

    const submitData = {
      termGrades: [
        {
          term: data.term,
          gradeOfSubject: updatedGradeOfSubject
        }
      ]
    }

    gradeService.updateGradeStudent(
      termGradeUpdate._id,
      submitData,
      () => {
        setIsLoading(false)
        mutate()
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
      open={openUpdateGradeStudent}
      onClose={handleClose}
      title={`Cập nhật điểm môn học`}
      maxWidth='sm'
      fullWidth
      onSubmit={onSubmit}
      actions={
        <>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Đóng
          </Button>
          <LoadingButton disabled={!isValid} loading={isLoading} type='submit' variant='contained' color='primary'>
            Cập nhật điểm
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={3}>
        {/* Thông tin môn học */}
        {subject && (
          <Grid item xs={12}>
            <Card variant='outlined' sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  📚 Thông tin môn học
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant='body1'>
                    <strong>Mã môn:</strong> {subject.courseCode}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Tên môn:</strong> {subject.courseName}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Số tín chỉ:</strong> {subject.credits}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Thông tin học kỳ */}
        {termGradeUpdate && (
          <Grid item xs={12}>
            <Card variant='outlined' sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  📅 Thông tin học kỳ
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='body1'>
                  <strong>Học kỳ:</strong> {termGradeUpdate.term.abbreviatName}
                </Typography>

                {/* Hiển thị các môn học khác trong cùng học kỳ */}
                {termGradeUpdate.gradeOfSubject.length > 1 && (
                  <>
                    <Typography variant='body2' sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      📋 Các môn học khác trong học kỳ này (sẽ được giữ nguyên):
                    </Typography>
                    {termGradeUpdate.gradeOfSubject
                      .filter(gradeSubject => gradeSubject.subjectId._id !== subjectId)
                      .map((gradeSubject, index) => (
                        <Box
                          key={index}
                          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}
                        >
                          <Typography variant='body2' color='text.secondary'>
                            • {gradeSubject.subjectId.courseName}
                          </Typography>
                          <Chip
                            label={`Điểm: ${gradeSubject.grade}`}
                            size='small'
                            variant='outlined'
                            color={
                              gradeSubject.grade >= 8
                                ? 'success'
                                : gradeSubject.grade >= 6.5
                                  ? 'warning'
                                  : gradeSubject.grade < 5
                                    ? 'error'
                                    : 'default'
                            }
                          />
                        </Box>
                      ))}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Nhập mã học kỳ */}
        <Grid item xs={12}>
          <Controller
            control={control}
            name='term'
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={termOptions || []}
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
                  } else {
                    field.onChange('')
                  }
                }}
                value={termOptions?.find(term => term._id === field.value) || null}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Chọn học kỳ'
                    {...(errors.term && {
                      error: true,
                      helperText: errors.term.message?.toString()
                    })}
                  />
                )}
                noOptionsText='Không tìm thấy học kỳ'
                filterOptions={(options, state) => {
                  const filtered = options?.filter(option =>
                    option.termName.toLowerCase().includes(state.inputValue.toLowerCase())
                  )

                  return filtered
                }}
              />
            )}
          />
        </Grid>

        {/* Nhập điểm mới */}
        <Grid item xs={12}>
          <Controller
            control={control}
            name='grade'
            render={({ field }) => (
              <CustomTextField
                {...field}
                {...(errors.grade && {
                  error: true,
                  helperText: errors.grade.message?.toString()
                })}
                type='number'
                onChange={e => {
                  const value = e.target.value === '' ? '' : parseFloat(e.target.value)

                  if (value === '' || !isNaN(value)) {
                    field.onChange(value)
                  }
                }}
                value={field.value}
                label={`Điểm số hiện tại: ${currentGradeOfSubject?.grade || 0} → Điểm mới (0 - 10)`}
                fullWidth
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
