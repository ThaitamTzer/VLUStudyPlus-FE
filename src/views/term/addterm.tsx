'use client'

import { useState } from 'react'

import type { KeyedMutator } from 'swr'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Grid,
  MenuItem
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'

import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import type { TermType } from '@/types/management/termType'
import termService from '@/services/term.service'
import { useTermStore } from '@/stores/term/term'
import CustomTextField from '@/@core/components/mui/TextField'
import Iconify from '@/components/iconify'
import { fDate } from '@/utils/format-time'
import { getEndYear, getStartYear } from './helper'
import { termFormSchema } from '@/schema/termSchema'

type AddTermProps = {
  mutate: KeyedMutator<TermType>
}

type TermForm = InferInput<typeof termFormSchema>

export default function AddTerm(props: AddTermProps) {
  const { openAddTerm, toogleAddTerm } = useTermStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { mutate } = props

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<TermForm>({
    resolver: valibotResolver(termFormSchema),
    mode: 'all',
    defaultValues: {
      termName: '',
      startYear: new Date().getFullYear().toString(),
      endYear: '',
      startDate: '',
      endDate: ''
    }
  })

  const startYear = useWatch({
    control,
    name: 'startYear'
  })

  const startDate = useWatch({
    control,
    name: 'startDate'
  })

  const handleClose = () => {
    toogleAddTerm()
    reset()
  }

  const onSubmit = handleSubmit(async (data: TermForm) => {
    setLoading(true)
    await termService.create(
      {
        termName: data.termName,
        academicYear: `${data.startYear}-${data.endYear}`,
        startDate: fDate(data.startDate, 'dd/MM/yyyy'),
        endDate: fDate(data.endDate, 'dd/MM/yyyy')
      },
      () => {
        toast.success('Thêm học kỳ thành công')
        mutate()
        setLoading(false)
        reset()
      },
      err => {
        toast.error(err.message)
        setLoading(false)
      }
    )
  })

  const handleStartDateChange = (date: Date | null) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''

    setValue('startDate', formattedDate)

    if (date && new Date(getValues('endDate')) < date) {
      setValue('endDate', '') // Reset end date if start date is after end date
    }
  }

  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          overflow: 'visible'
        }
      }}
      open={openAddTerm}
      onClose={handleClose}
    >
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h3'>Thêm học kỳ</Typography>
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='termName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên học kỳ'
                    {...(errors.termName && { error: true, helperText: errors.termName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='startYear'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Năm bắt đầu'
                    select
                    {...(errors.startYear && { error: true, helperText: errors.startYear.message })}
                    SelectProps={{
                      displayEmpty: true,
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
            <Grid item xs={6}>
              <Controller
                name='endYear'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Năm kết thúc'
                    select
                    {...(errors.endYear && { error: true, helperText: errors.endYear.message })}
                    SelectProps={{
                      displayEmpty: true,
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
            <Grid item xs={12} sm={6}>
              <Controller
                name='startDate'
                control={control}
                rules={{ required: 'Ngày bắt đầu không được để trống' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <AppReactDatepicker
                    id='startDate'
                    onChange={date => {
                      handleStartDateChange(date)
                      onChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }}
                    onBlur={onBlur}
                    selected={value ? new Date(value) : null}
                    locale='vi'
                    minDate={startYear ? new Date(`${startYear}-01-01`) : new Date(`${new Date().getFullYear()}-01-01`)}
                    dateFormat='dd/MM/yyyy'
                    showYearDropdown
                    showMonthDropdown
                    placeholderText='Ngày bắt đầu'
                    customInput={
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        fullWidth
                        label='Ngày bắt đầu'
                        {...(errors.startDate && { error: true, helperText: errors.startDate.message })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='endDate'
                control={control}
                rules={{
                  required: 'Ngày kết thúc không được để trống',
                  validate: value => {
                    const startDate = getValues('startDate')

                    return (
                      !startDate ||
                      new Date(value) >= new Date(startDate) ||
                      'Ngày kết thúc không được đi trước ngày bắt đầu'
                    )
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <AppReactDatepicker
                    selected={value ? new Date(value) : null}
                    onChange={date => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    id='endDate'
                    locale='vi'
                    dateFormat='dd/MM/yyyy'
                    showYearDropdown
                    showMonthDropdown
                    minDate={startDate ? new Date(startDate) : undefined}
                    placeholderText='Ngày kết thúc'
                    customInput={
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        label='Ngày kết thúc'
                        {...(errors.endDate && { error: true, helperText: errors.endDate.message })}
                      />
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Thêm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
