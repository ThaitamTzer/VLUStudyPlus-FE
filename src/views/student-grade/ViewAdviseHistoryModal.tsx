'use client'

import { useCallback } from 'react'

import { Grid, Typography, Card, CardContent, Divider, Box, Chip, Button, Stack } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import MessageIcon from '@mui/icons-material/Message'
import SchoolIcon from '@mui/icons-material/School'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'

export default function ViewAdviseHistoryModal() {
  const { openViewAdviseHistory, toogleViewAdviseHistory, currentStudentGradeData } = useGradeStore()

  const handleClose = useCallback(() => {
    toogleViewAdviseHistory()
  }, [toogleViewAdviseHistory])

  // Lọc và sắp xếp các ghi chú theo thứ tự mới nhất trước
  const adviseHistory =
    currentStudentGradeData?.termGrades
      ?.filter(termGrade => termGrade.advise && termGrade.advise.trim() !== '')
      ?.sort((a, b) => new Date(b.term.academicYear).getTime() - new Date(a.term.academicYear).getTime()) || []

  return (
    <CustomDialog
      open={openViewAdviseHistory}
      onClose={handleClose}
      title='📚 Lịch sử ghi chú học tập'
      maxWidth='md'
      fullWidth
      actions={
        <Button variant='contained' onClick={handleClose}>
          Đóng
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Thông tin sinh viên */}
        <Grid item xs={12}>
          <Card variant='outlined' sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <SchoolIcon color='primary' />
                <Box>
                  <Typography variant='h6' color='primary'>
                    Thông tin sinh viên
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Tổng tín chỉ cần đạt: {currentStudentGradeData?.TCTL_CD} | Tín chỉ đã đạt:{' '}
                    {currentStudentGradeData?.TCTL_SV} | Tín chỉ nợ: {currentStudentGradeData?.TCN || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Hiển thị các ghi chú */}
        {adviseHistory.length > 0 ? (
          adviseHistory.map((termGrade, index) => (
            <Grid item xs={12} key={termGrade._id}>
              <Card
                variant='outlined'
                sx={{
                  border: index === 0 ? '2px solid' : '1px solid',
                  borderColor: index === 0 ? 'success.main' : 'grey.300',
                  boxShadow: index === 0 ? 2 : 1
                }}
              >
                <CardContent>
                  {/* Header ghi chú */}
                  <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <MessageIcon color={index === 0 ? 'success' : 'action'} />
                      <Typography variant='h6' color={index === 0 ? 'success.main' : 'text.primary'}>
                        {termGrade.term.termName}
                      </Typography>
                      {index === 0 && <Chip label='Mới nhất' color='success' size='small' variant='filled' />}
                    </Stack>
                    <Typography variant='body2' color='text.secondary'>
                      Năm học: {termGrade.term.academicYear}
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {/* Nội dung ghi chú */}
                  <Box
                    sx={{
                      bgcolor: index === 0 ? 'success.50' : 'grey.50',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: index === 0 ? 'success.200' : 'grey.200'
                    }}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                        color: 'text.primary'
                      }}
                    >
                      &quot;{termGrade.advise}&quot;
                    </Typography>
                  </Box>

                  {/* Thông tin học kỳ */}
                  {termGrade.gradeOfSubject.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        📊 Số môn học trong học kỳ: {termGrade.gradeOfSubject.length}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {termGrade.gradeOfSubject.slice(0, 3).map((grade, idx) => (
                          <Chip
                            key={idx}
                            label={`${grade.subjectId.courseName}: ${grade.grade}`}
                            size='small'
                            variant='outlined'
                            color={
                              grade.grade >= 8
                                ? 'success'
                                : grade.grade >= 6.5
                                  ? 'warning'
                                  : grade.grade < 5
                                    ? 'error'
                                    : 'default'
                            }
                          />
                        ))}
                        {termGrade.gradeOfSubject.length > 3 && (
                          <Chip
                            label={`+${termGrade.gradeOfSubject.length - 3} môn khác`}
                            size='small'
                            variant='outlined'
                            color='default'
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card variant='outlined' sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <HistoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  Chưa có ghi chú nào
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Chưa có giảng viên nào để lại ghi chú cho quá trình học tập của bạn.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Thống kê */}
        {adviseHistory.length > 0 && (
          <Grid item xs={12}>
            <Card variant='outlined' sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
              <CardContent>
                <Stack direction='row' spacing={4} justifyContent='center'>
                  <Box textAlign='center'>
                    <Typography variant='h4' color='info.main'>
                      {adviseHistory.length}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Tổng số ghi chú
                    </Typography>
                  </Box>
                  <Box textAlign='center'>
                    <Typography variant='h4' color='info.main'>
                      {currentStudentGradeData?.termGrades?.length || 0}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Tổng số học kỳ
                    </Typography>
                  </Box>
                  <Box textAlign='center'>
                    <Typography variant='h4' color='info.main'>
                      {Math.round((adviseHistory.length / (currentStudentGradeData?.termGrades?.length || 1)) * 100)}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Tỷ lệ có ghi chú
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </CustomDialog>
  )
}
