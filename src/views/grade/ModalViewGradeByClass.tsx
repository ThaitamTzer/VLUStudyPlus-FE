'use client'

import { useCallback, useState } from 'react'

import Image from 'next/image'

import useSWR from 'swr'

import { Button, CircularProgress } from '@mui/material'

import { useGradeStore } from '@/stores/grade/grade.store'
import { CustomDialog } from '@/components/CustomDialog'
import gradeService from '@/services/grade.service'
import trainingProgramService from '@/services/trainingprogram.service'
import GradeTrainingProgramTable from './GradeTrainingProgramTable'
import LoadingSkeleton from './Loading'

// import GradeStatistics from './GradeStatistics'

export default function ModalViewGradeByClass() {
  const { openViewGrade, toogleViewGrade, setCohortId, cohortId, idClass, setIdClass, classLecturer } = useGradeStore()
  const [showGrade, setShowGrade] = useState<boolean>(false)

  const fetchGrade = [`/api/grade/view-grade-GV/${idClass}`, idClass]

  const fetchTrainingProgram = [`/api/training-program/get-program-with-cohort/${cohortId}`, cohortId]

  const {
    data: trainingProgramData,
    isLoading: isLoadingTrainingProgram,
    mutate
  } = useSWR(
    cohortId ? fetchTrainingProgram : null,
    () => trainingProgramService.getTrainingProgramByCohortId(cohortId),
    {
      revalidateOnFocus: false,
      onSuccess: () => {
        setShowGrade(true)
      }
    }
  )

  const { data: gradeData, isLoading: isLoadingGrade } = useSWR(
    showGrade && idClass ? fetchGrade : null,
    () => gradeService.getGradeByClassCode(idClass),
    {
      revalidateOnFocus: false
    }
  )

  const handleClose = useCallback(() => {
    toogleViewGrade()
    setIdClass('')
    setCohortId('')
    setShowGrade(false)
  }, [setIdClass, toogleViewGrade, setCohortId, setShowGrade])

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
      {isLoadingTrainingProgram && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
            alignItems: 'center'
          }}
        >
          <CircularProgress sx={{ mb: 3 }} />
          <p>Đang lấy dữ liệu từ Chương trình đào tạo...</p>
        </div>
      )}
      {!isLoadingTrainingProgram && !trainingProgramData && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Không tìm thấy Chương trình đào tạo cho lớp này</p>

          <Image
            src={'/images/dataNotfound.jpg'}
            alt='no-data'
            style={{ borderRadius: '10px', objectFit: 'cover' }}
            width={300}
            height={300}
          />
        </div>
      )}

      {isLoadingGrade && <LoadingSkeleton />}

      {trainingProgramData && gradeData && (
        <>
          {/* <GradeStatistics gradeData={gradeData?.data || []} /> */}
          <GradeTrainingProgramTable
            trainingProgramData={trainingProgramData?.data || []}
            gradeData={gradeData?.data || []}
            mutate={mutate}
          />
        </>
      )}
    </CustomDialog>
  )
}
