'use client'

import { useMemo, useCallback } from 'react'

import useSWR from 'swr'

import { Button, Card } from '@mui/material'

import { CustomDialog } from '@/components/CustomDialog'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'
import FlatTrainingProgramTable from './TrainingProgramTable'

export default function ViewTrainingProgramByFrame() {
  const { openViewTrainingProgramByFrame, toogleViewTrainingProgramByFrame, trainingProgram } =
    useTrainingProgramStore()

  const onClose = useCallback(() => {
    toogleViewTrainingProgramByFrame()
  }, [toogleViewTrainingProgramByFrame])

  const id = trainingProgram?._id || ''

  const { data, isLoading, mutate } = useSWR(id ? `/api/training-program/view-training-program/${id}` : null, () =>
    trainingProgramService.getTrainingProgramByFrame(id)
  )

  const renderDialog = useMemo(
    () => (
      <CustomDialog
        open={openViewTrainingProgramByFrame}
        onClose={onClose}
        closeOutside
        title={`${trainingProgram?.title?.toLocaleUpperCase()}`}
        fullScreen
      >
        <Card>
          <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center sm:justify-end p-6 border-bs gap-4'>
            <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
              <Button variant='contained' className='max-sm:is-full'>
                <span className='text-sm font-semibold'>Thêm danh mục đào tạo</span>
              </Button>
            </div>
          </div>
          <FlatTrainingProgramTable data={data || []} isLoading={isLoading} mutate={mutate} />
        </Card>
      </CustomDialog>
    ),
    [openViewTrainingProgramByFrame, data, onClose, isLoading, trainingProgram?.title, mutate]
  )

  return <>{renderDialog}</>
}
