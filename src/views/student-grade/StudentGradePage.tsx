'use client'

import { useCallback } from 'react'

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
  useTheme,
  Button,
  Alert
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import GradeIcon from '@mui/icons-material/Grade'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import InfoIcon from '@mui/icons-material/Info'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'

import trainingProgramService from '@/services/trainingprogram.service'

import gradeService from '@/services/grade.service'
import PageHeader from '@/components/page-header'
import ImportGradeModal from './ImportGradeModal'
import { useGradeStore } from '@/stores/grade/grade.store'
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

const EmptyState = ({ toogleImportGradeStudent }: { toogleImportGradeStudent: () => void }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <SchoolIcon sx={{ fontSize: 80, color: theme.palette.grey[400], mb: 2 }} />
      <Typography variant='h5' color='text.secondary' gutterBottom>
        Chưa có dữ liệu điểm
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 400, mb: 3 }}>
        Hiện tại chưa có dữ liệu điểm nào được nhập. Vui lòng nhập điểm để xem thông tin chi tiết.
      </Typography>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={toogleImportGradeStudent}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 3,
          py: 1
        }}
      >
        Nhập điểm
      </Button>
    </Box>
  )
}

export default function StudentGradePage() {
  const theme = useTheme()
  const { user } = useAuth()
  const { cohorOptions } = useShare()

  const cohortId = cohorOptions.find(cohort => cohort.cohortId === user?.cohortId)?._id

  const { data, isLoading, mutate, error } = useSWR('api/grade/view-grade-SV', gradeService.getGradeStudent, {
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

  console.log('trainingProgramData', trainingProgramData)

  const { toogleImportGradeStudent } = useGradeStore()

  const handleOpenImportGrade = useCallback(() => {
    toogleImportGradeStudent()
  }, [toogleImportGradeStudent])

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

  if (error) {
    return (
      <>
        <PageHeader title='Kết quả học tập' />
        <Box sx={{ p: 3 }}>
          <Alert severity='error' sx={{ mb: 2 }}>
            Không thể tải dữ liệu điểm. Vui lòng thử lại sau.
          </Alert>
          <Button variant='contained' onClick={() => mutate()} startIcon={<RefreshIcon />}>
            Thử lại
          </Button>
        </Box>
      </>
    )
  }

  if (!data?.termGrades || data.termGrades.length === 0) {
    return (
      <>
        <PageHeader title='Kết quả học tập' />
        <EmptyState toogleImportGradeStudent={handleOpenImportGrade} />
        <ImportGradeModal mutate={mutate} />
      </>
    )
  }

  const calculateGPA = () => {
    let totalCredits = 0
    let totalPoints = 0

    data?.termGrades.forEach(term => {
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
        background: `linear-gradient(135deg, ${theme.palette[color].main}08, ${theme.palette[color].main}15)`,
        border: `1px solid ${theme.palette[color].main}20`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette[color].main}15`
        }
      }}
    >
      <CardContent>
        <Box display='flex' alignItems='center' gap={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette[color].main}20, ${theme.palette[color].main}30)`
            }}
          >
            <Icon sx={{ fontSize: 32, color: theme.palette[color].main }} />
          </Box>
          <Box>
            <Typography variant='h4' fontWeight='bold' color={theme.palette[color].main}>
              {value}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
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
                <StatCard icon={GradeIcon} title='Tín chỉ nợ' value={data?.TCN || 0} color='warning' />
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
                background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                border: `1px solid ${theme.palette.primary.main}20`,
                borderRadius: 2
              }}
            >
              <Box display='flex' alignItems='center' gap={1} mb={2}>
                <Typography variant='h6' color='text.primary'>
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
                value={progressPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }
                }}
              />
              <Box display='flex' justifyContent='space-between' mt={1}>
                <Typography variant='body2' color='text.secondary'>
                  Đã hoàn thành
                </Typography>
                <Typography variant='body2' color='text.secondary' fontWeight='bold'>
                  {progressPercentage.toFixed(1)}%
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <StudentGradeTrainingTable trainingProgramData={trainingProgramData?.data || []} gradeData={data} />
          </Grid>
        </Grid>
      </Box>
      <ImportGradeModal mutate={mutate} />
      <ModalUpdateGrade mutate={mutate} />
      <ViewAdviseHistoryModal />
    </>
  )
}
