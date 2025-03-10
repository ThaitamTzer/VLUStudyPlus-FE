'use client'

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  CardHeader,
  Button
} from '@mui/material'

import useSWR from 'swr'

import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'

export default function StudentAcedemicProcessPage() {
  const { data: studentData } = useSWR(
    '/api/academic-processing/view-list-academicProcessing-of-student',
    studentAcedemicProcessService.getStudentAcedemicProcess
  )

  return (
    <Grid container spacing={3}>
      {studentData?.map(student => (
        <Grid item xs={12} sm={6} md={4} key={student._id}>
          <Card sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardHeader
              action={
                <Stack direction='row' spacing={1}>
                  <Button variant='contained' color='primary' size='small'>
                    ✏️ Tạo đơn
                  </Button>

                  <Button variant='outlined' color='warning' size='small'>
                    🛠 Chỉnh sửa
                  </Button>

                  <Button variant='outlined' color='error' size='small'>
                    🗑 Xóa
                  </Button>
                </Stack>
              }
            />

            <CardContent>
              <Stack spacing={1}>
                <Typography variant='h6' fontWeight='bold'>
                  📖 {student.academicCategory.title}
                </Typography>
                <Typography variant='body2' color='black'>
                  📅 Học kỳ: {student.termName}
                </Typography>
                <Typography variant='body2' color='black'>
                  🎓 Năm học: {student.year}
                </Typography>
                <Typography variant='body2' color='black'>
                  ⚠️ Diện XLHV (PĐT đề nghị): {student.handlingStatusByAAO}
                </Typography>
                <Typography variant='body2' color='black'>
                  {student.status ? '✅' : '❌'} Kết quả XLHV: {student.status ? 'CVHT đã xử lý' : 'CVHT chưa xử lý'}
                </Typography>
                <Typography variant='body2' color='black'>
                  📜 Đơn cam kết: {student.commitment ? 'Đã làm ✅' : 'Chưa làm ❌'}
                </Typography>

                <Accordion>
                  <AccordionSummary>
                    <Typography variant='subtitle2'>🔎 Xem chi tiết</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ color: 'black' }}>
                    <Stack spacing={1}>
                      <Typography variant='body2' sx={{ color: 'black !important' }}>
                        📝 Lý do xử lý: {student.reasonHandling}
                      </Typography>

                      {student.courseRegistration.map((course, index) => (
                        <Stack key={index} spacing={1}>
                          <Typography variant='subtitle2' sx={{ color: 'black !important' }}>
                            {course.isRegister ? '✅' : '❌'} ĐKMH {course.termName}:{' '}
                            {course.isRegister ? 'Đã đăng ký' : 'Chưa đăng ký'}
                            {course.note ? `; ghi chú: ${course.note}` : ''}
                          </Typography>
                        </Stack>
                      ))}
                      {student.processing.map((process, index) => (
                        <Stack key={index} spacing={1}>
                          <Typography variant='subtitle2' sx={{ color: 'black !important' }}>
                            ⏳ Học kỳ {process.termName}: {process.statusHandling}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
