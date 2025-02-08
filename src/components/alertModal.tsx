import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { LoadingButton } from '@mui/lab'

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
}

export default function AlertDelete(props: AlertModalProps) {
  const { content, onClose, onSubmit, open, title, loading } = props

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
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
        >
          {props.submitText || 'Xóa'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
