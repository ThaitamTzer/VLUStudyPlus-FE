'use client'

import dynamic from 'next/dynamic'

import { Card, CardContent, Grid, Stack, Typography, Box } from '@mui/material'
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
import LoadingLogo from '@/components/loading-screen/loadingLogo'
import Iconify from '@/components/iconify'

const UpdateGradeByLec = dynamic(() => import('../grade/UpdateGradeByLec'), { ssr: false })
const UpdateExistingGradeByLec = dynamic(() => import('../grade/UpdateExistingGradeByLec'), { ssr: false })
const UpdateAdviseByLec = dynamic(() => import('../grade/UpdateAdviseByLec'), { ssr: false })

export default function ClassLecturerPage() {
  const { data, mutate, isLoading } = useSWR('/api/class/view-list-class-of-CVHT', classLecturerService.getList)
  const { classCode } = useClassStudentStore()
  const { loading, resetProgress } = useUploadStore()

  return (
    <>
      <PageHeader title='Danh sách lớp' />

      {/* Hướng dẫn sử dụng */}
      <Card sx={{ mb: 3, bgcolor: 'background.neutral' }}>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon='solar:info-circle-outline' />
            Hướng dẫn sử dụng
          </Typography>
          <Grid container spacing={2} direction='column'>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Iconify icon='tabler-chart-bar' className='text-purple-700' />
                <Typography variant='body2'>
                  <strong>Xem kết quả học tập:</strong> Xem điểm số và kết quả học tập của lớp
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Iconify icon='solar:eye-outline' className='text-blue-700' />
                <Typography variant='body2'>
                  <strong>Xem danh sách sinh viên:</strong> Xem chi tiết thông tin sinh viên trong lớp
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Iconify icon='mynaui:plus-solid' className='text-green-700' />
                <Typography variant='body2'>
                  <strong>Thêm sinh viên:</strong> Thêm sinh viên mới vào lớp (thủ công hoặc import file)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={5}>
        {data && data.map(item => <ClassCard key={item._id} item={item} />)}
        {isLoading && (
          <>
            <Grid item xs={12} mt={70}>
              <Stack direction='column' alignItems='center' justifyContent='center' spacing={4}>
                <LoadingLogo />
                <Typography variant='h4' color='textSecondary'>
                  Đang lấy dữ liệu lớp học của bạn...
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
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
      <UpdateGradeByLec />
      <UpdateExistingGradeByLec />
      <UpdateAdviseByLec />
    </>
  )
}
