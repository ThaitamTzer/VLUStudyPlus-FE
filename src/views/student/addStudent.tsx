'use client'
import { useState } from 'react'

import type { KeyedMutator } from 'swr'

type AddStudentProps = {
  mutate: KeyedMutator<any>
}

import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Grid } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { valibotResolver } from '@hookform/resolvers/valibot'

import type { InferInput } from 'valibot'

import { Controller, useForm } from 'react-hook-form'

import Iconify from '@/components/iconify'

import { useStudentStore } from '@/stores/student/student'
import { schema } from '@/schema/studentSchema'
import CustomTextField from '@/@core/components/mui/TextField'


type FormData = InferInput<typeof schema>

export default function AddStudent({ mutate }: AddStudentProps) {
  const { openAddStudent, toogleAddStudent } = useStudentStore()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      userId: '',
      classCode: '',
      academicYear: '',
      mail: '',
      userName: ''
    }
  })

  const handleClose = () => {
    toogleAddStudent()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    console.log(data)
  })

  return (
    <Dialog open={openAddStudent} onClose={handleClose} maxWidth='sm' fullWidth>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h4'>Thêm sinh viên</Typography>
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
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='userId'
                control={control}
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='userName'
                control={control}
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='classCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mã lớp'
                    {...(errors.classCode && { error: true, helperText: errors.classCode.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='academicYear'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    label='Năm học'
                    {...(errors.academicYear && { error: true, helperText: errors.academicYear.message })}

                  >


                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  )
}
