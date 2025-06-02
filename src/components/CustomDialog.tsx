import { useRef } from 'react'

import type { DialogProps, PaperProps } from '@mui/material'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, Paper } from '@mui/material'

import Draggable from 'react-draggable'

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
  canDrag?: boolean
  draggableTitle?: string
}

function PaperComponent(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle={`#draggable-dialog-title`}
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  )
}

export const CustomDialog = (props: CustomDialogProps) => {
  const { onClose, open, title, children, actions, closeOutside, onSubmit, canDrag, ...rest } = props

  return (
    <Dialog
      PaperComponent={canDrag ? PaperComponent : undefined}
      open={open}
      aria-labelledby={canDrag ? 'draggable-dialog-title' : undefined}
      onClose={closeOutside ? onClose : undefined}
      {...rest}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ cursor: canDrag ? 'move' : 'default' }} id={canDrag ? 'draggable-dialog-title' : undefined}>
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
