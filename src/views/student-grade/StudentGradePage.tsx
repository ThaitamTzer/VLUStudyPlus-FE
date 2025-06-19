'use client'

import useSWR from 'swr'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import InfoIcon from '@mui/icons-material/Info'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

import trainingProgramService from '@/services/trainingprogram.service'

import gradeService from '@/services/grade.service'
import PageHeader from '@/components/page-header'
import ModalUpdateGrade from './UpdateGradeModal'
import ViewAdviseHistoryModal from './ViewAdviseHistoryModal'
import { useAuth } from '@/hooks/useAuth'
import StudentGradeTrainingTable from './StudentGradeTrainingTable'
import { useShare } from '@/hooks/useShare'

type StatCardProps = {
  icon: React.ElementType
  title: string
  value: number | string
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
}

export default function StudentGradePage() {
  const theme = useTheme()
  const { user } = useAuth()
  const { cohorOptions } = useShare()

  const cohortId = cohorOptions.find(cohort => cohort.cohortId === user?.cohortId)?._id

  const { data, isLoading, mutate } = useSWR('api/grade/view-grade-SV', gradeService.getGradeStudent, {
    errorRetryCount: 4,
    shouldRetryOnError: false
  })

  const { data: trainingProgramData } = useSWR(
    cohortId ? ['trainingProgramForStudent', cohortId] : null,
    () => trainingProgramService.getTrainingProgramByCohortId(cohortId || ''),
    {
      revalidateOnFocus: false
    }
  )

  if (isLoading) {
    return (
      <>
        <PageHeader title='Kết quả học tập' />
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </>
    )
  }

  // Xử lý lỗi - nếu sinh viên chưa nhập điểm thì hiển thị như trường hợp không có dữ liệu
  // if (error && error.message !== 'Sinh viên chưa nhập điểm') {
  //   return (
  //     <>
  //       <PageHeader title='Kết quả học tập' />
  //       <Box sx={{ p: 3 }}>
  //         <Alert severity='error' sx={{ mb: 2 }}>
  //           Không thể tải dữ liệu điểm. Vui lòng thử lại sau.
  //         </Alert>
  //         <Button variant='contained' onClick={() => mutate()} startIcon={<RefreshIcon />}>
  //           Thử lại
  //         </Button>
  //       </Box>
  //     </>
  //   )
  // }

  // Hiển thị EmptyState khi không có dữ liệu hoặc sinh viên chưa nhập điểm
  // if (!data?.termGrades || data.termGrades.length === 0 || (error && error.message === 'Sinh viên chưa nhập điểm')) {
  //   return (
  //     <>
  //       <PageHeader title='Kết quả học tập' />
  //       <EmptyState toogleImportGradeStudent={handleOpenImportGrade} />
  //       <ImportGradeModal mutate={mutate} />
  //     </>
  //   )
  // }

  const calculateGPA = () => {
    if (!data?.termGrades) return 0

    let totalCredits = 0
    let totalPoints = 0

    data.termGrades.forEach(term => {
      term.gradeOfSubject.forEach(subject => {
        if (subject.status === 'x') {
          totalCredits += subject.subjectId.credits
          let grade = subject.grade

          // Chuyển đổi điểm sang hệ số 4
          if (grade >= 8.5) grade = 4
          else if (grade >= 7) grade = 3
          else if (grade >= 5.5) grade = 2
          else if (grade >= 4) grade = 1
          else grade = 0

          totalPoints += grade * subject.subjectId.credits
        }
      })
    })

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0
  }

  const progressPercentage = ((data?.TCTL_SV || 0) / (data?.TCTL_CD || 1)) * 100

  const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        backgroundColor: `${theme.palette[color].main}`,
        border: `1px solid ${theme.palette[color].dark || theme.palette[color].main}`,
        borderRadius: 2,
        color: theme.palette.common.white,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette[color].dark || theme.palette[color].main}`
        }
      }}
    >
      <CardContent>
        <Box display='flex' alignItems='center' gap={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: theme.palette[color].dark || theme.palette[color].main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ fontSize: 32, color: theme.palette.common.white }} />
          </Box>
          <Box>
            <Typography variant='h4' fontWeight='bold' color={theme.palette.common.white}>
              {value}
            </Typography>
            <Typography variant='body2' color={theme.palette.common.white}>
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <>
      <PageHeader title='Kết quả học tập' />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Thông tin tổng quan */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={CreditScoreIcon}
                  title='Tín chỉ đã tích lũy'
                  value={data?.TCTL_SV || 0}
                  color='primary'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={SchoolIcon} title='Tín chỉ cần đạt' value={data?.TCTL_CD || 0} color='info' />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={PriorityHighIcon} title='Tín chỉ nợ' value={data?.TCN || 0} color='warning' />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={EmojiEventsIcon} title='GPA hiện tại' value={calculateGPA()} color='success' />
              </Grid>
            </Grid>

            <Card
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.dark || theme.palette.primary.main}`,
                borderRadius: 2,
                color: theme.palette.common.white
              }}
            >
              <Box display='flex' alignItems='center' gap={1} mb={2}>
                <Typography variant='h6' color={theme.palette.common.white}>
                  Tiến độ tích lũy
                </Typography>
                <Tooltip title='Tỷ lệ tín chỉ đã tích lũy so với tổng số tín chỉ cần đạt'>
                  <IconButton size='small'>
                    <InfoIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
              <LinearProgress
                variant='determinate'
                value={progressPercentage > 100 ? 100 : progressPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.primary.dark,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: theme.palette.common.white
                  }
                }}
              />
              <Box display='flex' justifyContent='space-between' mt={1}>
                <Typography variant='body2' color='white'>
                  Đã hoàn thành
                </Typography>
                <Typography variant='body2' color='white' fontWeight='bold'>
                  {progressPercentage > 100 ? '100%' : `${progressPercentage.toFixed(1)}%`}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <StudentGradeTrainingTable trainingProgramData={trainingProgramData?.data || []} gradeData={data || null} />
          </Grid>
        </Grid>
      </Box>
      <ModalUpdateGrade mutate={mutate} />
      <ViewAdviseHistoryModal />
    </>
  )
}
