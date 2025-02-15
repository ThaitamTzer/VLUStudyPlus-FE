'use client'

import { useEffect, useState } from 'react'

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
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'

import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import { useTermStore } from '@/stores/term/term'
import CustomTextField from '@/@core/components/mui/TextField'
import Iconify from '@/components/iconify'
import { fDate } from '@/utils/format-time'

import { termFormSchema } from '@/schema/termSchema'
import { getAcademicYear } from './helper'

type UpdateForm = InferInput<typeof termFormSchema>

export default function ViewTerm() {
  const { openViewTerm, toogleViewTerm, term } = useTermStore()
  const [academicYears, setAcademicYears] = useState<string[]>([])

  const {
    control,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<UpdateForm>({
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

  useEffect(() => {
    // Set academic years first
    setAcademicYears(getAcademicYear())

    if (term) {
      // Small delay to ensure academicYears are set before form reset
      setTimeout(() => {
        reset({
          termName: term.termName,
          abbreviatName: term.abbreviatName,
          academicYear: term.academicYear,
          startDate: fDate(term.startDate, 'yyyy-MM-dd'),
          endDate: fDate(term.endDate, 'yyyy-MM-dd')
        })
      }, 100)
    }
  }, [term, reset])

  const handleClose = () => {
    toogleViewTerm()
    reset()
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
      open={openViewTerm}
      onClose={handleClose}
    >
      <DialogTitle>
        <Typography variant='h3'>Xem học kỳ</Typography>
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
                  disabled
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
                  disabled
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
                  disabled
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      sx: { maxHeight: 300 }
                    }
                  }}
                  onChange={e => {
                    field.onChange(e)
                    setValue('startDate', '')
                    setValue('endDate', '')
                  }}
                >
                  {academicYears.map(year => (
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
                return (
                  <AppReactDatepicker
                    id='startDate'
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value ? new Date(value) : null}
                    locale='vi'
                    disabled
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
                return (
                  <AppReactDatepicker
                    selected={value ? new Date(value) : null}
                    onChange={date => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    id='endDate'
                    locale='vi'
                    dateFormat='dd/MM/yyyy'
                    showYearDropdown
                    showMonthDropdown
                    disabled
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
      </DialogActions>
    </Dialog>
  )
}
