import { useState, useRef } from 'react'

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
  Popover,
  Button,
  Paper
} from '@mui/material'
import { toast } from 'react-toastify'

import Iconify from '@/components/iconify'
import majorService from '@/services/major.service'

interface ConcentrationItemProps {
  concentration: any
  onUpdate: () => void
}

export default function ConcentrationItem({ concentration, onUpdate }: ConcentrationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  const concentrationId = concentration._id || concentration.id
  const concentrationName = concentration.concentrationName || concentration.name

  const handleEdit = () => {
    setIsEditing(true)
    setTempName(concentrationName)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempName('')
  }

  const handleSave = async () => {
    if (!tempName.trim()) {
      toast.error('Tên chuyên ngành không được để trống')

      return
    }

    const toastId = toast.loading('Đang cập nhật chuyên ngành...')

    setIsUpdating(true)

    await majorService.updateConcentration(
      concentrationId,
      {
        concentrationName: tempName.trim(),
        concentrationId: concentration.concentrationId || concentration.id
      },
      () => {
        toast.update(toastId, {
          render: 'Cập nhật chuyên ngành thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        setIsEditing(false)
        setIsUpdating(false)
        setTempName('')
        onUpdate()
      },
      error => {
        console.error('Error updating concentration:', error)
        toast.update(toastId, {
          render: error.message || 'Có lỗi xảy ra khi cập nhật chuyên ngành',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        setIsUpdating(false)
      }
    )
  }

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true)
  }

  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false)
  }

  const handleDeleteConfirm = async () => {
    setConfirmDeleteOpen(false)

    const toastId = toast.loading('Đang xóa chuyên ngành...')

    setIsUpdating(true)

    await majorService.deleteConcentration(
      concentrationId,
      () => {
        toast.update(toastId, {
          render: 'Xóa chuyên ngành thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        onUpdate()
        setIsUpdating(false)
      },
      error => {
        console.error('Error deleting concentration:', error)
        toast.update(toastId, {
          render: error.message || 'Có lỗi xảy ra khi xóa chuyên ngành',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        setIsUpdating(false)
      }
    )
  }

  return (
    <>
      <ListItem
        sx={{
          borderRadius: 1,
          mb: 1,
          bgcolor: 'action.hover',
          '&:hover': {
            bgcolor: 'action.selected'
          },
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <ListItemIcon>
            <Iconify icon='material-symbols:bookmark' style={{ color: '#CA7842' }} />
          </ListItemIcon>

          {isEditing ? (
            <Box sx={{ flex: 1, mr: 2 }}>
              <TextField
                fullWidth
                size='small'
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder='Tên chuyên ngành'
                disabled={isUpdating}
                sx={{ mb: 1 }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleSave()
                  }
                }}
              />
              {(concentration.concentrationId || concentration.id) && (
                <Typography variant='body2' color='text.secondary'>
                  Mã: {concentration.concentrationId || concentration.id}
                </Typography>
              )}
            </Box>
          ) : (
            <ListItemText
              primary={
                <Typography variant='body1' fontWeight={500}>
                  {concentrationName}
                </Typography>
              }
              secondary={
                concentration.concentrationId || concentration.id ? (
                  <Typography variant='body2' color='text.secondary'>
                    Mã: {concentration.concentrationId || concentration.id}
                  </Typography>
                ) : null
              }
            />
          )}

          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            {isEditing ? (
              <>
                <Tooltip title='Lưu'>
                  <IconButton size='small' onClick={handleSave} disabled={isUpdating} sx={{ color: 'success.main' }}>
                    {isUpdating ? <CircularProgress size={16} /> : <Iconify icon='material-symbols:check' />}
                  </IconButton>
                </Tooltip>
                <Tooltip title='Hủy'>
                  <IconButton
                    size='small'
                    onClick={handleCancel}
                    disabled={isUpdating}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Iconify icon='material-symbols:close' />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title='Chỉnh sửa'>
                  <IconButton size='small' onClick={handleEdit} disabled={isUpdating} sx={{ color: 'primary.main' }}>
                    <Iconify icon='material-symbols:edit' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Xóa'>
                  <IconButton
                    ref={deleteButtonRef}
                    size='small'
                    onClick={handleDeleteClick}
                    disabled={isUpdating}
                    sx={{ color: 'error.main' }}
                  >
                    {isUpdating ? <CircularProgress size={16} /> : <Iconify icon='material-symbols:delete' />}
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </ListItem>

      {/* Popover xác nhận xóa */}
      <Popover
        open={confirmDeleteOpen}
        anchorEl={deleteButtonRef.current}
        onClose={handleDeleteCancel}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Paper sx={{ p: 3, maxWidth: 320 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Iconify
              icon='material-symbols:warning'
              style={{ color: '#ff9800', fontSize: 24, marginRight: 12, marginTop: 2 }}
            />
            <Box>
              <Typography variant='h6' sx={{ mb: 1 }}>
                Xác nhận xóa
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Bạn có chắc chắn muốn xóa chuyên ngành &quot;{concentrationName}&quot; không? Hành động này không thể
                hoàn tác.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant='outlined' size='small' onClick={handleDeleteCancel} sx={{ minWidth: 70 }}>
              Hủy
            </Button>
            <Button variant='contained' color='error' size='small' onClick={handleDeleteConfirm} sx={{ minWidth: 70 }}>
              Xóa
            </Button>
          </Box>
        </Paper>
      </Popover>
    </>
  )
}
