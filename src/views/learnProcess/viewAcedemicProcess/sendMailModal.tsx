'use client'
import { useCallback, useState } from 'react'

import { Button } from '@mui/material'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import type { KeyedMutator } from 'swr'
import useSWR, { mutate as fetcher } from 'swr'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { CustomDialog } from '@/components/CustomDialog'
import mailService from '@/services/mail.service'
import Iconify from '@/components/iconify'

export default function SendMailModal({ id, mutate }: { id: string; mutate: KeyedMutator<any> }) {
  const { openSendEmail, tooogleSendEmail } = useAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const { data: numberOfSendMail, isLoading } = useSWR(
    id ? `/api/notification/get-number-notification/${id}` : null,
    () => mailService.getNumberSend(id)
  )

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
        mutate()
        fetcher('/api/learnProcess')
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
          <LoadingButton loading={loading} variant='contained' disabled={isLoading} onClick={onSendMail}>
            Gửi mail
          </LoadingButton>
        </>
      }
    >
      {isLoading ? (
        <div className='flex items-center gap-2'>
          <Iconify icon={'mdi:loading'} className='animate-spin' />
          <p>Đang tính toán số lượng mail cần gửi...</p>
        </div>
      ) : (
        <div>
          <p>
            Số lượng mail sẽ gửi để thông báo xử lý học tập là{' '}
            <strong className='text-red-700'>{numberOfSendMail?.numberRemindProcess} mail</strong> Bao gồm sinh viên bị
            XLHV và CVHT phụ trách lớp niên chế của các sinh viên bị xử lý
          </p>
        </div>
      )}
    </CustomDialog>
  )
}
