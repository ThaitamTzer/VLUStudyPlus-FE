'use client'
import { useCallback, useState } from 'react'

import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material'
import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import useSWR from 'swr'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { CustomDialog } from '@/components/CustomDialog'
import mailService from '@/services/mail.service'

const schema = v.object({
  processed: v.boolean(),
  commitment: v.boolean()
})

type FormData = InferInput<typeof schema>

export default function SendMailModalRemind({ id }: { id: string }) {
  const { openSendEmailRemind, toogleSendEmailRemind } = useAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const { data, isLoading } = useSWR(id ? `/api/notification/get-number-remind/${id}` : null, () =>
    mailService.getNumberSend(id)
  )

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      processed: false,
      commitment: false
    }
  })

  const onSendMail = handleSubmit(async data => {
    // Kiểm tra nếu không có `id`
    if (!id) return toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!')

    const formData = new FormData()

    const { processed, commitment } = data

    formData.append('processed', processed.toString())
    formData.append('commitment', commitment.toString())

    setLoading(true)

    const toastId = toast.loading('Đang gửi mail nhắc nhở...')

    await mailService.remindMail(
      id,
      formData,
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
            name='processed'
            render={({ field }) => (
              <FormControlLabel
                label={
                  <div>
                    Gửi thông báo nhắc nhở XLHV{' '}
                    {isLoading && !data ? (
                      <>
                        <style jsx>{`
                          @keyframes ping-custom {
                            75%,
                            100% {
                              transform: scale(2);
                              opacity: 0;
                            }
                          }

                          .animate-ping-custom {
                            animation: ping-custom 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                          }

                          .delay-1 {
                            animation-delay: 0.2s;
                          }

                          .delay-2 {
                            animation-delay: 0.4s;
                          }
                        `}</style>
                        <span className='animate-ping-custom'>.</span>
                        <span className='animate-ping-custom delay-1'>.</span>
                        <span className='animate-ping-custom delay-2'>.</span>
                      </>
                    ) : (
                      '(' + data?.numberRemindProcess + ' mail)'
                    )}
                  </div>
                }
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
        <Grid item xs={12}>
          <Controller
            control={control}
            name='commitment'
            render={({ field }) => (
              <FormControlLabel
                label={
                  <div>
                    Gửi thông báo nhắc nhở sinh viên làm đơn cam kết{' '}
                    {isLoading && !data ? (
                      <>
                        <style jsx>{`
                          @keyframes ping-custom {
                            75%,
                            100% {
                              transform: scale(2);
                              opacity: 0;
                            }
                          }

                          .animate-ping-custom {
                            animation: ping-custom 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                          }

                          .delay-1 {
                            animation-delay: 0.2s;
                          }

                          .delay-2 {
                            animation-delay: 0.4s;
                          }
                        `}</style>
                        <span className='animate-ping-custom'>.</span>
                        <span className='animate-ping-custom delay-1'>.</span>
                        <span className='animate-ping-custom delay-2'>.</span>
                      </>
                    ) : (
                      '(' + data?.numberRemindCommitment + ' mail)'
                    )}
                  </div>
                }
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
