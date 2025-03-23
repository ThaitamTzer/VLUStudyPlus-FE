'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  Button,
  DialogActions,
  Paper,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import type { KeyedMutator } from 'swr'

import { LoadingButton } from '@mui/lab'

import { toast } from 'react-toastify'

import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'

import { useStudentAcedemicProcessStore } from '@/stores/studentAcedemicProcess.store'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import { schema } from './schema/validate'

type FormData = InferInput<typeof schema>

export default function UpdateCommitmentForm({ mutate }: { mutate: KeyedMutator<any> }) {
  const { openUpdateCommitmentForm, toogleUpdateCommitmentForm, commitmentFormObj, setCommitmentFormObj } =
    useStudentAcedemicProcessStore()

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      title: 'ĐƠN CAM KẾT CẢI THIỆN TÌNH HÌNH HỌC TẬP',
      phoneNumber: '',
      phoneNumberParent: '',
      averageScore: 0,
      credit: 0,
      numberOfViolations: 0,
      reason: '',
      aspiration: '',
      commitment: false,
      debt: [
        {
          term: '',
          subjects: ['']
        }
      ],
      processing: [
        {
          term: '',
          typeProcessing: ''
        }
      ]
    }
  })

  useEffect(() => {
    if (!commitmentFormObj) return

    reset({
      title: commitmentFormObj.title,
      phoneNumber: commitmentFormObj.phoneNumber,
      phoneNumberParent: commitmentFormObj.phoneNumberParent,
      averageScore: commitmentFormObj.averageScore,
      credit: commitmentFormObj.credit,
      numberOfViolations: commitmentFormObj.numberOfViolations,
      reason: commitmentFormObj.reason,
      aspiration: commitmentFormObj.aspiration,
      commitment: commitmentFormObj.commitment,
      debt: commitmentFormObj.debt.map(item => ({
        term: item.term,
        subjects: item?.subject?.split(', ')?.map((subject: string) => subject.trim())
      })),
      processing: commitmentFormObj.processing
    })
  }, [commitmentFormObj, reset])

  const onClose = () => {
    toogleUpdateCommitmentForm()
    reset()
    setCommitmentFormObj(null)
  }

  const {
    fields: processingFields,
    prepend: addProcessing,
    remove: removeProcessing
  } = useFieldArray({ control, name: 'processing' })

  const {
    fields: debtFields,
    append: addDebt,
    remove: removeDebt,
    update: updateDebt
  } = useFieldArray({ control, name: 'debt' })

  const handleAddDebt = () => {
    addDebt({ term: '', subjects: [''] })
  }

  const handleAddSubject = (index: number) => {
    // Lấy giá trị hiện tại của `term` và `subjects` từ form
    const currentTerm = getValues(`debt.${index}.term`)
    const currentSubjects = getValues(`debt.${index}.subjects`)

    // Thêm một môn học mới vào mảng subjects
    const newSubjects = [...currentSubjects, '']

    // Cập nhật lại debt với giá trị mới
    updateDebt(index, { term: currentTerm, subjects: newSubjects })
  }

  const onSubmit = handleSubmit(async data => {
    if (!commitmentFormObj) return toast.error('Có lỗi xảy ra, vui lòng thử lại sau')

    const newData = {
      ...data,
      debt: data.debt.map(item => ({
        term: item.term,
        subject: item.subjects.filter(subject => subject.trim() !== '').join(', ')
      }))
    }

    setLoading(true)
    const toastId = toast.loading('Đang cập nhật đơn cam kết...')

    await studentAcedemicProcessService.updateCommitmentForm(
      commitmentFormObj._id,
      newData,
      () => {
        toast.update(toastId, {
          render: 'Cập nhật đơn cam kết thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
        mutate()
        onClose()
      },
      err => {
        toast.update(toastId, {
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
    <Dialog open={openUpdateCommitmentForm} onClose={onClose} maxWidth='md' fullWidth>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <form onSubmit={onSubmit}>
          <DialogTitle>
            <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
              <Iconify icon='eva:close-fill' color='black' />
            </IconButton>
            <Typography variant='h4' textAlign='center'>
              Cập nhật đơn cam kết
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Tiêu đề'
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='phoneNumber'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Số điện thoại'
                      fullWidth
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='phoneNumberParent'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Số điện thoại phụ huynh'
                      fullWidth
                      error={!!errors.phoneNumberParent}
                      helperText={errors.phoneNumberParent?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='averageScore'
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <CustomTextField
                      {...field}
                      label='Điểm trung bình'
                      type='number'
                      fullWidth
                      onChange={e => {
                        const newValue = e.target.value

                        onChange(newValue === '' ? 0 : Number(newValue))
                      }}
                      onFocus={e => e.target.select()}
                      error={!!errors.averageScore}
                      helperText={errors.averageScore?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='credit'
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <CustomTextField
                      {...field}
                      label='Số tín chỉ'
                      type='number'
                      onChange={e => {
                        const newValue = e.target.value

                        onChange(newValue === '' ? 0 : Number(newValue))
                      }}
                      onFocus={e => e.target.select()}
                      fullWidth
                      error={!!errors.credit}
                      helperText={errors.credit?.message}
                    />
                  )}
                />
              </Grid>
              {processingFields.map((item, index) => (
                <Grid container item xs={12} spacing={2} key={item.id}>
                  <Grid item xs={3}>
                    <Controller
                      name={`processing.${index}.term`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label='Học kỳ'
                          fullWidth
                          {...(errors.processing?.[index]?.term && {
                            error: true,
                            helperText: errors.processing?.[index]?.term.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Controller
                      name={`processing.${index}.typeProcessing`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label='Loại xử lý'
                          fullWidth
                          {...(errors.processing?.[index]?.typeProcessing && {
                            error: true,
                            helperText: errors.processing?.[index]?.typeProcessing.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                  {processingFields.length > 1 && (
                    <Grid item xs={2}>
                      <Button onClick={() => removeProcessing(index)} color='error'>
                        Xóa
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Button onClick={() => addProcessing({ term: '', typeProcessing: '' })}>Thêm trạng thái xử lý</Button>
              <Grid item xs={12}>
                <Controller
                  name='numberOfViolations'
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <CustomTextField
                      {...field}
                      label='Số lần vi phạm'
                      type='number'
                      fullWidth
                      onChange={e => {
                        const newValue = e.target.value

                        onChange(newValue === '' ? 0 : Number(newValue))
                      }}
                      onFocus={e => e.target.select()}
                      error={!!errors.numberOfViolations}
                      helperText={errors.numberOfViolations?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='reason'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Lý do'
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.reason}
                      helperText={errors.reason?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='aspiration'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Nguyện vọng'
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.aspiration}
                      helperText={errors.aspiration?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item>Danh sách các học phần đang nợ và dự kiến kế hoạch trả nợ:</Grid>
              {debtFields.map((item, index) => (
                <Grid container item xs={12} spacing={2} key={item.id}>
                  {/* Trường học kỳ */}
                  <Grid item xs={3}>
                    <Controller
                      name={`debt.${index}.term`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label='Học kỳ'
                          fullWidth
                          value={field.value || ''}
                          error={!!errors.debt?.[index]?.term}
                          helperText={errors.debt?.[index]?.term?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Các trường môn học */}
                  <Grid item xs={5}>
                    {item?.subjects?.map((_, subjectIndex) => (
                      <Stack key={subjectIndex} spacing={2} direction='row' alignItems='flex-start'>
                        <Controller
                          name={`debt.${index}.subjects.${subjectIndex}`}
                          control={control}
                          render={({ field }) => (
                            <CustomTextField
                              {...field}
                              label={`Môn học ${subjectIndex + 1}`}
                              fullWidth
                              value={field.value || ''} // Đảm bảo giá trị không bị undefined
                              error={!!errors.debt?.[index]?.subjects?.[subjectIndex]}
                              helperText={errors.debt?.[index]?.subjects?.[subjectIndex]?.message}
                            />
                          )}
                        />
                        {item.subjects.length > 1 && (
                          <Button
                            variant='outlined'
                            color='error'
                            sx={{ marginTop: '18px !important' }}
                            onClick={() => {
                              const currentSubjects = getValues(`debt.${index}.subjects`)
                              const newSubjects = currentSubjects.filter((_: any, i: any) => i !== subjectIndex)

                              updateDebt(index, { ...item, subjects: newSubjects })
                            }}
                          >
                            Xóa
                          </Button>
                        )}
                      </Stack>
                    ))}
                    <Button onClick={() => handleAddSubject(index)}>Thêm môn học</Button>
                  </Grid>

                  {/* Nút xóa kỳ */}
                  {debtFields.length > 1 && (
                    <Grid item xs={1.5} alignSelf='flex-start' sx={{ marginTop: '18px !important' }}>
                      <Button variant='outlined' onClick={() => removeDebt(index)} color='error'>
                        Xóa kỳ
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Button onClick={handleAddDebt}>Thêm học kỳ nợ</Button>
              <Grid item xs={12}>
                <Controller
                  name='commitment'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Cam kết cải thiện' />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant='outlined' color='primary'>
              Hủy
            </Button>
            <LoadingButton loading={loading} type='submit' variant='contained' color='primary'>
              Lưu
            </LoadingButton>
          </DialogActions>
        </form>
      </Paper>
    </Dialog>
  )
}
