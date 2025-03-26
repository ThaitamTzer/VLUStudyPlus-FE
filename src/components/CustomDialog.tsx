import type { DialogProps } from '@mui/material'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material'

import Iconify from './iconify'

type CustomDialogProps = DialogProps & {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  actions?: React.ReactNode
  closeOutside?: boolean
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export const CustomDialog = (props: CustomDialogProps) => {
  const { onClose, open, title, maxWidth, children, actions, closeOutside, onSubmit, ...rest } = props

  return (
    <Dialog open={open} onClose={closeOutside ? onClose : undefined} maxWidth={maxWidth} {...rest}>
      <form onSubmit={onSubmit}>
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
      </form>
    </Dialog>
  )
}
