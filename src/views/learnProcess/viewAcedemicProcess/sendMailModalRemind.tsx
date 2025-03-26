'use client'
import { useCallback, useState, useMemo } from 'react'

import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material'
import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { CustomDialog } from '@/components/CustomDialog'
import mailService from '@/services/mail.service'
import type { ListClassInProcess } from '@/types/management/learnProcessType'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

const schema = v.object({
  classId: v.string(),
  processed: v.boolean()
})

type FormData = InferInput<typeof schema>

export default function SendMailModalRemind({ id, classList }: { id: string; classList: ListClassInProcess[] }) {
  const { openSendEmailRemind, toogleSendEmailRemind } = useAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const classOptions = useMemo(() => {
    if (!Array.isArray(classList)) return []

    return classList.map(item => ({
      classId: item.classId,
      userName: item.userName
    }))
  }, [classList])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      classId: 'Tất cả',
      processed: false
    }
  })

  const onSendMail = handleSubmit(async data => {
    // send mail

    if (!id) return toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!')

    const newData = {
      ...data,
      classId: data.classId === 'Tất cả' ? '' : data.classId
    }

    setLoading(true)

    const toastId = toast.loading('Đang gửi mail nhắc nhở...')

    await mailService.remindMail(
      id,
      newData,
      () => {
        toogleSendEmailRemind()
        toast.update(toastId, {
          render: 'Gửi mail nhắc nhở thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
      },
      err => {
        setLoading(false)
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
      }
    )
  })

  const onClose = useCallback(() => {
    toogleSendEmailRemind()
  }, [toogleSendEmailRemind])

  return (
    <CustomDialog
      open={openSendEmailRemind}
      onClose={onClose}
      title='Xác nhận gửi mail nhắc nhở'
      actions={
        <>
          <Button variant='outlined' onClick={onClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} variant='contained' onClick={onSendMail}>
            Gửi mail
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='classId'
            render={({ field: { value, onChange, ...field } }) => {
              const selectedValues = value ? value.split(',') : []
              const isAllSelected = selectedValues.includes('Tất cả')

              return (
                <CustomAutocomplete
                  {...field}
                  fullWidth
                  multiple
                  id='statusHandling'
                  options={[{ classId: 'Tất cả', userName: 'Tất cả' }, ...classOptions]}
                  value={
                    isAllSelected
                      ? [{ classId: 'Tất cả', userName: 'Tất cả' }]
                      : classOptions.filter(item => selectedValues.includes(item.classId))
                  }
                  onChange={(_, newValue) => {
                    if (newValue.some(item => item.classId === 'Tất cả')) {
                      onChange('Tất cả')
                    } else {
                      onChange(newValue.map(item => item.classId).join(','))
                    }
                  }}
                  getOptionLabel={option => option.classId}
                  noOptionsText='Không có lớp học nào'
                  isOptionEqualToValue={(option, value) => option.classId === value.classId}
                  disableCloseOnSelect
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      fullWidth
                      label='Chọn lớp học cần gửi mail'
                      {...(errors.classId && {
                        error: true,
                        helperText: errors.classId?.message?.toString()
                      })}
                    />
                  )}
                />
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='processed'
            render={({ field }) => (
              <FormControlLabel
                label='Gửi luôn cho những cố vấn học tập, sinh viên đã xử lý ?'
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                    {...(errors.processed && {
                      error: true,
                      helperText: errors.processed.message?.toString()
                    })}
                  />
                }
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
