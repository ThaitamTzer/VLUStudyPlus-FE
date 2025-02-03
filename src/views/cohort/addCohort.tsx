'use client'

import { useState } from 'react'

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

import type { KeyedMutator } from 'swr'

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

type AddCohortProps = {
  mutate: KeyedMutator<any>
}

type FormData = InferInput<typeof schema>

export default function AddCohort(props: AddCohortProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)

  const { toogleAddCohort, openAddCohort } = useCohortStore()

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema)
  })

  const startYear = useWatch({ control, name: 'startYear' })

  const handleClose = () => {
    toogleAddCohort()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    await cohortService.create(
      data,
      () => {
        toast.success('Thêm niên khóa thành công')
        mutate()
        setLoading(false)
        handleClose()
      },
      err => {
        console.log(err.message)

        switch (err.message) {
          case 'CohortId already exists':
            setError('cohortId', {
              type: 'manual',
              message: 'Mã niên khóa đã tồn tại'
            })
            break

          case 'Cohort name already exists':
            setError('cohortName', {
              type: 'manual',
              message: 'Tên niên khóa đã tồn tại'
            })
            break
          default:
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại!')
        }

        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={openAddCohort} onClose={handleClose} fullWidth maxWidth='sm'>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h3'>Thêm niên khóa</Typography>
        </DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='eva:close-outline' />
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
          <Button onClick={handleClose} variant='outlined'>
            Hủy
          </Button>
          <LoadingButton type='submit' variant='contained' loading={loading}>
            Thêm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
