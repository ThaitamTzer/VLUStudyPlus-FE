'use client'

import { memo, useCallback, useState, useEffect } from 'react'

import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material'

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
import type { TermGradeType } from '@/types/management/gradeTypes'

const adviseSchema = v.object({
  selectedTerm: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn kỳ học')),
  advise: v.pipe(v.string(), v.maxLength(255, 'Lời khuyên không được vượt quá 255 ký tự'))
})

type AdviseSchema = InferInput<typeof adviseSchema>

function UpdateAdviseByLec() {
  const {
    openUpdateAdvise,
    toogleUpdateAdvise,
    studentGrade,
    idClass,
    currentAdviseGradeId,
    setCurrentAdviseGradeId,
    setCurrentAdviseTermId
  } = useGradeStore()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedTermGrade, setSelectedTermGrade] = useState<TermGradeType | null>(null)

  // Lấy dữ liệu sinh viên để có termGrades
  const { data: studentData } = useSWR(
    openUpdateAdvise && currentAdviseGradeId ? [`/api/grade/view-grade-GV-detail/${currentAdviseGradeId}`] : null,
    () => gradeService.getGradeById(currentAdviseGradeId),
    {
      revalidateOnFocus: false
    }
  )

  const availableTerms = studentData?.termGrades || []

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<AdviseSchema>({
    mode: 'all',
    resolver: valibotResolver(adviseSchema),
    defaultValues: {
      selectedTerm: '',
      advise: ''
    }
  })

  const adviseValue = watch('advise')

  // Reset form when modal opens
  useEffect(() => {
    if (openUpdateAdvise) {
      reset({
        selectedTerm: '',
        advise: ''
      })
      setSelectedTermGrade(null)
    }
  }, [openUpdateAdvise, reset])

  // Update form when term is selected
  useEffect(() => {
    if (selectedTermGrade) {
      reset({
        selectedTerm: selectedTermGrade._id,
        advise: selectedTermGrade.advise || ''
      })
    }
  }, [selectedTermGrade, reset])

  const handleClose = useCallback(() => {
    toogleUpdateAdvise()
    setCurrentAdviseGradeId('')
    setCurrentAdviseTermId('')
    setSelectedTermGrade(null)
    reset()
  }, [toogleUpdateAdvise, setCurrentAdviseGradeId, setCurrentAdviseTermId, reset])

  const onSubmit = handleSubmit(data => {
    if (!currentAdviseGradeId || !data.selectedTerm) {
      toast.error('Không tìm thấy thông tin cần thiết để cập nhật lời khuyên')

      return
    }

    const toastId = toast.loading('Đang cập nhật lời khuyên...')

    setIsLoading(true)

    gradeService.updateAdvise(
      currentAdviseGradeId,
      data.selectedTerm,
      { advise: data.advise },
      () => {
        setIsLoading(false)
        mutate([`/api/grade/view-grade-GV/${idClass}`, idClass])
        handleClose()
        toast.update(toastId, {
          render: 'Cập nhật lời khuyên thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setIsLoading(false)
        toast.update(toastId, {
          render: err?.message || 'Cập nhật lời khuyên thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  })

  return (
    <CustomDialog
      open={openUpdateAdvise}
      onClose={handleClose}
      title={`Ghi chú các vấn đề ${studentGrade?.userName} cần phải lưu ý `}
      maxWidth='lg'
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
      {/* Thông tin sinh viên */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom color='primary'>
            Thông tin sinh viên
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
                  Số kỳ đã học:
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {availableTerms.length} kỳ
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Typography variant='h6' gutterBottom>
        Chọn kỳ học và nhập lời khuyên
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name='selectedTerm'
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={availableTerms}
                getOptionLabel={option => option.term?.abbreviatName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant='body2' fontWeight='medium'>
                        {option.term?.abbreviatName} - {option.term?.termName}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Năm học: {option.term?.academicYear}
                      </Typography>
                    </Box>
                  </li>
                )}
                onChange={(_, value) => {
                  if (value) {
                    field.onChange(value._id)
                    setSelectedTermGrade(value as any)
                  } else {
                    field.onChange('')
                    setSelectedTermGrade(null)
                  }
                }}
                value={availableTerms.find(term => term._id === field.value) || null}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Chọn kỳ học'
                    {...(errors.selectedTerm && {
                      error: true,
                      helperText: errors.selectedTerm.message?.toString()
                    })}
                  />
                )}
                noOptionsText='Không có kỳ học nào'
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name='advise'
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Lời khuyên/Tư vấn'
                multiline
                rows={4}
                fullWidth
                placeholder='Nhập lời khuyên cho sinh viên về các môn học nên đăng ký trong học kỳ tới...'
                {...(errors.advise && {
                  error: true,
                  helperText: errors.advise.message?.toString()
                })}
                helperText={errors.advise?.message?.toString() || `${adviseValue?.length || 0}/255 ký tự`}
                inputProps={{
                  maxLength: 255
                }}
              />
            )}
          />
        </Grid>

        {/* Hiển thị thông tin chi tiết kỳ được chọn */}
        {selectedTermGrade && (
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'background.neutral', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant='h6' gutterBottom color='primary'>
                  Thông tin chi tiết kỳ {selectedTermGrade.term?.abbreviatName}
                </Typography>

                <Typography variant='subtitle2' gutterBottom>
                  Các môn học trong kỳ:
                </Typography>

                <List dense>
                  {selectedTermGrade.gradeOfSubject?.map((subject, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          <Box display='flex' alignItems='center' gap={1}>
                            <Typography variant='body2' fontWeight='medium'>
                              {subject.subjectId?.courseName}
                            </Typography>
                            <Chip
                              label={subject.grade}
                              size='small'
                              color={
                                subject.grade >= 8
                                  ? 'success'
                                  : subject.grade >= 6.5
                                    ? 'warning'
                                    : subject.grade < 5
                                      ? 'error'
                                      : 'default'
                              }
                            />
                          </Box>
                        }
                        secondary={`${subject.subjectId?.credits || 0} tín chỉ`}
                      />
                    </ListItem>
                  ))}
                </List>

                {selectedTermGrade.advise && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
                    <Typography variant='subtitle2' color='info.dark'>
                      Lời khuyên hiện tại:
                    </Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}>
                      {selectedTermGrade.advise}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Card sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant='body2'>
          💡 <strong>Gợi ý:</strong> Hãy tư vấn cho sinh viên về:
        </Typography>
        <Typography variant='body2' sx={{ mt: 1, ml: 2 }}>
          • Các môn học cần ưu tiên đăng ký trong học kỳ tới
          <br />
          • Môn tiên quyết cần hoàn thành trước
          <br />
          • Lịch học phù hợp và tải học phù hợp
          <br />• Các kỹ năng cần cải thiện
        </Typography>
      </Card>
    </CustomDialog>
  )
}

export default memo(UpdateAdviseByLec)
