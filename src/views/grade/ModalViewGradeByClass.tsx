'use client'

import { useCallback, useMemo, Suspense } from 'react'

import Image from 'next/image'

import useSWR from 'swr'

import { Button, CircularProgress, Skeleton, Box, Alert } from '@mui/material'

import { useGradeStore } from '@/stores/grade/grade.store'
import { CustomDialog } from '@/components/CustomDialog'
import gradeService from '@/services/grade.service'
import trainingProgramService from '@/services/trainingprogram.service'
import GradeTrainingProgramTable from './GradeTrainingProgramTable'

// Skeleton loading component cho table
const TableSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant='rectangular' width='100%' height={60} sx={{ mb: 2 }} />
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} variant='rectangular' width='100%' height={40} sx={{ mb: 1 }} />
    ))}
  </Box>
)

// Error fallback component
const ErrorFallback = ({ error, retry }: { error: any; retry: () => void }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Alert severity='error' sx={{ mb: 2 }}>
      <strong>Có lỗi xảy ra:</strong> {error?.message || 'Không thể tải dữ liệu'}
    </Alert>
    <Button variant='contained' onClick={retry}>
      Thử lại
    </Button>
  </Box>
)

export default function ModalViewGradeByClass() {
  const { openViewGrade, toogleViewGrade, setCohortId, cohortId, idClass, setIdClass, classLecturer } = useGradeStore()

  const fetchGrade = [`/api/grade/view-grade-GV/${idClass}`, idClass]
  const fetchTrainingProgram = [`/api/training-program/get-program-with-cohort/${cohortId}`, cohortId]

  const {
    data: trainingProgramData,
    isLoading: isLoadingTrainingProgram,
    error: trainingProgramError,
    mutate
  } = useSWR(
    cohortId ? fetchTrainingProgram : null,
    () => trainingProgramService.getTrainingProgramByCohortId(cohortId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 phút
      errorRetryCount: 3,
      errorRetryInterval: 2000
    }
  )

  const {
    data: gradeData,
    isLoading: isLoadingGrade,
    error: gradeError
  } = useSWR(idClass ? fetchGrade : null, () => gradeService.getGradeByClassCode(idClass), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 phút
    errorRetryCount: 3,
    errorRetryInterval: 2000
  })

  const handleClose = useCallback(() => {
    toogleViewGrade()
    setIdClass('')
    setCohortId('')
  }, [setIdClass, toogleViewGrade, setCohortId])

  const handleRetryTrainingProgram = useCallback(() => {
    mutate()
  }, [mutate])

  const renderContent = useMemo(() => {
    // Loading states
    if (isLoadingTrainingProgram) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, alignItems: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <p>Đang tải chương trình đào tạo...</p>
          <TableSkeleton />
        </Box>
      )
    }

    if (isLoadingGrade && !isLoadingTrainingProgram) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, alignItems: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <p>Đang tải dữ liệu kết quả học tập...</p>
          <TableSkeleton />
        </Box>
      )
    }

    // Error states
    if (trainingProgramError) {
      return <ErrorFallback error={trainingProgramError} retry={handleRetryTrainingProgram} />
    }

    if (gradeError) {
      return <ErrorFallback error={gradeError} retry={() => window.location.reload()} />
    }

    // No data state
    if (!trainingProgramData && !isLoadingGrade) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 3,
            alignItems: 'center',
            gap: 3
          }}
        >
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Không tìm thấy chương trình đào tạo cho lớp này</p>
          <Image
            src={'/images/dataNotfound.jpg'}
            alt='no-data'
            style={{ borderRadius: '10px', objectFit: 'cover' }}
            width={300}
            height={300}
          />
        </Box>
      )
    }

    // Success state
    if (trainingProgramData?.data && gradeData?.data) {
      return (
        <Suspense fallback={<TableSkeleton />}>
          <GradeTrainingProgramTable trainingProgramData={trainingProgramData.data} gradeData={gradeData.data} />
        </Suspense>
      )
    }

    return <TableSkeleton />
  }, [
    isLoadingTrainingProgram,
    isLoadingGrade,
    trainingProgramError,
    gradeError,
    trainingProgramData,
    gradeData,
    handleRetryTrainingProgram
  ])

  return (
    <CustomDialog
      open={openViewGrade}
      title={`Danh sách kết quả học tập lớp ${classLecturer?.classId}`}
      onClose={handleClose}
      fullScreen
      actions={
        <Button variant='contained' color='primary' onClick={handleClose}>
          Đóng
        </Button>
      }
    >
      {renderContent}
    </CustomDialog>
  )
}
