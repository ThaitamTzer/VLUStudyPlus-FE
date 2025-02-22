'use client'

import { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Tab } from '@mui/material'

import { TabContext, TabList, TabPanel } from '@mui/lab'

import type { KeyedMutator } from 'swr'

import { useClassStore } from '@/stores/class/class'
import Iconify from '@/components/iconify'
import EditContent from './editContent'

export default function EditClassModal({ mutate }: { mutate: KeyedMutator<any> }) {
  const [value, setValue] = useState<string>('1')
  const { openEditClassfilterModal, toogleOpenEditClassfilterModal, setClassFilter, classFilter } = useClassStore()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleClose = () => {
    toogleOpenEditClassfilterModal()
    setClassFilter({} as any)
    setValue('1')
  }

  return (
    <Dialog open={openEditClassfilterModal} onClose={handleClose} fullWidth maxWidth='md'>
      <DialogTitle>
        <Typography variant='h4'>Cập nhật lớp niên chế</Typography>
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
          <Iconify icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Edit class tabs'
            scrollButtons='auto'
            variant='scrollable'
            allowScrollButtonsMobile
            ScrollButtonComponent={({ direction, onClick }) => (
              <IconButton onClick={onClick} sx={{ color: 'primary.main' }}>
                {direction === 'left' ? (
                  <Iconify icon='solar:alt-arrow-left-bold' />
                ) : (
                  <Iconify icon='solar:alt-arrow-right-bold' />
                )}
              </IconButton>
            )}
          >
            {classFilter &&
              classFilter?.lectureId?.classes?.map((item, index) => (
                <Tab key={index} label={item.classId} value={`${index + 1}`} />
              ))}
          </TabList>
          {classFilter &&
            classFilter?.lectureId?.classes?.map((item, index) => (
              <TabPanel key={index} value={`${index + 1}`}>
                <EditContent
                  classData={item}
                  lecturer={classFilter.lectureId._id}
                  handleClose={handleClose}
                  mutate={mutate}
                />
              </TabPanel>
            ))}
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
