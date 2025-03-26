'use client'

import useSWR from 'swr'

import { Card } from '@mui/material'

import { CustomDialog } from '@/components/CustomDialog'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'
import FlatTrainingProgramTable from './TrainingProgramTable'

export default function ViewTrainingProgramByFrame() {
  const { openViewTrainingProgramByFrame, toogleViewTrainingProgramByFrame, setTrainingProgram, trainingProgram } =
    useTrainingProgramStore()

  const onClose = () => {
    toogleViewTrainingProgramByFrame()
    setTrainingProgram(null)
  }

  const id = trainingProgram?._id || ''

  const { data, isLoading } = useSWR(`/api/training-program/view-training-program/${id}`, () =>
    trainingProgramService.getTrainingProgramByFrame(id)
  )

  return (
    <CustomDialog
      open={openViewTrainingProgramByFrame}
      onClose={onClose}
      closeOutside
      title={`Chương trình đào tạo của ${trainingProgram?.title}`}
      fullScreen
    >
      <Card>
        <FlatTrainingProgramTable data={data || []} isLoading={isLoading} />
      </Card>
    </CustomDialog>
  )
}
