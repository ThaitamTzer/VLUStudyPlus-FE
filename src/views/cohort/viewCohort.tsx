'use client'

import { useEffect } from 'react'

import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Grid, MenuItem } from '@mui/material'

import type { InferInput } from 'valibot'

import { Controller, useForm, useWatch } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useCohortStore } from '@/stores/cohort/cohort'

import Iconify from '@/components/iconify'
import { schema } from '@/schema/cohortSchema'
import CustomTextField from '@/@core/components/mui/TextField'
import { getEndYear, getStartYear } from '../term/helper'

type FormData = InferInput<typeof schema>

export default function ViewCohort() {
  const { cohort, toogleViewCohort, openViewCohort } = useCohortStore()

  const {
    control,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema)
  })

  const startYear = useWatch({ control, name: 'startYear' })

  useEffect(() => {
    if (cohort) {
      reset(cohort)
    }
  }, [reset, cohort])

  const handleClose = () => {
    toogleViewCohort()
    reset()
  }

  return (
    <Dialog open={openViewCohort} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Typography variant='h3'>Chi tiết niên khóa</Typography>
      </DialogTitle>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8
        }}
        onClick={handleClose}
      >
        <Iconify icon='eva:close-fill' />
      </IconButton>
      <DialogContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Controller
              name='cohortId'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  label='Mã niên khóa'
                  {...(errors.cohortId && { error: true, helperText: errors.cohortId.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='cohortName'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  label='Tên niên khóa'
                  {...(errors.cohortName && { error: true, helperText: errors.cohortName.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='startYear'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  select
                  disabled
                  label='Năm bắt đầu'
                  {...(errors.startYear && { error: true, helperText: errors.startYear.message })}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 250
                        }
                      }
                    }
                  }}
                >
                  {getStartYear().map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='endYear'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  select
                  label='Năm kết thúc'
                  {...(errors.endYear && { error: true, helperText: errors.endYear.message })}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 250
                        }
                      }
                    }
                  }}
                >
                  {getEndYear(startYear).map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
