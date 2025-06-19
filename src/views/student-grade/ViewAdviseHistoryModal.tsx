'use client'

import { useCallback } from 'react'

import { Grid, Typography, Card, CardContent, Divider, Box, Chip, Button, Stack } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import MessageIcon from '@mui/icons-material/Message'
import SchoolIcon from '@mui/icons-material/School'
import useSWR from 'swr'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'
import gradeService from '@/services/grade.service'
import type { AdviseType } from '@/types/management/adviseType'

export default function ViewAdviseHistoryModal() {
  const { openViewAdviseHistory, toogleViewAdviseHistory, currentStudentGradeData } = useGradeStore()

  const handleClose = useCallback(() => {
    toogleViewAdviseHistory()
  }, [toogleViewAdviseHistory])

  // Lọc và sắp xếp các ghi chú theo thứ tự mới nhất trước

  const { data: adviseHistory } = useSWR(
    currentStudentGradeData?.studentId ? [`/api/grade/view-advise/${currentStudentGradeData?.studentId}`] : null,
    () => gradeService.getAdviseByStudentId(currentStudentGradeData?.studentId || ''),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  )

  return (
    <CustomDialog
      open={openViewAdviseHistory}
      onClose={handleClose}
      title='📚 Lịch sử tư vấn học tập'
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
        {adviseHistory && adviseHistory.length > 0 ? (
          adviseHistory.map((adviseRecord: AdviseType, index) => (
            <Grid item xs={12} key={adviseRecord._id}>
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
                        Học kỳ {adviseRecord.termId.abbreviatName}
                      </Typography>
                      {index === 0 && <Chip label='Mới nhất' color='success' size='small' variant='filled' />}
                    </Stack>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(adviseRecord.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {/* Hiển thị tất cả tư vấn trong học kỳ */}
                  {adviseRecord.allAdvise.map((advise, adviseIndex) => (
                    <Box
                      key={advise._id}
                      sx={{
                        mb: adviseIndex < adviseRecord.allAdvise.length - 1 ? 2 : 0,
                        bgcolor: index === 0 && adviseIndex === 0 ? 'success.50' : 'grey.50',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: index === 0 && adviseIndex === 0 ? 'success.200' : 'grey.200'
                      }}
                    >
                      <Typography
                        variant='body1'
                        sx={{
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        {advise.advise}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Ngày tư vấn: {new Date(advise.createdAdviseAt).toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                  ))}

                  {/* Thống kê số lượng tư vấn */}
                  {adviseRecord.allAdvise.length > 1 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        📝 Tổng số tư vấn trong kỳ: {adviseRecord.allAdvise.length}
                      </Typography>
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
                  Chưa có tư vấn nào
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Chưa có giảng viên nào để lại tư vấn cho quá trình học tập của bạn.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </CustomDialog>
  )
}
