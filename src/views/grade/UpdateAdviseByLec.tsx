'use client'

import { memo, useCallback, useState, useEffect, useMemo } from 'react'

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
  ListItemText,
  IconButton,
  TextField
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
import type { AdviseType } from '@/types/management/adviseType'
import { useShare } from '@/hooks/useShare'
import Iconify from '@/components/iconify'

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
    setCurrentAdviseTermId,
    currentGradeData
  } = useGradeStore()

  const { termOptions } = useShare()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedTermGrade, setSelectedTermGrade] = useState<TermGradeType | null>(null)

  // State cho chỉnh sửa ghi chú
  const [editingAdviseId, setEditingAdviseId] = useState<string | null>(null)
  const [editingAdviseText, setEditingAdviseText] = useState<string>('')
  const [isUpdatingAdvise, setIsUpdatingAdvise] = useState(false)

  const {
    data: adviseData,
    isLoading: isLoadingAdvise,
    isValidating: isValidatingAdvise,
    mutate: mutateAdvise
  } = useSWR(
    currentGradeData?.studentId._id ? [`/api/grade/view-advise/${currentGradeData?.studentId._id}`] : null,
    () => gradeService.getAdviseByStudentId(currentGradeData?.studentId._id || ''),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  )

  const availableTerms = useMemo(() => {
    return currentGradeData?.termGrades || []
  }, [currentGradeData])

  // Gộp các kỳ học giống nhau lại với nhau
  const mergedTerms = useMemo(() => {
    if (!availableTerms.length) return []

    const termMap = new Map<string, TermGradeType>()

    availableTerms.forEach(termGrade => {
      const termId = termGrade.term?._id

      if (!termId) return

      if (termMap.has(termId)) {
        // Gộp gradeOfSubject vào term đã có
        const existingTerm = termMap.get(termId)!

        existingTerm.gradeOfSubject = [...existingTerm.gradeOfSubject, ...termGrade.gradeOfSubject]

        // Giữ advise của term cuối cùng (hoặc term có advise)
        if (termGrade.advise) {
          existingTerm.advise = termGrade.advise
        }
      } else {
        // Tạo term mới
        termMap.set(termId, {
          ...termGrade,
          term: {
            ...termGrade.term,
            termName: termGrade.term?.termName || '',
            abbreviatName: termGrade.term?.abbreviatName || ''
          },
          gradeOfSubject: [...termGrade.gradeOfSubject]
        })
      }
    })

    return Array.from(termMap.values())
  }, [availableTerms])

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
  const selectedTermId = watch('selectedTerm')

  // Reset form when modal opens
  useEffect(() => {
    if (openUpdateAdvise) {
      reset({
        selectedTerm: '',
        advise: ''
      })
      setSelectedTermGrade(null)
      setEditingAdviseId(null)
      setEditingAdviseText('')
    }
  }, [openUpdateAdvise, reset])

  // Update selectedTermGrade khi chọn học kỳ
  useEffect(() => {
    if (selectedTermId) {
      const termGrade = mergedTerms.find(tg => tg.term?._id === selectedTermId)

      setSelectedTermGrade(termGrade || null)
    } else {
      setSelectedTermGrade(null)
    }
  }, [selectedTermId, mergedTerms])

  useEffect(() => {
    if (selectedTermGrade) {
      reset({
        selectedTerm: selectedTermGrade.term?._id || '',
        advise: selectedTermGrade.advise || ''
      })
    }
  }, [selectedTermGrade, reset])

  const handleClose = useCallback(() => {
    toogleUpdateAdvise()
    setCurrentAdviseGradeId('')
    setCurrentAdviseTermId('')
    setSelectedTermGrade(null)
    setEditingAdviseId(null)
    setEditingAdviseText('')
    reset()
  }, [toogleUpdateAdvise, setCurrentAdviseGradeId, setCurrentAdviseTermId, reset])

  // Hàm bắt đầu chỉnh sửa ghi chú
  const handleStartEdit = (adviseId: string, adviseText: string) => {
    setEditingAdviseId(adviseId)
    setEditingAdviseText(adviseText)
  }

  // Hàm hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingAdviseId(null)
    setEditingAdviseText('')
  }

  // Hàm lưu cập nhật ghi chú
  const handleUpdateAdvise = async () => {
    if (!editingAdviseId || !editingAdviseText.trim()) {
      toast.error('Vui lòng nhập nội dung ghi chú')

      return
    }

    const toastId = toast.loading('Đang cập nhật ghi chú...')

    setIsUpdatingAdvise(true)

    gradeService.updateAdvise(
      editingAdviseId,
      { advise: editingAdviseText.trim() },
      () => {
        setIsUpdatingAdvise(false)
        mutateAdvise()
        toast.update(toastId, {
          render: 'Cập nhật ghi chú thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        handleCancelEdit()
      },
      err => {
        setIsUpdatingAdvise(false)
        toast.update(toastId, {
          render: err?.message || 'Cập nhật ghi chú thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  }

  const onSubmit = handleSubmit(data => {
    if (!currentAdviseGradeId || !data.selectedTerm) {
      toast.error('Không tìm thấy thông tin cần thiết để cập nhật tư vấn')

      return
    }

    const toastId = toast.loading('Đang cập nhật tư vấn...')

    setIsLoading(true)

    gradeService.createAdvise(
      currentGradeData?.studentId._id || '',
      data.selectedTerm,
      { advise: data.advise },
      () => {
        setIsLoading(false)
        mutate([`/api/grade/view-grade-GV/${idClass}`, idClass])
        mutateAdvise()
        toast.update(toastId, {
          render: 'Cập nhật tư vấn thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setIsLoading(false)
        toast.update(toastId, {
          render: err?.message || 'Cập nhật tư vấn thất bại',
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
      open={openUpdateAdvise}
      onClose={handleClose}
      title={`Ghi chú các vấn đề ${studentGrade?.userName} cần phải lưu ý `}
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
      <Divider sx={{ mb: 3 }} />

      {/* Hiển thị tất cả học kỳ đã hoàn thành */}
      <Typography variant='h5' gutterBottom>
        Thông tin chi tiết các học kỳ đã hoàn thành
      </Typography>

      {mergedTerms.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {mergedTerms.map(termGrade => (
            <Grid item xs={12} md={6} key={termGrade._id}>
              <Card sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardContent>
                  <Typography variant='h6' gutterBottom color='primary'>
                    {termGrade.term?.abbreviatName} - {termGrade.term?.termName}
                  </Typography>

                  <Typography variant='subtitle2' gutterBottom>
                    Các môn học trong kỳ:
                  </Typography>

                  <List dense>
                    {termGrade.gradeOfSubject?.map((subject, index) => (
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ mb: 3, p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            Sinh viên chưa có dữ liệu học kỳ nào
          </Typography>
        </Card>
      )}

      <Divider sx={{ mb: 3 }} />

      <Typography variant='h5' gutterBottom>
        Thêm ghi chú cho sinh viên
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='selectedTerm'
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={termOptions.sort((a, b) => a.abbreviatName.localeCompare(b.abbreviatName)) || []}
                getOptionLabel={option => `${option.abbreviatName} - ${option.termName} - ${option.status}` || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(_, value) => {
                  if (value) {
                    field.onChange(value._id)

                    // Cập nhật termGrade tương ứng để hiển thị chi tiết
                    const termGrade = mergedTerms.find(tg => tg.term?._id === value._id)

                    setSelectedTermGrade(termGrade || null)
                  } else {
                    field.onChange('')
                    setSelectedTermGrade(null)
                  }
                }}
                value={termOptions?.find(term => term._id === field.value) || null}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Chọn học kỳ để thêm ghi chú'
                    {...(errors.selectedTerm && {
                      error: true,
                      helperText: errors.selectedTerm.message?.toString()
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

        <Grid item xs={12}>
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
      </Grid>

      <Card sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant='body2' color='black'>
          💡 <strong>Gợi ý:</strong> Hãy tư vấn cho sinh viên về:
        </Typography>
        <Typography variant='body2' sx={{ mt: 1, ml: 2 }} color='black'>
          • Các môn học cần ưu tiên đăng ký trong học kỳ tới
          <br />
          • Môn tiên quyết cần hoàn thành trước
          <br />
          • Lịch học phù hợp và tải học phù hợp
          <br />• Các kỹ năng cần cải thiện
        </Typography>
      </Card>

      {/* Lịch sử lời khuyên */}
      <Divider sx={{ my: 3 }} />

      <Typography variant='h5' gutterBottom>
        Lịch sử ghi chú
      </Typography>

      {isLoadingAdvise || isValidatingAdvise ? (
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            Đang tải lịch sử ghi chú...
          </Typography>
        </Card>
      ) : adviseData && adviseData.length > 0 ? (
        <Grid container spacing={2}>
          {adviseData.map((adviseRecord: AdviseType) => (
            <Grid item xs={12} key={adviseRecord._id}>
              <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant='h6' gutterBottom color='primary'>
                    Học kỳ {adviseRecord.termId.abbreviatName}
                  </Typography>

                  {adviseRecord.allAdvise.map(advise => (
                    <Box key={advise._id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      {editingAdviseId === advise._id ? (
                        <Box>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={editingAdviseText}
                            onChange={e => setEditingAdviseText(e.target.value)}
                            sx={{ mb: 2 }}
                            inputProps={{ maxLength: 255 }}
                            helperText={`${editingAdviseText.length}/255 ký tự`}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <LoadingButton
                              size='small'
                              variant='contained'
                              onClick={handleUpdateAdvise}
                              loading={isUpdatingAdvise}
                            >
                              Lưu
                            </LoadingButton>
                            <Button
                              size='small'
                              variant='outlined'
                              onClick={handleCancelEdit}
                              disabled={isUpdatingAdvise}
                            >
                              Hủy
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant='h6' sx={{ mb: 1, flex: 1 }}>
                              {advise.advise}
                            </Typography>
                            <IconButton
                              size='small'
                              onClick={() => handleStartEdit(advise._id, advise.advise)}
                              sx={{ ml: 1 }}
                            >
                              <Iconify icon='tabler:edit' />
                            </IconButton>
                          </Box>
                          <Typography variant='caption' color='text.secondary'>
                            Ngày tạo: {new Date(advise.createdAdviseAt).toLocaleString('vi-VN')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            Chưa có ghi chú nào cho sinh viên này
          </Typography>
        </Card>
      )}
    </CustomDialog>
  )
}

export default memo(UpdateAdviseByLec)
