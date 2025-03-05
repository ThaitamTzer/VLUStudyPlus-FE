'use client'
import { useState } from 'react'

import { Dialog, DialogContent, DialogTitle, IconButton, Tab, Typography } from '@mui/material'

import { TabContext, TabList } from '@mui/lab'

import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import Iconify from '@/components/iconify'

export default function AddModal({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<string>('1')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const { openAddModal, setOpenAddModal, setClassCode, classCode } = useClassStudentStore()

  const handleClose = () => {
    setOpenAddModal(false)
    setClassCode('')
  }

  return (
    <Dialog open={openAddModal} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <Iconify icon='mdi:close' />
        </IconButton>
        <Typography variant='h4'>Thêm sinh viên vào lớp {classCode ?? classCode}</Typography>
      </DialogTitle>
      <DialogContent>
        <TabContext value={tab}>
          <TabList onChange={handleChangeTab}>
            <Tab value={'1'} label='Thủ công' />
            <Tab value={'2'} label='Import' />
          </TabList>
          {children}
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
