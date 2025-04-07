'use client'
import { useState } from 'react'

import { Badge, Dialog, DialogContent, DialogTitle, IconButton, Tab, Typography } from '@mui/material'

import { TabContext, TabList, TabPanel } from '@mui/lab'

import Iconify from '@/components/iconify'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import TableImported from './tableImported'
import TableMissing from './tableMissing'

export default function ImportResult() {
  const { inserted, duplicateRows, missingInfoRows, toogleImportResultModal, openImportResultModal } =
    useAcedemicProcessStore()

  const [tab, setTab] = useState<string>('1')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const handleClose = () => {
    toogleImportResultModal()
  }

  return (
    <Dialog open={openImportResultModal} onClose={handleClose} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h4'>Kết quả nhập dữ liệu</Typography>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='material-symbols:close-rounded' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TabContext value={tab}>
          <TabList onChange={handleChangeTab} variant='scrollable' scrollButtons='auto'>
            <Tab
              value='1'
              label={
                <>
                  Dữ liệu đã nhập <Badge>{inserted.length}</Badge>
                </>
              }
              sx={{ color: 'green', '&.Mui-selected': { color: 'green' } }}
            />
            <Tab
              value='2'
              label={
                <>
                  Dữ liệu thiếu thông tin <Badge>{missingInfoRows.length}</Badge>
                </>
              }
              sx={{ color: 'orange', '&.Mui-selected': { color: 'orange' } }}
            />
            <Tab
              value='3'
              label={
                <>
                  Dữ liệu bị trùng <Badge>{duplicateRows.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
          </TabList>
          <TabPanel value='1'>
            <TableImported data={inserted} />
          </TabPanel>
          <TabPanel value='2'>
            <TableMissing data={missingInfoRows} />
          </TabPanel>
          <TabPanel value='3'>
            <TableMissing data={duplicateRows} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
