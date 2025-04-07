'use client'

import { Grid, MenuItem } from '@mui/material'
import { Controller } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import type { Major } from '@/types/management/majorType'
import type { Cohort } from '@/types/management/cohortType'

type CreateTrainingProgramProps = {
  control: any
  errors: any
  majorOptions: Major[]
  cohorOptions: Cohort[]
}

export default function CreateTrainingProgram(props: CreateTrainingProgramProps) {
  const { control, errors, majorOptions, cohorOptions } = props

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Tên khung chương trình'
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='credit'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <CustomTextField
                {...field}
                label='Tổng số tín chỉ'
                error={!!errors.credit}
                helperText={errors.credit?.message}
                type='number'
                fullWidth
                onFocus={e => {
                  e.target.select()
                }}
                onChange={e => {
                  const value = e.target.value

                  onChange(value === '' ? 0 : Number(value))
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='majorId'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Ngành'
                error={!!errors.majorId}
                helperText={errors.majorId?.message}
                fullWidth
                select
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300
                      }
                    }
                  }
                }}
              >
                {majorOptions.map(option => {
                  return (
                    <MenuItem key={option._id} value={option._id}>
                      {option.majorName}
                    </MenuItem>
                  )
                })}
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
                label='Niên khóa'
                error={!!errors.cohortId}
                helperText={errors.cohortId?.message}
                fullWidth
                select
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300
                      }
                    }
                  }
                }}
              >
                {cohorOptions.map(option => {
                  return (
                    <MenuItem key={option._id} value={option._id}>
                      {option.cohortId}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}
