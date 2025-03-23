'use client'
import { useCallback, useState } from 'react'

import { Button, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { CustomDialog } from '@/components/CustomDialog'
import mailService from '@/services/mail.service'

export default function SendMailModal({ id }: { id: string }) {
  const { openSendEmail, tooogleSendEmail } = useAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const onSendMail = async () => {
    // send mail

    if (!id) return toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!')

    setLoading(true)

    const toastId = toast.loading('Đang gửi mail...')

    await mailService.sendMail(
      id,
      () => {
        tooogleSendEmail()
        toast.update(toastId, {
          render: 'Gửi mail thành công',
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
  }

  const onClose = useCallback(() => {
    tooogleSendEmail()
  }, [tooogleSendEmail])

  return (
    <CustomDialog
      open={openSendEmail}
      onClose={onClose}
      title='Xác nhận gửi mail'
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
      <Typography variant='h6'>
        <strong className='text-red-700'>Lưu ý: </strong> Việc gửi mail này sẽ gửi đến{' '}
        <strong>Cán bộ giảng viên</strong> phụ trách lớp niên chế của các sinh viên bị xử lý và các{' '}
        <strong>sinh viên</strong> có trong đợt xử lý này. Bạn có chắc chắn muốn gửi mail không?
      </Typography>
    </CustomDialog>
  )
}
