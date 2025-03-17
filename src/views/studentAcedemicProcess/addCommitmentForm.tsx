'use client'

import { useState } from 'react'

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
  FormControlLabel,
  Checkbox
} from '@mui/material'
import * as v from 'valibot'
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

const schema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(5), v.maxLength(100)),
  phoneNumber: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Số điện thoại không được để trống'),
    v.minLength(10, 'Số điện thoại không hợp lệ'),
    v.maxLength(10, 'Số điện thoại không hợp lệ')
  ),
  phoneNumberParent: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Số điện thoại phụ huynh không được để trống'),
    v.minLength(10, 'Số điện thoại không hợp lệ'),
    v.maxLength(10, 'Số điện thoại không hợp lệ')
  ),
  averageScore: v.pipe(
    v.nonNullable(v.number(), 'Điểm trung bình tích lũy không được để trống'),
    v.maxValue(4, 'Điểm trung bình không được lớn hơn 4')
  ),
  credit: v.pipe(v.nonNullable(v.number(), 'Số tín chỉ không được để trống'), v.maxValue(200, 'Số tín chỉ quá nhiều')),
  processing: v.pipe(
    v.array(
      v.object({
        term: v.pipe(
          v.string(),
          v.nonEmpty('Học kỳ bị XLHV không được để trống'),
          v.includes('HK', 'Học kỳ bắt đầu bằng HK'),
          v.minLength(5, 'Học kỳ phải có ít nhất 5 ký tự'),
          v.maxLength(5, 'Trạng thái xử lý không được quá 5 ký tự')
        ),
        typeProcessing: v.pipe(
          v.string(),
          v.nonEmpty('Loại xử lý không được để trống'),
          v.maxLength(255, 'Loại xử lý không được quá 255 ký tự')
        )
      })
    ),
    v.minLength(1, 'Trạng thái xử lý không được để trống')
  ),
  numberOfViolations: v.pipe(
    v.nonNullable(v.number(), 'Số lần xử lý không được để trống'),
    v.maxValue(100, 'Số lần xử lý quá nhiều')
  ),
  reason: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Lý do không được để trống'),
    v.minLength(10, 'Lý do phải có ít nhất 10 ký tự'),
    v.maxLength(255, 'Lý do không được quá 255 ký tự')
  ),
  aspiration: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Nguyện vọng không được để trống'),
    v.minLength(10, 'Nguyện vọng phải có ít nhất 10 ký tự'),
    v.maxLength(255, 'Nguyện vọng không được quá 255 ký tự')
  ),
  debt: v.array(
    v.object({
      term: v.pipe(
        v.string(),
        v.nonEmpty('Học kỳ bị XLHV không được để trống'),
        v.includes('HK', 'Học kỳ bắt đầu bằng HK'),
        v.minLength(5, 'Học kỳ phải có ít nhất 5 ký tự'),
        v.maxLength(5, 'Trạng thái xử lý không được quá 5 ký tự')
      ),
      subject: v.pipe(
        v.string(),
        v.nonEmpty('Môn học không được để trống'),
        v.maxLength(255, 'Môn học không được quá 255 ký tự')
      )
    })
  ),
  commitment: v.boolean()
})

type FormData = InferInput<typeof schema>

export default function AddCommitmentForm({ mutate }: { mutate: KeyedMutator<any> }) {
  const { openAddCommitmentForm, toogleAddCommitmentForm, idProcess, setIdProcess } = useStudentAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
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
          subject: ''
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

  const onClose = () => {
    toogleAddCommitmentForm()
    reset()
    setIdProcess('')
  }

  const {
    fields: processingFields,
    prepend: addProcessing,
    remove: removeProcessing
  } = useFieldArray({ control, name: 'processing' })

  const { fields: debtFields, prepend: addDebt, remove: removeDebt } = useFieldArray({ control, name: 'debt' })

  const onSubmit = handleSubmit(async data => {
    if (!idProcess) return toast.error('Có lỗi xảy ra, vui lòng thử lại sau')

    setLoading(true)
    const toastId = toast.loading('Đang tạo đơn cam kết...')

    await studentAcedemicProcessService.addCommitmentForm(
      idProcess,
      data,
      () => {
        toast.update(toastId, {
          render: 'Tạo đơn cam kết thành công!',
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
    <Dialog open={openAddCommitmentForm} onClose={onClose} maxWidth='md' fullWidth>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <form onSubmit={onSubmit}>
          <DialogTitle>
            <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
              <Iconify icon='eva:close-fill' color='black' />
            </IconButton>
            <Typography variant='h4' textAlign='center'>
              Tạo đơn cam kết
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
              {debtFields.map((item, index) => (
                <Grid container item xs={12} spacing={2} key={item.id}>
                  <Grid item xs={3}>
                    <Controller
                      name={`debt.${index}.term`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label='Học kỳ'
                          fullWidth
                          {...(errors.debt?.[index]?.term && {
                            error: true,
                            helperText: errors.debt?.[index]?.term.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Controller
                      name={`debt.${index}.subject`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label='Môn học'
                          fullWidth
                          {...(errors.debt?.[index]?.subject && {
                            error: true,
                            helperText: errors.debt?.[index]?.subject.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                  {debtFields.length > 1 && (
                    <Grid item xs={2}>
                      <Button onClick={() => removeDebt(index)} color='error'>
                        Xóa
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Button onClick={() => addDebt({ term: '', subject: '' })}>Thêm môn nợ</Button>
              <Grid item xs={12}>
                <Controller
                  name='commitment'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label='Cam kết cải thiện'
                    />
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
              Tạo
            </LoadingButton>
          </DialogActions>
        </form>
      </Paper>
    </Dialog>
  )
}
