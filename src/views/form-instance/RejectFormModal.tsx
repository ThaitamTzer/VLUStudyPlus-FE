'use client'

import { useState } from 'react'

import { Box, Button, TextField, Stack } from '@mui/material'

import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

import type { KeyedMutator } from 'swr'

import formInstanceService from '@/services/formInstance.service'

import { CustomDialog } from '@/components/CustomDialog'

import type { FormInstanceType } from '@/types/management/formInstanceType'

interface RejectFormValues {
  description: string
}

type RejectFormModalProps = {
  open: boolean
  onClose: () => void
  formInstance: FormInstanceType | null
  mutate: KeyedMutator<any>
  isBCNK?: boolean
  mutateBCNK?: KeyedMutator<any>
}

export default function RejectFormModal(props: RejectFormModalProps) {
  const { open, onClose, formInstance, mutate, isBCNK, mutateBCNK } = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Schema validation
  const schema = v.object({
    description: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập nội dung từ chối'))
  })

  // Khởi tạo form với react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RejectFormValues>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      description: ''
    }
  })

  const onSubmit = async (data: RejectFormValues) => {
    if (!formInstance) return

    setIsSubmitting(true)

    const toastID = toast.loading('Đang xử lý...')

    try {
      await formInstanceService.approveForm(
        formInstance._id,
        {
          approveStatus: 'rejected',
          description: data.description
        },
        () => {
          toast.update(toastID, {
            render: 'Đã từ chối đơn thành công',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
          setIsSubmitting(false)
          onClose()
          mutate()

          if (isBCNK) {
            mutateBCNK?.()
          }
        },
        error => {
          toast.update(toastID, {
            render: error.message || 'Không thể từ chối đơn',
            type: 'error',
            isLoading: false,
            autoClose: 3000
          })
          setIsSubmitting(false)
        }
      )
    } catch (error) {
      toast.update(toastID, {
        render: 'Có lỗi xảy ra',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
      setIsSubmitting(false)
    }
  }

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title='Từ chối đơn'
      closeOutside
      maxWidth='md'
      fullWidth
      actions={
        <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
          <Button variant='outlined' onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Từ chối đơn'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ p: 2 }}>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label='Nội dung từ chối'
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
      </Box>
    </CustomDialog>
  )
}
