'use client'

import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, MenuItem } from '@mui/material'

import { useClassStore } from '@/stores/class/class'
import Iconify from '@/components/iconify'
import EditContent from './editContent'
import CustomTextField from '@/@core/components/mui/TextField'

export default function EditClassModal() {
  const { openEditClassfilterModal, toogleOpenEditClassfilterModal, setClassFilter, classFilter, classID, setClassID } =
    useClassStore()

  const handleClose = () => {
    toogleOpenEditClassfilterModal()
    setClassFilter({} as any)
  }

  return (
    <Dialog open={openEditClassfilterModal} onClose={handleClose} fullWidth maxWidth='md'>
      <DialogTitle>
        <Typography variant='h4'>Cập nhật lớp niên chế</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              select
              fullWidth
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    maxHeight: 300
                  }
                }
              }}
              onChange={e => {
                setClassID(e.target.value)
              }}
              value={classID}
            >
              <MenuItem disabled value=''>
                Chọn một lớp niên chế
              </MenuItem>
              {classFilter?.lectureId?.classes?.map(item => {
                return (
                  <MenuItem key={item._id} value={item._id}>
                    {item.classId}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
        </Grid>
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
          <Iconify icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <EditContent
          classData={classFilter?.lectureId?.classes?.find(item => item._id === classID)}
          handleClose={handleClose}
          lecturer={classFilter?.lectureId?._id || ''}
        />
      </DialogContent>
    </Dialog>
  )
}
