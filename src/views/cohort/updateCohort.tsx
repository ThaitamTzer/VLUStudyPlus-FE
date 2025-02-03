'use client'

import { useEffect, useState } from 'react'

import type { KeyedMutator } from 'swr'

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

import { LoadingButton } from '@mui/lab'

import type { InferInput } from 'valibot'

import { Controller, useForm, useWatch } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { useCohortStore } from '@/stores/cohort/cohort'

import Iconify from '@/components/iconify'
import { schema } from '@/schema/cohortSchema'
import CustomTextField from '@/@core/components/mui/TextField'
import { getEndYear, getStartYear } from '../term/helper'

import cohortService from '@/services/cohort.service'

type UpdateCohortProps = {
  mutate: KeyedMutator<any>
}

type FormData = InferInput<typeof schema>

export default function UpdateCohort(props: UpdateCohortProps) {
  const { mutate } = props

  const { cohort, toogleUpdateCohort, openUpdateCohort } = useCohortStore()

  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
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
    toogleUpdateCohort()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    setLoading(true)

    if (!cohort) {
      return
    }

    await cohortService.update(
      cohort?._id,
      data,
      () => {
        toast.success('Chỉnh sửa niên khóa thành công')
        setLoading(false)
        toogleUpdateCohort()
        mutate()
      },
      err => {
        console.log(err)
        toast.error('Chỉnh sửa niên khóa thất bại')
        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openUpdateCohort} onClose={toogleUpdateCohort} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h3'>Chỉnh sửa niên khóa</Typography>
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
                    disabled={!startYear}
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
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type='submit' variant='contained' color='primary' disableElevation>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
