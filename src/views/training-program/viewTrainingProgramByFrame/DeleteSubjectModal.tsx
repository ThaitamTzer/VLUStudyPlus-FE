'use client'

import { useState } from 'react'

import { Button, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'

import { CustomDialog } from '@/components/CustomDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import subjectServices from '@/services/subject.service'
import type { Subjects } from '@/types/management/trainningProgramType'

interface DeleteSubjectModalProps {
  open: boolean
  onClose: () => void
  subject: Subjects
  onSuccess?: () => void
}

const schema = v.object({
  reason: v.pipe(
    v.string(),
    v.nonEmpty('Vui lòng nhập lý do xóa môn học'),
    v.maxLength(255, 'Lý do xóa không được quá 255 ký tự')
  )
})

type DeleteForm = v.InferInput<typeof schema>

const DeleteSubjectModal: React.FC<DeleteSubjectModalProps> = ({ open, onClose, subject, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DeleteForm>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      reason: ''
    }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = handleSubmit(async data => {
    console.log('data', data)

    if (!subject._id) {
      toast.error('Không tìm thấy ID môn học')

      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Đang xóa môn học...')

    try {
      await subjectServices.deleteSubject(
        subject._id,
        data,
        () => {
          toast.update(toastId, {
            render: 'Xóa môn học thành công',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          })
          onSuccess?.()
          handleClose()
        },
        err => {
          toast.update(toastId, {
            render: err?.message || 'Có lỗi xảy ra khi xóa môn học',
            type: 'error',
            isLoading: false,
            autoClose: 2000
          })
        }
      )
    } catch (error) {
      toast.update(toastId, {
        render: 'Có lỗi xảy ra khi xóa môn học',
        type: 'error',
        isLoading: false,
        autoClose: 2000
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title='Xóa môn học'
      maxWidth='sm'
      actions={
        <>
          <Button variant='contained' onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button variant='contained' color='error' onClick={onSubmit} disabled={isSubmitting}>
            Xóa
          </Button>
        </>
      }
    >
      <Typography sx={{ mb: 2 }}>
        Bạn có chắc chắn muốn xóa môn học <strong>{subject.courseName}</strong> không?
      </Typography>

      <Controller
        name='reason'
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label='Lý do xóa môn học'
            error={!!errors.reason}
            helperText={errors.reason?.message}
            multiline
            fullWidth
            rows={3}
          />
        )}
      />
    </CustomDialog>
  )
}

export default DeleteSubjectModal
