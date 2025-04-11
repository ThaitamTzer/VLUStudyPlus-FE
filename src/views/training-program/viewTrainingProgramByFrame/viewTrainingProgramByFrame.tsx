'use client'

import { useMemo, useCallback } from 'react'

import useSWR from 'swr'

import { Button, Card } from '@mui/material'

import { CustomDialog } from '@/components/CustomDialog'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'
import FlatTrainingProgramTable from './TrainingProgramTable'
import AddCategory1Modal from './AddCategory1Modal'
import AddSubjectToFrameModal from './AddSubjectToFrameModal'

// import AddSubjectInCateModal from './AddSubjectInCateModal'

export default function ViewTrainingProgramByFrame() {
  const {
    openViewTrainingProgramByFrame,
    toogleViewTrainingProgramByFrame,
    trainingProgram,
    toogleCreateCategory1,
    openCreateCategory1,
    openAddSubjectInFrame,
    toogleOpenAddSubjectInFrame
  } = useTrainingProgramStore()

  // State cho modal thêm môn học vào danh mục
  // const [openAddSubjectInCate, setOpenAddSubjectInCate] = useState<boolean>(false)

  // const [selectedCategory, setSelectedCategory] = useState<{
  //   id: string
  //   level: 1 | 2 | 3
  //   idCate1?: string
  //   idCate2?: string
  //   idCate3?: string
  // } | null>(null)

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

  const handleOpenAddSubjectInFrame = useCallback(() => {
    toogleOpenAddSubjectInFrame()
  }, [toogleOpenAddSubjectInFrame])

  // Hàm mở modal thêm môn học vào danh mục
  // const handleOpenAddSubjectInCate = useCallback(
  //   (category: { id: string; level: 1 | 2 | 3; idCate1?: string; idCate2?: string; idCate3?: string }) => {
  //     setSelectedCategory(category)
  //     setOpenAddSubjectInCate(true)
  //   },
  //   []
  // )

  // Hàm đóng modal thêm môn học vào danh mục
  // const handleCloseAddSubjectInCate = useCallback(() => {
  //   setOpenAddSubjectInCate(false)
  //   setSelectedCategory(null)
  //   mutate()
  // }, [mutate])

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
              <Button variant='contained' className='max-sm:is-full' onClick={handleOpenAddSubjectInFrame}>
                <span className='text-sm font-semibold'>Thêm môn học</span>
              </Button>
              <Button variant='contained' className='max-sm:is-full' onClick={handleOpenCreateCate1}>
                <span className='text-sm font-semibold'>Thêm danh mục cấp 1</span>
              </Button>
            </div>
          </div>
          <FlatTrainingProgramTable
            data={data || []}
            isLoading={isLoading}
            mutate={mutate}
            onAddSubjectInCate={() => {}}
          />
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
      handleOpenAddSubjectInFrame
    ]
  )

  const renderAddCate1 = useMemo(
    () => (
      <AddCategory1Modal mutate={mutate} onClose={toogleCreateCategory1} open={openCreateCategory1} programId={id} />
    ),
    [mutate, toogleCreateCategory1, openCreateCategory1, id]
  )

  const renderAddSubjectInframe = useMemo(
    () => <AddSubjectToFrameModal open={openAddSubjectInFrame} onClose={toogleOpenAddSubjectInFrame} programId={id} />,
    [openAddSubjectInFrame, toogleOpenAddSubjectInFrame, id]
  )

  // const renderAddSubjectInCate = useMemo(() => {
  //   if (!selectedCategory) return null

  //   return (
  //     <AddSubjectInCateModal
  //       open={openAddSubjectInCate}
  //       onClose={handleCloseAddSubjectInCate}
  //       programId={id}
  //       categoryId1={selectedCategory.idCate1}
  //       categoryId2={selectedCategory.idCate2}
  //       categoryId3={selectedCategory.idCate3}
  //       categoryLevel={selectedCategory.level}
  //       onSuccess={mutate}
  //     />
  //   )
  // }, [openAddSubjectInCate, selectedCategory, id, handleCloseAddSubjectInCate, mutate])

  return (
    <>
      {renderDialog}
      {renderAddCate1}
      {renderAddSubjectInframe}
      {/* {renderAddSubjectInCate} */}
    </>
  )
}
