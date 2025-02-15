'use client'

import { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, Tab, Typography, IconButton, Badge } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'

import { useLecturerStore } from '@/stores/lecturer/lecturer'
import Iconify from '@/components/iconify'
import TableLecturersResults from './tableLecturersResults'
import TableLecturersMissing from './tableLecturersMissing'
import TableLecturersDuplicate from './tableLecturersDuplicate'

export default function PreviewLecturerImport() {
  const { openPreviewImport, setOpenPreviewImport, lecturersResult, duplicateRows, missingInfoRows, updateLecturers } =
    useLecturerStore()

  const [tab, setTab] = useState<string>('1')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const handleClose = () => {
    setOpenPreviewImport(false)
  }

  return (
    <Dialog open={openPreviewImport} onClose={handleClose} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h4'>Kết quả nhập giảng viên</Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Iconify icon='material-symbols:close-rounded' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TabContext value={tab}>
          <TabList onChange={handleChangeTab} variant='scrollable' scrollButtons='auto'>
            <Tab
              value={'1'}
              label={
                <>
                  Giảng viên đã thêm mới <Badge>{lecturersResult?.length}</Badge>
                </>
              }
              sx={{ color: 'green', '&.Mui-selected': { color: 'green' } }}
            />
            <Tab
              value={'2'}
              label={
                <>
                  Giảng viên đã cập nhật <Badge>{updateLecturers.length}</Badge>
                </>
              }
              sx={{ color: 'orange', '&.Mui-selected': { color: 'orange' } }}
            />
            <Tab
              value={'3'}
              label={
                <>
                  Giảng viên bị lỗi <Badge>{missingInfoRows?.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
            <Tab
              value={'4'}
              label={
                <>
                  Giảng viên bị trùng lặp <Badge>{duplicateRows?.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
          </TabList>
          <TabPanel value={'1'}>
            <TableLecturersResults lecturersResult={lecturersResult} />
            {lecturersResult?.length === 0 && (
              <Typography variant='h3' color='textSecondary'>
                Không có giảng viên nào được thêm mới
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={'2'}>
            <TableLecturersResults lecturersResult={updateLecturers} />
            {updateLecturers.length === 0 && (
              <Typography variant='h3' color='textSecondary'>
                Không có giảng viên nào được cập nhật
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={'3'}>
            <TableLecturersMissing missingInfoRows={missingInfoRows} />
          </TabPanel>
          <TabPanel value={'4'}>
            <TableLecturersDuplicate duplicateRows={duplicateRows} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
