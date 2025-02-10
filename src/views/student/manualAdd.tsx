'use client'

import { useEffect, useState } from 'react'

import { Button, DialogActions, Grid, MenuItem } from '@mui/material'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { formatDate } from 'date-fns'

import type { KeyedMutator } from 'swr'
import useSWR from 'swr'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { LoadingButton } from '@mui/lab'

import type { InferInput } from 'valibot'

import { toast } from 'react-toastify'

import { schema } from '@/schema/studentSchema'
import CustomTextField from '@/@core/components/mui/TextField'
import cohortService from '@/services/cohort.service'
import studentService from '@/services/student.service'
import { useStudentStore } from '@/stores/student/student'

type FormData = InferInput<typeof schema>

type Props = {
  mutate: KeyedMutator<any>
}

export default function ManualAdd({ mutate }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { toogleAddStudent } = useStudentStore()
  const { data: cohorts } = useSWR('cohorts', cohortService.getAll)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      userId: '',
      classCode: '',
      cohortId: '',
      mail: '',
      userName: '',
      dateOfBirth: ''
    }
  })

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

  const handleClose = () => {
    toogleAddStudent()
    reset()
    setLoading(false)
  }

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

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    await studentService.create(
      data,
      () => {
        setLoading(false)
        handleClose()
        mutate()
        toast.success('Thêm sinh viên thành công')
      },
      err => {
        setLoading(false)

        switch (err.message) {
          case 'Student already exists':
            toast.error('Sinh viên đã tồn tại')
            break

          default: {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!')
          }
        }
      }
    )
  })

  return (
    <form onSubmit={onSubmit} autoComplete='off'>
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
      </Grid>
      <DialogActions
        sx={{
          px: 0
        }}
      >
        <Button onClick={handleClose} variant='outlined'>
          Hủy
        </Button>
        <LoadingButton type='submit' loading={loading} variant='contained' color='primary' disableElevation>
          Lưu
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
