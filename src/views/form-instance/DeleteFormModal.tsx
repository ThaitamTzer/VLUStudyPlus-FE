'use client'

import { Button, DialogContentText } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'

type DeleteFormModalProps = {
  open: boolean
  onClose: () => void
  onDelete: () => void
  title: string
  description: string
  loading?: boolean
}

export default function DeleteFormModal({
  open,
  onClose,
  onDelete,
  title,
  description,
  loading
}: DeleteFormModalProps) {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={onDelete}
      actions={
        <>
          <Button onClick={onClose} variant='outlined' disabled={loading}>
            Hủy
          </Button>
          <LoadingButton onClick={onDelete} variant='contained' color='error' loading={loading}>
            Xóa
          </LoadingButton>
        </>
      }
    >
      <DialogContentText>{description}</DialogContentText>
    </CustomDialog>
  )
}
