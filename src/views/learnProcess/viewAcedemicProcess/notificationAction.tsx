'use client'

import { Button } from '@mui/material'

import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'

import Iconify from '@/components/iconify'
import type { LearnProcessType, ListProcessingType } from '@/types/management/learnProcessType'
import mailService from '@/services/mail.service'

type NotificantionActionProps = {
  acedemicProcess: LearnProcessType | null
  data: ListProcessingType | undefined
  tooogleSendEmail?: () => void
  toogleSendEmailRemind: () => void
  toogleManualAddFromViewByCate: () => void
  toogleSendEmailRemindCommitment: () => void
}

export const NotificantionAction = (props: NotificantionActionProps) => {
  const { acedemicProcess, toogleSendEmailRemind, data, tooogleSendEmail, toogleSendEmailRemindCommitment } = props

  const { user } = useAuth()

  const isCVHT = user?.role?.name === 'CVHT'

  const id = acedemicProcess?._id || ''

  const { data: numberOfMail } = useSWR(id ? `/api/notification/get-number-remind-hehe/${id}` : null, () =>
    mailService.getNumberSend(id)
  )

  return (
    <div className='flex gap-2'>
      {isCVHT && acedemicProcess?.isNotification && (
        <Button
          disabled={data?.pagination.totalItems === 0 || numberOfMail?.numberRemindCommitment === 0}
          variant='contained'
          startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
          className='max-sm:is-full'
          onClick={toogleSendEmailRemindCommitment}
        >
          Nhắc nhở SV làm đơn
        </Button>
      )}

      {!isCVHT && !acedemicProcess?.isNotification && (
        <Button
          disabled={data?.pagination.totalItems === 0}
          variant='contained'
          startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
          className='max-sm:is-full'
          onClick={tooogleSendEmail}
        >
          Thông báo XLHV GV-SV
        </Button>
      )}

      {!isCVHT && acedemicProcess?.isNotification && (
        <>
          <Button
            disabled={data?.pagination.totalItems === 0 || numberOfMail?.numberRemindProcess === 0}
            variant='contained'
            onClick={toogleSendEmailRemind}
            startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
            className='max-sm:is-full'
          >
            Nhắc nhở XLHV GV-SV
          </Button>

          <Button
            disabled={data?.pagination.totalItems === 0 || numberOfMail?.numberRemindCommitment === 0}
            variant='contained'
            onClick={toogleSendEmailRemindCommitment}
            startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
            className='max-sm:is-full'
          >
            Nhắc nhở SV làm đơn
          </Button>
        </>
      )}
    </div>
  )
}
