'use client'

import { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, Tab, Typography, IconButton, Badge } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'

import Iconify from '@/components/iconify'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import TableImportResults from './tableImportResults'
import TableMissing from './tableMissing'

export default function PreviewImport() {
  const { openImportResult, toogleImportResult, duplicateRows, importResult, missingInfoRows, updateResult } =
    useClassStudentStore()

  const [tab, setTab] = useState<string>('1')

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const handleClose = () => {
    toogleImportResult()
  }

  return (
    <Dialog open={openImportResult} onClose={handleClose} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h4'>Kết quả nhập sinh viên</Typography>
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
                  Sinh viên đã thêm mới <Badge>{importResult?.length}</Badge>
                </>
              }
              sx={{ color: 'green', '&.Mui-selected': { color: 'green' } }}
            />
            <Tab
              value={'2'}
              label={
                <>
                  Sinh viên đã cập nhật <Badge>{updateResult.length}</Badge>
                </>
              }
              sx={{ color: 'orange', '&.Mui-selected': { color: 'orange' } }}
            />
            <Tab
              value={'3'}
              label={
                <>
                  Sinh viên bị lỗi <Badge>{missingInfoRows?.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
            <Tab
              value={'4'}
              label={
                <>
                  Sinh viên bị trùng lặp <Badge>{duplicateRows?.length}</Badge>
                </>
              }
              sx={{ color: 'red', '&.Mui-selected': { color: 'red' } }}
            />
          </TabList>
          <TabPanel value={'1'}>
            <TableImportResults importResultData={importResult} />
            {importResult?.length === 0 && (
              <Typography variant='h3' color='textSecondary'>
                Không có sinh viên nào được thêm mới
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={'2'}>
            <TableImportResults importResultData={updateResult} />
            {updateResult.length === 0 && (
              <Typography variant='h3' color='textSecondary'>
                Không có sinh viên nào được cập nhật
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={'3'}>
            <TableMissing missingInfoRows={missingInfoRows} />
          </TabPanel>
          <TabPanel value={'4'}>
            <TableMissing missingInfoRows={duplicateRows} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
