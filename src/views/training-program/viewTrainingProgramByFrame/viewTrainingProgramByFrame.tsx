'use client'

import { useMemo, useCallback } from 'react'

import useSWR from 'swr'

import { Button, Card } from '@mui/material'

import { CustomDialog } from '@/components/CustomDialog'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'
import FlatTrainingProgramTable from './TrainingProgramTable'
import AddCategory1Modal from './AddCategory1Modal'

export default function ViewTrainingProgramByFrame() {
  const {
    openViewTrainingProgramByFrame,
    toogleViewTrainingProgramByFrame,
    trainingProgram,
    toogleCreateCategory1,
    openCreateCategory1
  } = useTrainingProgramStore()

  const onClose = useCallback(() => {
    toogleViewTrainingProgramByFrame()
  }, [toogleViewTrainingProgramByFrame])

  const id = trainingProgram?._id || ''

  const { data, isLoading, mutate } = useSWR(id ? `/api/training-program/view-training-program/${id}` : null, () =>
    trainingProgramService.getTrainingProgramByFrame(id)
  )

  const handleOpenCreateCate1 = useCallback(() => {
    toogleCreateCategory1()
  }, [toogleCreateCategory1])

  const renderDialog = useMemo(
    () => (
      <CustomDialog
        open={openViewTrainingProgramByFrame}
        onClose={onClose}
        title={`${trainingProgram?.title?.toLocaleUpperCase()}`}
        fullScreen
      >
        <Card>
          <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center sm:justify-end p-6 border-bs gap-4'>
            <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
              <Button variant='contained' className='max-sm:is-full' onClick={handleOpenCreateCate1}>
                <span className='text-sm font-semibold'>Thêm danh mục cấp 1</span>
              </Button>
            </div>
          </div>
          <FlatTrainingProgramTable data={data || []} isLoading={isLoading} mutate={mutate} programId={id} />
        </Card>
      </CustomDialog>
    ),
    [
      openViewTrainingProgramByFrame,
      data,
      onClose,
      isLoading,
      trainingProgram?.title,
      mutate,
      handleOpenCreateCate1,
      id
    ]
  )

  const renderAddCate1 = useMemo(
    () => (
      <AddCategory1Modal mutate={mutate} onClose={toogleCreateCategory1} open={openCreateCategory1} programId={id} />
    ),
    [mutate, toogleCreateCategory1, openCreateCategory1, id]
  )

  return (
    <>
      {renderDialog}
      {renderAddCate1}
    </>
  )
}
