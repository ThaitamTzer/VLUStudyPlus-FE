'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  IconButton,
  MenuItem
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { useClassStore } from '@/stores/class/class'
import Iconify from '@/components/iconify'
import classService from '@/services/class.service'

export default function DeleteModal({ mutate }: { mutate: KeyedMutator<any> }) {
  const { openDeleteClassfilterModal, toogleOpenDeleteClassfilterModal, classFilter } = useClassStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')

  const handleClose = () => {
    toogleOpenDeleteClassfilterModal()
  }

  const onSubmit = async () => {
    if (!classFilter) return

    setLoading(true)
    await classService.delete(
      value,
      () => {
        toast.success('Xóa lớp niên chế thành công')
        mutate()
        handleClose()
      },
      err => {
        toast.error(err.message)
        setLoading(false)
      }
    )
  }

  return (
    <Dialog open={openDeleteClassfilterModal} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Typography variant='h4'>Xóa lớp niên chế</Typography>
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
          <Iconify icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CustomTextField
          select
          label='Chọn lớp niên chế'
          SelectProps={{
            displayEmpty: true
          }}
          fullWidth
          value={value}
          onChange={e => setValue(e.target.value)}
          variant='outlined'
        >
          <MenuItem value='' disabled>
            Chọn lớp niên chế
          </MenuItem>
          {classFilter?.lectureId?.classes?.map((item, index) => (
            <MenuItem key={index} value={item._id}>
              {item.classId}
            </MenuItem>
          ))}
        </CustomTextField>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose}>
          Hủy
        </Button>
        <LoadingButton loading={loading} onClick={onSubmit} type='submit' variant='contained' color='error'>
          Xóa
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
