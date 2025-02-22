'use client'
import { useState } from 'react'

import { Dialog, DialogContent, DialogTitle, Tab, IconButton, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

import type { KeyedMutator } from 'swr'

import { useClassStore } from '@/stores/class/class'

import ManualAddClass from './manualAdd'
import Iconify from '@/components/iconify'
import ImportClass from './importAdd'

type AddModalProps = {
  mutate: KeyedMutator<any>
}

export default function AddModal({ mutate }: AddModalProps) {
  const { openAddClassModal, toogleOpenAddClassModal } = useClassStore()
  const [tab, setTab] = useState('1')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const onClose = () => {
    toogleOpenAddClassModal()
    setTab('1')
  }

  return (
    <Dialog open={openAddClassModal} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Typography variant='h4'>Thêm lớp niên chế</Typography>
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
          <Iconify icon='eva:close-outline' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TabContext value={tab}>
          <TabList onChange={handleChangeTab} aria-label='Add class tabs'>
            <Tab label='Thủ công' value='1' />
            <Tab label='Import' value='2' />
          </TabList>
          <TabPanel value='1'>
            <ManualAddClass mutate={mutate} />
          </TabPanel>
          <TabPanel value='2'>
            <ImportClass mutate={mutate} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
