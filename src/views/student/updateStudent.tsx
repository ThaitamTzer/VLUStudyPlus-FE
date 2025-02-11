'use client'
import { useState, useEffect } from 'react'

import type { KeyedMutator } from 'swr'

type UpdateStudentProps = {
  mutate: KeyedMutator<any>
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  MenuItem,
  Button
} from '@mui/material'

import { useWatch, Controller, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'

import { valibotResolver } from '@hookform/resolvers/valibot'

import type { InferInput } from 'valibot'

import useSWR from 'swr'

import { formatDate } from 'date-fns'

import { vi } from 'date-fns/locale'
import { registerLocale } from 'react-datepicker'

registerLocale('vi', vi)

import { toast } from 'react-toastify'

import Iconify from '@/components/iconify'

import { useStudentStore } from '@/stores/student/student'
import { UpdateSchema } from '@/schema/studentSchema'
import CustomTextField from '@/@core/components/mui/TextField'

import studentService from '@/services/student.service'
import cohortService from '@/services/cohort.service'
import { fDate } from '@/utils/format-time'
import roleService from '@/services/role.service'

type FormData = InferInput<typeof UpdateSchema>

export default function UpdateStudent({ mutate }: UpdateStudentProps) {
  const { openUpdateStudent, toogleUpdateStudent, student, setStudent } = useStudentStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { data: cohorts } = useSWR('cohorts', cohortService.getAll)
  const { data: roles } = useSWR('roles', () => roleService.getAll(1, 999, ''))

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(UpdateSchema),
    mode: 'all',
    defaultValues: {
      userId: '',
      classCode: '',
      cohortId: '',
      mail: '',
      userName: '',
      role: '',
      dateOfBirth: ''
    }
  })

  useEffect(() => {
    if (student) {
      reset({
        userId: student.userId,
        userName: student.userName,
        mail: student.mail,
        cohortId: student.cohortId || '',
        classCode: student.classCode || '',
        dateOfBirth: fDate(student.dateOfBirth, 'yyyy-MM-dd') || '',
        role: student?.role?._id || ''
      })
    }
  }, [reset, student])

  const cohortId = useWatch({ control, name: 'cohortId' })
  const userId = useWatch({ control, name: 'userId' })
  const userName = useWatch({ control, name: 'userName' })

  useEffect(() => {
    if (userId && userName) {
      const emailPrefix =
        userName
          .split(' ')
          .pop()
          ?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D') || ''

      const email = `${emailPrefix}.${userId}@vanlanguni.vn`

      setValue('mail', email)
    }
  }, [userId, userName, setValue])

  const getClassCode = () => {
    if (cohortId) {
      const cohort = cohorts?.find(cohort => cohort.cohortId === cohortId)

      const classCode = `71${cohort?.cohortId}CNTT`

      return Array.from({ length: 30 }, (_, i) => {
        const number = i + 1

        return `${classCode}${number.toString().padStart(2, '0')}`
      })
    }
  }

  const handleClose = () => {
    toogleUpdateStudent()
    reset()
    setLoading(false)
    setStudent({} as any)
  }

  const onSubmit = handleSubmit(async data => {
    if (!student) return
    setLoading(true)

    await studentService.update(
      student._id,
      {
        userId: data.userId,
        userName: data.userName,
        mail: data.mail,
        cohortId: data.cohortId,
        classCode: data.classCode,
        dateOfBirth: fDate(data.dateOfBirth, 'yyyy-MM-dd'),
        role: data.role
      },
      () => {
        toast.success('Cập nhật sinh viên thành công')
        mutate()
        setLoading(false)
        handleClose()
      },
      err => {
        switch (err.message) {
          case 'userId is exists':
            toast.error('Mã sinh viên đã tồn tại')
            break
          case 'mail is exists':
            toast.error('Email đã tồn tại')
            break
          default:
            toast.error(err.message)
            break
        }
      }
    )
  })

  return (
    <Dialog open={openUpdateStudent} onClose={handleClose} maxWidth='sm' fullWidth>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Cập nhật sinh viên</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
          >
            <Iconify icon='material-symbols:close-rounded' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name='userId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder='VD: 2174802010666'
                    label='Mã sinh viên'
                    {...(errors.userId && { error: true, helperText: errors.userId.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='userName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder='VD: Nguyễn Văn A'
                    label='Tên sinh viên'
                    {...(errors.userName && { error: true, helperText: errors.userName.message })}
                  />
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
                    {...(errors.mail && { error: true, helperText: errors.mail.message })}
                  />
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
                    label='Mã niên khóa'
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 350
                        }
                      }
                    }}
                    {...(errors.cohortId && { error: true, helperText: errors.cohortId.message })}
                  >
                    <MenuItem value='' disabled>
                      Chọn mã niên khóa
                    </MenuItem>
                    {cohorts?.map(cohort => (
                      <MenuItem key={cohort._id} value={cohort.cohortId}>
                        {cohort.cohortId}
                      </MenuItem>
                    ))}
                  </CustomTextField>
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
                    label='Mã lớp'
                    disabled={!cohortId}
                    SelectProps={{
                      displayEmpty: true,
                      nonce: 'classCode',
                      MenuProps: {
                        sx: {
                          maxHeight: 350
                        }
                      }
                    }}
                    {...(errors.classCode && { error: true, helperText: errors.classCode.message })}
                  >
                    <MenuItem value='' disabled>
                      {'Chọn mã lớp'}
                    </MenuItem>
                    {getClassCode()?.map(classCode => (
                      <MenuItem key={classCode} value={classCode}>
                        {classCode}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='dateOfBirth'
                control={control}
                render={({ field: { value, onBlur, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label='Ngày sinh'
                    type='date'
                    helperText='mm/dd/yyyy'
                    lang='vi'
                    InputProps={{
                      value: value,
                      lang: 'vi'
                    }}
                    inputProps={{
                      max: formatDate(new Date(), 'yyyy-MM-dd'),
                      lang: 'vi'
                    }}
                    {...(errors.dateOfBirth && { error: true, helperText: errors.dateOfBirth.message })}
                  />

                  // <AppReactDatepicker
                  //   id='dateOfBirth'
                  //   value={value}
                  //   onChange={date => {
                  //     onChange(date ? fDate(date, 'yyyy-MM-dd') : '')
                  //   }}
                  //   selected={value ? new Date(value) : null}
                  //   onBlur={onBlur}
                  //   locale={vi}
                  //   dateFormat='dd/MM/yyyy'
                  //   showYearDropdown
                  //   showMonthDropdown
                  //   useShortMonthInDropdown
                  //   maxDate={new Date()}
                  //   placeholderText='Chọn ngày sinh'
                  //   customInput={
                  //     <CustomTextField
                  //       fullWidth
                  //       value={value}
                  //       onChange={onChange}
                  //       onBlur={onBlur}
                  //       label='Ngày sinh'
                  //       {...(errors.dateOfBirth && { error: true, helperText: errors.dateOfBirth.message })}
                  //     />
                  //   }
                  // />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='role'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    label='Vai trò'
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 350
                        }
                      }
                    }}
                    {...(errors.role && { error: true, helperText: errors.role.message })}
                  >
                    <MenuItem value='' disabled>
                      Chọn vai trò
                    </MenuItem>
                    {roles?.data?.roles?.map(role => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined'>
            Hủy
          </Button>
          <LoadingButton type='submit' loading={loading} variant='contained' color='primary' disableElevation>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
