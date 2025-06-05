'use client'

import { useCallback, useState } from 'react'

import { Grid, Box, Button, Typography, Chip, Card, CardContent, Divider } from '@mui/material'

import type { KeyedMutator } from 'swr'
import useSWR from 'swr'

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
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import gradeService from '@/services/grade.service'

const gradeSchema = v.object({
  term: v.pipe(v.string(), v.nonEmpty('Học kỳ không được để trống')),
  grade: v.pipe(
    v.number('Điểm phải là số'),
    v.minValue(0, 'Điểm không được âm'),
    v.maxValue(10, 'Điểm không được lớn hơn 10')
  )
})

type GradeSchema = InferInput<typeof gradeSchema>

export default function ImportGradeModal({ mutate }: { mutate: KeyedMutator<any> }) {
  const { openImportGradeStudent, toogleImportGradeStudent, subject, subjectId } = useGradeStore()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { data: terms, isLoading: isLoadingTerms } = useSWR(
    ['terms', page, 10, '', '', '', searchTerm],
    () => termService.getAll(page, 10, '', '', '', '', '', searchTerm),
    {
      onSuccess: data => {
        setTotal(data.pagination.totalItems)
      },
      revalidateOnMount: true
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

  const handleClose = useCallback(() => {
    toogleImportGradeStudent()
    setSearchTerm('')
    setPage(1)
    reset()
  }, [toogleImportGradeStudent, reset])

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
    const toastId = toast.loading('Đang nhập điểm...')

    setIsLoading(true)

    // Tạo data theo format mong đợi
    const submitData = {
      termGrades: [
        {
          term: data.term,
          gradeOfSubject: [
            {
              subjectId: subjectId,
              grade: data.grade
            }
          ]
        }
      ]
    }

    gradeService.importGradeStudent(
      submitData,
      () => {
        setIsLoading(false)
        mutate()
        handleClose()
        toast.update(toastId, {
          render: 'Nhập điểm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setIsLoading(false)
        toast.update(toastId, {
          render: err?.message || 'Nhập điểm thất bại',
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
      open={openImportGradeStudent}
      onClose={handleClose}
      title={`Nhập điểm môn học`}
      maxWidth='sm'
      fullWidth
      onSubmit={onSubmit}
      actions={
        <>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Đóng
          </Button>
          <LoadingButton disabled={!isValid} loading={isLoading} type='submit' variant='contained' color='primary'>
            Lưu điểm
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

        {/* Chọn học kỳ */}
        <Grid item xs={12}>
          <Controller
            control={control}
            name='term'
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={terms?.terms || []}
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
                value={terms?.terms.find(term => term._id === field.value) || null}
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
                ListboxProps={{
                  onScroll: handleScroll
                }}
                loading={isLoadingTerms}
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

        {/* Nhập điểm */}
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
                label='Điểm số (0 - 10)'
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
