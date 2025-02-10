'use client'

import { useEffect, useState } from 'react'

import type { KeyedMutator } from 'swr'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Grid } from '@mui/material'
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

type UpdateTermProps = {
  mutate: KeyedMutator<TermType>
}

type UpdateForm = InferInput<typeof termFormSchema>

export default function UpdateTerm(props: UpdateTermProps) {
  const { openUpdateTerm, toogleUpdateTerm, term } = useTermStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { mutate } = props

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<UpdateForm>({
    resolver: valibotResolver(termFormSchema),
    mode: 'all',
    defaultValues: {
      termName: '',
      maxCourse: 0,
      startDate: '',
      endDate: ''
    }
  })

  useEffect(() => {
    if (term) {
      reset({
        termName: term.termName,
        maxCourse: term.maxCourse,
        startDate: fDate(term.startDate, 'yyyy-MM-dd'),
        endDate: fDate(term.endDate, 'yyyy-MM-dd')
      })
    }
  }, [term, reset])

  const startDate = useWatch({
    control,
    name: 'startDate'
  })

  const handleClose = () => {
    toogleUpdateTerm()
    reset()
  }

  const onSubmit = handleSubmit(async (data: UpdateForm) => {
    setLoading(true)

    await termService.update(
      term._id,
      {
        termName: data.termName,
        startDate: fDate(data.startDate, 'dd/MM/yyyy'),
        endDate: fDate(data.endDate, 'dd/MM/yyyy')
      },
      () => {
        toast.success('Sửa học kỳ thành công')
        mutate()
        setLoading(false)
        handleClose()
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
      open={openUpdateTerm}
      onClose={handleClose}
    >
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <Typography variant='h3'>Sửa học kỳ</Typography>
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
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
