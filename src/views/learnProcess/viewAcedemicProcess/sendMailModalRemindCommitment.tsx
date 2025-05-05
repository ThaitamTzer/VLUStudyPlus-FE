'use client'
import { useCallback, useState } from 'react'

import { Button, Grid } from '@mui/material'
import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import useSWR from 'swr'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { CustomDialog } from '@/components/CustomDialog'
import mailService from '@/services/mail.service'
import Iconify from '@/components/iconify'

export default function SendMailModalRemindCommitment({ id }: { id: string }) {
  const { openSendEmailRemindCommitment, toogleSendEmailRemindCommitment } = useAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const { data, isLoading } = useSWR(id ? `/api/notification/get-number-remind-commitment/${id}` : null, () =>
    mailService.getNumberSend(id)
  )

  console.log(data)

  const onSendMail = async () => {
    if (!id) return toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!')

    const formData = new FormData()

    formData.append('commitment', 'true')

    setLoading(true)

    const toastId = toast.loading('Đang gửi mail nhắc nhở...')

    await mailService.remindMail(
      id,
      formData,
      () => {
        toogleSendEmailRemindCommitment()
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
  }

  const onClose = useCallback(() => {
    toogleSendEmailRemindCommitment()
  }, [toogleSendEmailRemindCommitment])

  return (
    <CustomDialog
      open={openSendEmailRemindCommitment}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      title='Xác nhận gửi mail nhắc nhở SV làm đơn'
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
          {isLoading ? (
            <div className='flex items-center'>
              <Iconify icon='mdi:loading' className='animate-spin' />
              <span className='ml-2'>Đang tải dữ liệu...</span>
            </div>
          ) : data?.numberRemindCommitment === 0 ? (
            <p>Không cần gửi nhắc nhở vì các SV đã làm đơn</p>
          ) : (
            <p>Số lượng mail sẽ gửi là {data?.numberRemindCommitment} mail. Bạn có chắc chắn muốn gửi ?</p>
          )}
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
