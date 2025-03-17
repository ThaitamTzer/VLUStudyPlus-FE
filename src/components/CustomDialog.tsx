import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material'

import Iconify from './iconify'

type CustomDialogProps = {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  actions?: React.ReactNode
}

export const CustomDialog = (props: CustomDialogProps) => {
  const { onClose, open, title, maxWidth, children, actions } = props

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px'
          }}
          onClick={onClose}
        >
          <Iconify icon='eva:close-outline' />
        </IconButton>
        <Typography variant='h4'>{title}</Typography>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  )
}
