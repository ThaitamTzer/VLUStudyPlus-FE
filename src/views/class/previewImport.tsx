'use client'

import { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, Tab, Typography, IconButton, Badge } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'

import Iconify from '@/components/iconify'
import { useClassStore } from '@/stores/class/class'
import TableImportResults from './tableImportResults'
import TableLecturesResults from './tableLecturersResults'
import TableMissing from './tableMissing'
import TableUpdate from './tableUpdate'
import TableDupicate from './tableDublicate'

export default function PreviewImport() {
  const {
    openImportResultModal,
    toogleOpenImportResultModal,
    importResultData,
    lecturerDataImported,
    missingErrorData,
    updateSuccessData,
    duplicateClassData
  } = useClassStore()

  const [tab, setTab] = useState<string>('1')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const handleClose = () => {
    toogleOpenImportResultModal()
  }

  return (
    <Dialog open={openImportResultModal} onClose={handleClose} maxWidth='xl' fullWidth>
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
                  Lớp đã thêm mới <Badge>{importResultData?.length}</Badge>
                </>
              }
              sx={{ color: 'green', '&.Mui-selected': { color: 'green' } }}
            />
            <Tab
              value={'2'}
              label={
                <>
                  Giảng viên đã thêm mới <Badge>{lecturerDataImported.length}</Badge>
                </>
              }
              sx={{ color: 'green', '&.Mui-selected': { color: 'green' } }}
            />
            <Tab
              value={'3'}
              label={
                <>
                  Lớp đã cập nhật <Badge>{updateSuccessData.length}</Badge>
                </>
              }
              sx={{ color: 'orange', '&.Mui-selected': { color: 'orange' } }}
            />
            <Tab
              value={'4'}
              label={
                <>
                  Lớp bị lỗi <Badge>{missingErrorData?.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
            <Tab
              value={'5'}
              label={
                <>
                  Lớp bị trùng lặp <Badge>{duplicateClassData?.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
          </TabList>
          <TabPanel value={'1'}>
            <TableImportResults importResultData={importResultData} />
            {importResultData?.length === 0 && (
              <Typography variant='h3' color='textSecondary'>
                Không có lớp nào được thêm mới
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={'2'}>
            <TableLecturesResults importResultData={lecturerDataImported} />
            {lecturerDataImported.length === 0 && (
              <Typography variant='h3' color='textSecondary'>
                Không có giảng viên nào được thêm mới
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={'3'}>
            <TableUpdate updateData={updateSuccessData} />
          </TabPanel>
          <TabPanel value={'4'}>
            <TableMissing missingInfoRows={missingErrorData} />
          </TabPanel>
          <TabPanel value={'5'}>
            <TableDupicate duplicateData={duplicateClassData} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
