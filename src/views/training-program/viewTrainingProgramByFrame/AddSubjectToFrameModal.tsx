'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import type { InferInput } from 'valibot'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography
} from '@mui/material'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import CustomTextField from '@/@core/components/mui/TextField'
import trainingProgramService from '@/services/trainingprogram.service'
import Iconify from '@/components/iconify'

const schema = v.object({
  courseCode: v.pipe(
    v.string(),
    v.nonEmpty('Vui lòng nhập mã môn học'),
    v.maxLength(11, 'Mã môn học không được quá 11 ký tự')
  ),
  courseName: v.pipe(
    v.string(),
    v.nonEmpty('Vui lòng nhập tên môn học'),
    v.maxLength(100, 'Tên môn học không được quá 100 ký tự')
  ),
  credits: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ phải lớn hơn 0')),
  LT: v.pipe(v.number(), v.minValue(1, 'Số giờ lý thuyết phải lớn hơn 0')),
  TH: v.pipe(v.number(), v.minValue(1, 'Số giờ thực hành phải lớn hơn 0')),
  TT: v.pipe(v.number(), v.minValue(1, 'Số giờ tự học phải lớn hơn 0')),
  isRequire: v.boolean(),
  prerequisites: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập điều kiện tiên quyết')),
  preConditions: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập điều kiện học trước')),
  subjectCode: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập mã học phần')),
  inCharge: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập đơn vị phụ trách')),
  implementationSemester: v.pipe(v.number(), v.minValue(1, 'Học kỳ thực hiện phải lớn hơn 0')),
  note: v.string()
})

interface AddSubjectToFrameModalProps {
  open: boolean
  onClose: () => void
  programId: string
}

type FormAddSubjectInFrame = InferInput<typeof schema>

export default function AddSubjectToFrameModal({ open, onClose, programId }: AddSubjectToFrameModalProps) {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormAddSubjectInFrame>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      courseCode: '',
      courseName: '',
      credits: 0,
      LT: 0,
      TH: 0,
      TT: 0,
      isRequire: true,
      prerequisites: '',
      preConditions: '',
      subjectCode: '',
      inCharge: '',
      implementationSemester: 0,
      note: ''
    }
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = handleSubmit(async data => {
    if (!programId) return toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')

    const toastId = toast.loading('Đang thêm môn học')

    setLoading(true)

    await trainingProgramService.addSubjectInFrame(
      programId,
      data,
      () => {
        setLoading(false)
        toast.update(toastId, {
          render: 'Thêm môn học thành công',
          autoClose: 2000,
          isLoading: false,
          type: 'success'
        })
        onClose()
      },
      err => {
        setLoading(false)
        toast.update(toastId, {
          render: err.message,
          autoClose: 2000,
          type: 'error',
          isLoading: false
        })
      }
    )
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Iconify icon='mdi:close' />
        </IconButton>
        <Typography variant='h6'>Thêm môn học vào khung chương trình đào tạo</Typography>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='courseCode'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    name='courseCode'
                    label='Mã môn học'
                    error={!!errors.courseCode}
                    helperText={errors.courseCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='courseName'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Tên môn học'
                    error={!!errors.courseName}
                    helperText={errors.courseName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='credits'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    type='number'
                    label='Số tín chỉ'
                    error={!!errors.credits}
                    helperText={errors.credits?.message}
                    onChange={e => {
                      const value = Number(e.target.value) // Chuyển đổi sang số

                      field.onChange(value) // Cập nhật giá trị
                    }}
                    value={field.value === 0 ? '' : field.value} // Hiển thị giá trị 0 dưới dạng chuỗi rỗng
                    onFocus={e => {
                      if (e.target.value === '0') {
                        e.target.value = ''
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='LT'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Số giờ lý thuyết'
                    type='number'
                    error={!!errors.LT}
                    helperText={errors.LT?.message}
                    value={field.value === 0 ? '' : field.value} // Hiển thị giá trị 0 dưới dạng chuỗi rỗng
                    onChange={e => {
                      const value = Number(e.target.value) // Chuyển đổi sang số

                      field.onChange(value) // Cập nhật giá trị
                    }}
                    onFocus={e => {
                      if (e.target.value === '0') {
                        e.target.value = ''
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='TH'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Số giờ thực hành'
                    error={!!errors.TH}
                    type='number'
                    helperText={errors.TH?.message}
                    value={field.value === 0 ? '' : field.value} // Hiển thị giá trị 0 dưới dạng chuỗi rỗng
                    onChange={e => {
                      const value = Number(e.target.value) // Chuyển đổi sang số

                      field.onChange(value) // Cập nhật giá trị
                    }}
                    onFocus={e => {
                      if (e.target.value === '0') {
                        e.target.value = ''
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='TT'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Số giờ tự học'
                    type='number'
                    error={!!errors.TT}
                    helperText={errors.TT?.message}
                    value={field.value === 0 ? '' : field.value} // Hiển thị giá trị 0 dưới dạng chuỗi rỗng
                    onChange={e => {
                      const value = Number(e.target.value) // Chuyển đổi sang số

                      field.onChange(value) // Cập nhật giá trị
                    }}
                    onFocus={e => {
                      if (e.target.value === '0') {
                        e.target.value = ''
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='subjectCode'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Mã học phần'
                    error={!!errors.subjectCode}
                    helperText={errors.subjectCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='inCharge'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Đơn vị phụ trách'
                    error={!!errors.inCharge}
                    helperText={errors.inCharge?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='implementationSemester'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    value={field.value === 0 ? '' : field.value} // Hiển thị giá trị 0 dưới dạng chuỗi rỗng
                    onChange={e => {
                      const value = Number(e.target.value) // Chuyển đổi sang số

                      field.onChange(value) // Cập nhật giá trị
                    }}
                    onFocus={e => {
                      if (e.target.value === '0') {
                        e.target.value = ''
                      }
                    }}
                    type='number'
                    label='Học kỳ thực hiện'
                    error={!!errors.implementationSemester}
                    helperText={errors.implementationSemester?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='prerequisites'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Điều kiện tiên quyết'
                    error={!!errors.prerequisites}
                    helperText={errors.prerequisites?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name='preConditions'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Điều kiện học trước'
                    error={!!errors.preConditions}
                    helperText={errors.preConditions?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='note'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    {...field}
                    label='Ghi chú'
                    multiline
                    rows={2}
                    error={!!errors.note}
                    helperText={errors.note?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='isRequire'
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={e => onChange(e.target.checked)} />}
                    label='Môn học bắt buộc'
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <LoadingButton loading={loading} type='submit' variant='contained' disabled={isSubmitting}>
            Thêm môn học
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
