'use client'

import { useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { useTermStore } from '@/stores/term/term'
import type { Term, TermType } from '@/types/management/termType'

import termService from '@/services/term.service'

type AlertDeleteProps = {
  mutate: KeyedMutator<TermType>
}

export default function AlertDelete(props: AlertDeleteProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)
  const { openDeleteTerm, toogleDeleteTerm, term, setTerm } = useTermStore()

  const handleClose = () => {
    toogleDeleteTerm()
  }

  const handleDelete = async () => {
    setLoading(true)
    await termService.delete(
      term._id,
      () => {
        setLoading(false)
        toogleDeleteTerm()
        toast.success('Xóa học kỳ thành công')
        mutate()
        setTerm({} as Term)
      },
      () => {
        setLoading(false)
        toast.error('Xóa học kỳ thất bại')
      }
    )
  }

  return (
    <Dialog open={openDeleteTerm} onClose={handleClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText>Bạn có chắc chắn muốn xóa học kỳ {term.termName} này không?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose}>
          Hủy
        </Button>
        <LoadingButton loading={loading} variant='contained' onClick={handleDelete} autoFocus>
          Xóa
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
