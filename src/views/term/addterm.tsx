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
import * as v from 'valibot'

import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import type { TermType } from '@/types/management/termType'
import termService from '@/services/term.service'
import { useTermStore } from '@/stores/term/term'
import CustomTextField from '@/@core/components/mui/TextField'
import Iconify from '@/components/iconify'
import { fDate } from '@/utils/format-time'

type AddTermProps = {
  mutate: KeyedMutator<TermType>
}

const getStartYear = () => {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 4
  const endYear = currentYear + 10

  const years: string[] = []

  for (let i = startYear; i <= endYear; i++) {
    years.push(i.toString())
  }

  return years
}

const getEndYear = (startYear: string) => {
  const endYear = Number(startYear) + 10
  const years: string[] = []

  for (let i = Number(startYear); i <= endYear; i++) {
    years.push(i.toString())
  }

  return years
}

const schema = v.object({
  termId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Mã học kỳ không được để trống'),
    v.minLength(3, 'Mã học kỳ không được ít hơn 3 kí tự'),
    v.maxLength(10, 'Mã học kỳ không được quá 10 kí tự'),
    v.regex(/^\S*$/, 'Mã học kỳ không được chứa khoảng trắng')
  ),
  termName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên học kỳ không được để trống'),
    v.minLength(3, 'Tên học kỳ không được ít hơn 3 kí tự'),
    v.maxLength(20, 'Tên học kỳ không được quá 20 kí tự')
  ),
  startYear: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Năm bắt đầu không được để trống'),
    v.minLength(4, 'Năm bắt đầu không hợp lệ'),
    v.maxLength(4, 'Năm bắt đầu không hợp lệ')
  ),
  endYear: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Năm kết thúc không được để trống'),
    v.minLength(4, 'Năm kết thúc không hợp lệ'),
    v.maxLength(4, 'Năm kết thúc không hợp lệ')
  ),
  startDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày bắt đầu không được để trống')),
  endDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày kết thúc không được để trống'))
})

type TermForm = InferInput<typeof schema>

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
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      termId: '',
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
        termId: data.termId,
        termName: data.termName,
        academicYear: `${data.startYear}-${data.endYear}`,
        startDate: fDate(data.startDate, 'dd/MM/yyyy'),
        endDate: fDate(data.endDate, 'dd/MM/yyyy')
      },
      () => {
        toast.success('Thêm học kỳ thành công')
        mutate()
        setLoading(false)
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
                name='termId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mã học kỳ'
                    {...(errors.termId && { error: true, helperText: errors.termId.message })}
                  />
                )}
              />
            </Grid>
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
                    dateFormat='dd/MM/yyyy'
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
          <Button onClick={handleClose}>Hủy</Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Thêm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
