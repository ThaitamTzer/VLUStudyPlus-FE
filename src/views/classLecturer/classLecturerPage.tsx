'use client'

import { Card, CardContent, Grid, Typography } from '@mui/material'
import useSWR from 'swr'

import { TabPanel } from '@mui/lab'

import PageHeader from '@/components/page-header'
import classLecturerService from '@/services/classLecturer.service'
import ImportStudent from '../classStudent/importAddStudent'
import { useClassStudentStore, useUploadStore } from '@/stores/classStudent/classStudent.store'
import PreviewImport from '../classStudent/importResult'
import AddModal from '../classStudent/addModal'
import ManualAddStudent from '../classStudent/manualAddStudent'
import ProgressModal from '../../components/dialogs/progressModal'
import ModalViewGradeByClass from '../grade/ModalViewGradeByClass'
import { ClassCard } from './ClassCard'

export default function ClassLecturerPage() {
  const { data, mutate } = useSWR('/api/class/view-list-class-of-CVHT', classLecturerService.getList)
  const { classCode } = useClassStudentStore()
  const { loading, resetProgress } = useUploadStore()

  return (
    <>
      <PageHeader title='Danh sách lớp' />
      <Grid container spacing={5}>
        {data && data.map(item => <ClassCard key={item._id} item={item} />)}
        {data && data.length === 0 && (
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant='h4' color='textSecondary'>
                  Hiện tại bạn chưa được phân công lớp nào
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <AddModal>
        <TabPanel value={'1'}>
          <ManualAddStudent mutate={mutate} />
        </TabPanel>
        <TabPanel value={'2'}>
          <ImportStudent mutate={mutate} classCode={classCode} />
        </TabPanel>
      </AddModal>
      <PreviewImport />
      <ProgressModal open={loading} isCompleted={!loading} isProcessing={loading} onClose={resetProgress} />
      <ModalViewGradeByClass />
    </>
  )
}
