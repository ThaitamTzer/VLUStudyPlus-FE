'use client'

import { useEffect, useState } from 'react'

import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm, Controller } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { Button, Grid, MenuItem, Stack } from '@mui/material'

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import classStudentService from '@/services/classStudent.service'
import { useShare } from '@/hooks/useShare'

const schema = v.object({
  userId: v.pipe(
    v.string(),
    v.nonEmpty('Vui lòng nhập mã sinh viên'),
    v.minLength(10, 'Mã sinh viên phải có ít nhất 10 ký tự'),
    v.maxLength(15, 'Mã sinh viên không được quá 15 ký tự')
  ),
  userName: v.pipe(
    v.string(),
    v.nonEmpty('Vui lòng nhập tên sinh viên'),
    v.maxLength(50, 'Tên sinh viên không được quá 50 ký tự')
  ),
  cohortId: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập niên khóa')),
  mail: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập email'), v.includes('@vanlanguni.vn', 'Email không hợp lệ')),
  dateOfBirth: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập ngày sinh sinh viên')),
  classCode: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập mã lớp'))
})

type FormData = InferInput<typeof schema>

export default function ManualAddStudent({ mutate }: { mutate: KeyedMutator<any> }) {
  const { setOpenAddModal, classCode, setClassCode } = useClassStudentStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { cohorOptions, classCVHT } = useShare()

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
      userName: '',
      cohortId: '',
      mail: '',
      classCode: '',
      dateOfBirth: ''
    }
  })

  useEffect(() => {
    if (classCode) {
      setValue('classCode', classCode)
    }
  }, [classCode, setValue])

  const handleClose = () => {
    setClassCode('')
    setOpenAddModal(false)
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    const toastId = toast.loading('Đang thêm sinh viên...')

    setLoading(true)
    await classStudentService.add(
      classCode ? classCode : data.classCode,
      data,
      () => {
        toast.update(toastId, {
          render: 'Thêm sinh viên thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
        handleClose()
        mutate()
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
    <form onSubmit={onSubmit} autoComplete='off'>
      <Grid container spacing={4}>
        {!classCode && (
          <Grid item xs={12}>
            <Controller
              control={control}
              name='classCode'
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
                  {...(errors.classCode && { error: true, helperText: errors.classCode.message })}
                >
                  {classCVHT.map(option => (
                    <MenuItem key={option._id} value={option.classId}>
                      {option.classId}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Controller
            control={control}
            name='userId'
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Mã sinh viên'
                {...(errors.userId && { error: true, helperText: errors.userId.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='userName'
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Tên sinh viên'
                {...(errors.userName && { error: true, helperText: errors.userName.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='mail'
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
            control={control}
            name='cohortId'
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Niên khóa'
                {...(errors.cohortId && { error: true, helperText: errors.cohortId.message })}
                select
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: {
                    sx: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                {cohorOptions.map(option => (
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
            control={control}
            name='dateOfBirth'
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Ngày sinh'
                type='date'
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
                InputLabelProps={{
                  shrink: true
                }}
                {...(errors.dateOfBirth && { error: true, helperText: errors.dateOfBirth.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction='row' justifyContent='flex-end' spacing={4}>
            <Button onClick={handleClose} variant='outlined'>
              Hủy
            </Button>
            <LoadingButton type='submit' loading={loading} variant='contained'>
              Lưu
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  )
}
