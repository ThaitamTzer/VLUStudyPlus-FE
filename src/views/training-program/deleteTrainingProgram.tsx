'use client'

import { useCallback, useState } from 'react'

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import { Button } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'

type DeleteTrainingProgramProps = {
  mutate: KeyedMutator<any>
}

export default function DeleteTrainingProgram(props: DeleteTrainingProgramProps) {
  const { mutate } = props

  const { openDeleteTrainingProgram, toogleDeleteTrainingProgram, setTrainingProgram, trainingProgram } =
    useTrainingProgramStore()

  const [loading, setLoading] = useState<boolean>(false)

  const onClose = useCallback(() => {
    toogleDeleteTrainingProgram()
    setTrainingProgram({} as any)
  }, [toogleDeleteTrainingProgram, setTrainingProgram])

  const handleDelete = useCallback(async () => {
    if (!trainingProgram) return toast.error('Khung chương trình không tồn tại')

    const toastId = toast.loading('Đang xóa khung chương trình')

    setLoading(true)

    await trainingProgramService.delete(
      trainingProgram._id,
      () => {
        setLoading(false)
        toast.update(toastId, {
          render: 'Xóa khung chương trình thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        mutate()
        onClose()
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
  }, [mutate, onClose, setLoading, trainingProgram])

  return (
    <CustomDialog
      open={openDeleteTrainingProgram}
      onClose={onClose}
      title='Xóa khung chương trình đào tạo'
      closeOutside
      onSubmit={handleDelete}
      actions={
        <>
          <Button variant='outlined' color='secondary' onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <LoadingButton onClick={handleDelete} variant='contained' color='error' type='submit' loading={loading}>
            Xóa
          </LoadingButton>
        </>
      }
    >
      <div>
        Bạn có chắc chắn muốn xóa <strong style={{ color: '#d50000' }}>{trainingProgram?.title}</strong> không?
      </div>
    </CustomDialog>
  )
}
