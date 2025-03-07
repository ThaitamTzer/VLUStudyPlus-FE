'use client'

import { useState, useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import Iconify from './iconify'

type AlertModalProps = {
  onSubmit: () => void
  open: boolean
  onClose: () => void
  title: string
  content: string | JSX.Element
  loading: boolean
  cancelText?: string
  submitText?: string
  submitColor?: 'primary' | 'secondary' | 'error'
  countdown?: boolean
}

export default function AlertDelete(props: AlertModalProps) {
  const { content, onClose, onSubmit, open, title, loading, countdown } = props
  const [countdownTime, setCountdownTime] = useState(5)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown && open) {
      setCountdownTime(5)
      timer = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 1) {
            clearInterval(timer)

            return 0
          }

          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [countdown, open])

  const handleClose = () => {
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !(countdown && countdownTime > 0)) {
      onSubmit()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='mdi:close' />
        </IconButton>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose}>
          {props.cancelText || 'Hủy'}
        </Button>
        <LoadingButton
          loading={loading}
          color={props.submitColor || 'error'}
          variant='contained'
          onClick={onSubmit}
          autoFocus
          disabled={countdown && countdownTime > 0}
        >
          {props.submitText || 'Xóa'} {countdown && countdownTime > 0 ? `(${countdownTime}s)` : ''}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
