'use client'

import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Grid, Paper } from '@mui/material'

import useSWR from 'swr'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import Iconify from '@/components/iconify'

type ViewDetailAcedecmicProcessProps = {
  id: string
}

export default function ViewDetailAcedecmicProcess(props: ViewDetailAcedecmicProcessProps) {
  const { id } = props

  const { data } = useSWR(`/api/academic-processing/view-academicProcessing/${id}`, () =>
    learnProcessService.viewDetailProcess(id)
  )

  const { toogleViewDetailAcademicProcess, openViewDetailAcademicProcess } = useAcedemicProcessStore()

  const onClose = () => {
    toogleViewDetailAcademicProcess()
  }

  return (
    <Dialog open={openViewDetailAcademicProcess} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
          <Iconify icon='eva:close-outline' />
        </IconButton>
        <Typography variant='h4'>Chi tiết xử lý học vụ</Typography>
      </DialogTitle>
      <DialogContent>
        {data ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h6'>Thông tin sinh viên</Typography>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant='h6'>Mã sinh viên: {data.checkAcademicProcessing.studentId}</Typography>
                <Typography variant='h6'>
                  Họ và tên: {data.checkAcademicProcessing.lastName} {data.checkAcademicProcessing.firstName}
                </Typography>
                <Typography variant='h6'>Lớp: {data.checkAcademicProcessing.classId}</Typography>
                <Typography variant='h6'>Niên khóa: {data.checkAcademicProcessing.cohortName}</Typography>
                <Typography variant='h6'>Khoa: {data.checkAcademicProcessing.faculty}</Typography>
                <Typography variant='h6'>Năm học: {data.checkAcademicProcessing.year}</Typography>
                <Typography variant='h6'>Học kỳ: {data.checkAcademicProcessing.termName}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Thông tin xử lý học vụ</Typography>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant='h6'>
                  Trạng thái xử lý: {data.checkAcademicProcessing.handlingStatusByAAO}
                </Typography>
                <Typography variant='h6'>Lý do xử lý: {data.checkAcademicProcessing.reasonHandling}</Typography>
                <Typography variant='h6'>Ghi chú: {data.checkAcademicProcessing.note || 'Không có'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Quá trình học tập</Typography>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant='h6'>Điểm trung bình chung: {data.checkAcademicProcessing.DTBC}</Typography>
                <Typography variant='h6'>Số tín chỉ: {data.checkAcademicProcessing.STC}</Typography>
                <Typography variant='h6'>
                  Điểm trung bình chung tích lũy: {data.checkAcademicProcessing.DTBCTL}
                </Typography>
                <Typography variant='h6'>Số tín chỉ tích lũy: {data.checkAcademicProcessing.STCTL}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Đăng ký học phần</Typography>
              <Paper elevation={3} sx={{ padding: 2 }}>
                {data.checkAcademicProcessing.courseRegistration.map((course, index) => (
                  <Typography variant='h6' key={index}>
                    Học kỳ: {course.termName} - Đăng ký: {course.isRegister ? 'Có' : 'Không'}
                  </Typography>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Thông tin lớp học</Typography>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant='h6'>Mã lớp: {data.checkAcademicProcessing.classId}</Typography>
                <Typography variant='h6'>Giảng viên: {data.informationClass?.userName || 'Không có'}</Typography>
                <Typography variant='h6'>
                  Email giảng viên: {data.informationClass?.lectureId.mail || 'Không có'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Thông tin thiếu</Typography>
              <Paper elevation={3} sx={{ padding: 2 }}>
                {data.missingInfoRows.map((info, index) => (
                  <Typography variant='h6' key={index}>
                    {info.message}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Typography variant='h6'>Loading...</Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}
