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
import { termFormSchema } from '@/schema/termSchema'
import { getAcademicYear } from './helper'

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
      abbreviatName: '',
      academicYear: '',
      startDate: '',
      endDate: ''
    }
  })

  const startDate = useWatch({
    control,
    name: 'startDate'
  })

  const academicYear = useWatch({
    control,
    name: 'academicYear'
  })

  const handleClose = () => {
    toogleAddTerm()
    reset()
  }

  const onSubmit = handleSubmit(async (data: TermForm) => {
    setLoading(true)

    console.log(data)

    await termService.create(
      {
        termName: data.termName,
        abbreviatName: data.abbreviatName,
        academicYear: data.academicYear,
        startDate: fDate(data.startDate, 'yyyy-MM-dd'),
        endDate: fDate(data.endDate, 'yyyy-MM-dd')
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
            <Grid item xs={6}>
              <Controller
                name='termName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder='Học kỳ 2'
                    label='Tên học kỳ'
                    {...(errors.termName && { error: true, helperText: errors.termName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='abbreviatName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên viết tắt'
                    placeholder='VD: HK252'
                    {...(errors.abbreviatName && { error: true, helperText: errors.abbreviatName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='academicYear'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    label='Năm học'
                    fullWidth
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: { maxHeight: 300 }
                      }
                    }}
                    onChange={e => {
                      field.onChange(e)

                      // Reset dates when academic year changes
                      setValue('startDate', '')
                      setValue('endDate', '')
                    }}
                  >
                    {getAcademicYear().map(year => (
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
                render={({ field: { value, onChange, onBlur } }) => {
                  const [startYear] = academicYear ? academicYear.split('-') : []
                  const minDate = startYear ? new Date(`${startYear}-01-01`) : undefined
                  const maxDate = startYear ? new Date(`${Number(startYear) + 1}-12-31`) : undefined

                  return (
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
                      showYearDropdown
                      showMonthDropdown
                      minDate={minDate}
                      maxDate={maxDate}
                      placeholderText='Ngày bắt đầu'
                      disabled={!academicYear}
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
                  )
                }}
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
                render={({ field: { value, onChange } }) => {
                  const [startYear] = academicYear ? academicYear.split('-') : []
                  const minDate = startDate ? new Date(startDate) : undefined
                  const maxDate = startYear ? new Date(`${Number(startYear) + 1}-12-31`) : undefined

                  return (
                    <AppReactDatepicker
                      selected={value ? new Date(value) : null}
                      onChange={date => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      id='endDate'
                      locale='vi'
                      dateFormat='dd/MM/yyyy'
                      showYearDropdown
                      showMonthDropdown
                      minDate={minDate}
                      maxDate={maxDate}
                      placeholderText='Ngày kết thúc'
                      disabled={!academicYear}
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
                  )
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
