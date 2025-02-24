import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Grid,
  MenuItem
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'

import * as v from 'valibot'

import type { KeyedMutator } from 'swr'

import { valibotResolver } from '@hookform/resolvers/valibot'

import useSWR from 'swr'

import { Flip, toast } from 'react-toastify'

import Iconify from '@/components/iconify'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import CustomTextField from '@/@core/components/mui/TextField'
import classLecturerService from '@/services/classLecturer.service'
import cohortService from '@/services/cohort.service'
import classStudentService from '@/services/classStudent.service'
import { fDate } from '@/utils/format-time'

const schema = v.object({
  userName: v.pipe(v.string(), v.nonEmpty('Tên không được để trống'), v.maxLength(255, 'Tên không được quá 255 ký tự')),
  classCode: v.pipe(v.string(), v.nonEmpty('Mã lớp không được để trống')),
  cohortId: v.pipe(v.string(), v.nonEmpty('Khóa không được để trống')),
  mail: v.pipe(
    v.string(),
    v.nonEmpty('Mã sinh viên không được để trống'),
    v.includes('@vanlanguni.vn', 'Email không hợp lệ')
  ),
  dateOfBirth: v.pipe(v.string(), v.nonEmpty('Ngày sinh không được để trống'))
})

type ImportForm = v.InferInput<typeof schema>

export default function ImportAddStudent({ mutate }: { mutate: KeyedMutator<any> }) {
  const { toogleUpdateStudent, openUpdateStudent, student } = useClassStudentStore()
  const [loading, setLoading] = useState<boolean>(false)

  const { data: classOption } = useSWR('optionClass', classLecturerService.getList)
  const { data: cohortOption } = useSWR('cohortOption', cohortService.getAll)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ImportForm>({
    resolver: valibotResolver(schema),
    defaultValues: {
      userName: '',
      classCode: '',
      cohortId: '',
      mail: '',
      dateOfBirth: ''
    }
  })

  const onClose = () => {
    toogleUpdateStudent({} as any)
  }

  useEffect(() => {
    if (!student) return

    reset({
      userName: student.userName,
      classCode: student.classCode,
      cohortId: student.cohortId,
      mail: student.mail,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ''
    })
  }, [reset, student])

  const onSubmit = handleSubmit(async data => {
    const toastId = toast.loading('Đang cập nhật sinh viên...')

    setLoading(true)
    await classStudentService.updateStudent(
      student._id,
      {
        userName: data.userName,
        classCode: data.classCode,
        cohortId: data.cohortId,
        mail: data.mail,
        dateOfBirth: fDate(data.dateOfBirth, 'yyyy-MM-dd')
      },
      () => {
        toast.update(toastId, {
          render: 'Cập nhật sinh viên thành công',
          type: 'success',
          isLoading: false,
          transition: Flip,
          autoClose: 3000
        })
        setLoading(false)
        onClose()
        mutate()
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          transition: Flip,
          autoClose: 3000
        })
        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openUpdateStudent} onClose={onClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          <Typography variant='h4'>Cập nhật sinh viên</Typography>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
            onClick={onClose}
          >
            <Iconify icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='userName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên sinh viên'
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='classCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 300
                        }
                      }
                    }}
                    label='Mã lớp'
                    error={!!errors.classCode}
                    helperText={errors.classCode?.message}
                  >
                    <MenuItem value=''>Chọn lớp học</MenuItem>
                    {classOption?.map(option => (
                      <MenuItem key={option.classId} value={option.classId}>
                        {option.classId}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='cohortId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 300
                        }
                      }
                    }}
                    label='Khóa'
                    error={!!errors.cohortId}
                    helperText={errors.cohortId?.message}
                  >
                    <MenuItem value=''>Chọn khóa</MenuItem>
                    {cohortOption?.map(option => (
                      <MenuItem key={option._id} value={option.cohortId}>
                        {option.cohortId}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='mail'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Email'
                    error={!!errors.mail}
                    helperText={errors.mail?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='dateOfBirth'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='date'
                    label='Ngày sinh'
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0]
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <LoadingButton type='submit' variant='contained' color='primary' loading={loading}>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
