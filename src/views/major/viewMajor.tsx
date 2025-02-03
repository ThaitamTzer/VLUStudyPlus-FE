'use client'
import { useEffect } from 'react'

import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Grid } from '@mui/material'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'
import { Controller, useForm } from 'react-hook-form'

import { useMajorStore } from '@/stores/major/major'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import { schema } from '@/schema/majorSchema'

type FormData = InferInput<typeof schema>

export default function ViewMajor() {
  const { openViewMajor, toogleViewMajor, major } = useMajorStore()

  const {
    control,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      majorName: ''
    }
  })

  useEffect(() => {
    if (major) {
      reset(major)
    }
  }, [major, reset])

  const handleClose = () => {
    toogleViewMajor()
    reset()
  }

  return (
    <Dialog open={openViewMajor} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Typography variant='h4'>Chi tiết chuyên ngành</Typography>
      </DialogTitle>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8
        }}
        onClick={handleClose}
      >
        <Iconify icon='material-symbols:close-rounded' />
      </IconButton>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Controller
              name='majorId'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  label='Mã chuyên ngành'
                  {...(errors.majorId && { error: true, helperText: errors.majorId.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='majorName'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  disabled
                  fullWidth
                  label='Tên chuyên ngành'
                  {...(errors.majorName && { error: true, helperText: errors.majorName.message })}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
