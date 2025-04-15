'use client'

import { Button } from '@mui/material'

import useSWR from 'swr'

import Iconify from '@/components/iconify'
import type { LearnProcessType, ListProcessingType } from '@/types/management/learnProcessType'
import mailService from '@/services/mail.service'

type NotificantionActionProps = {
  acedemicProcess: LearnProcessType | null
  data: ListProcessingType | undefined
  tooogleSendEmail: () => void
  toogleSendEmailRemind: () => void
  toogleManualAddFromViewByCate: () => void
}

export const NotificantionAction = (props: NotificantionActionProps) => {
  const { acedemicProcess, toogleSendEmailRemind, data } = props

  const id = acedemicProcess?._id || ''

  const { data: numberOfMail, isLoading } = useSWR(id ? `/api/notification/get-number-remind-hehe/${id}` : null, () =>
    mailService.getNumberSend(id)
  )

  return (
    <div className='flex gap-2'>
      {/* {!acedemicProcess?.isNotification ? (
        <Button
          disabled={data?.pagination.totalItems === 0}
          onClick={tooogleSendEmail}
          variant='contained'
          startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
          className='max-sm:is-full'
        >
          Thông báo XLHV GV-SV
        </Button>
      ) : ( */}
      <>
        {!isLoading && numberOfMail && numberOfMail?.numberRemindProcess > 0 && (
          <Button
            disabled={data?.pagination.totalItems === 0}
            variant='contained'
            onClick={toogleSendEmailRemind}
            startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
            className='max-sm:is-full'
          >
            Nhắc nhở XLHV GV-SV
          </Button>
        )}

        {numberOfMail && numberOfMail?.numberRemindCommitment > 0 && (
          <Button
            disabled={data?.pagination.totalItems === 0}
            variant='contained'
            startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
            className='max-sm:is-full'
          >
            Nhắc nhở SV làm đơn
          </Button>
        )}
      </>
      {/* )} */}
    </div>
  )
}
