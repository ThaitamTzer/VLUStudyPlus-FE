'use client'

import { useCallback, useMemo, useState } from 'react'

import type { KeyedMutator } from 'swr'
import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'

import ImportAdd from '@/components/dialogs/importAdd'

import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'

type ImportTrainingProgramProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  file: v.pipe(
    v.array(v.file(), 'Cần phải có tệp mới có thể thực hiện'),
    v.minLength(1, 'Cần phải có tệp mới có thể thực hiện')
  )
})

type ImportForm = InferInput<typeof schema>

export default function ImportTrainingProgram(props: ImportTrainingProgramProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    openImportTrainingProgramSession,
    toogleImportProgramLoading,
    toogleImportTrainingProgramSession,
    trainingProgram
  } = useTrainingProgramStore()

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ImportForm>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      file: []
    }
  })

  const onClose = useCallback(() => {
    toogleImportTrainingProgramSession()
    setValue('file', [])
    setFiles([])
    reset()
  }, [toogleImportTrainingProgramSession, setValue, reset])

  const onSubmit = handleSubmit(async data => {
    if (!trainingProgram) return toast.error('Chưa có khung chương trình nào được chọn')

    const toastId = toast.loading('Đang tải lên tệp...')

    onClose()
    setLoading(true)
    toogleImportProgramLoading()
    const formData = new FormData()

    formData.append('file', data.file[0])

    await trainingProgramService.import(
      trainingProgram._id,
      formData,
      () => {
        toast.update(toastId, {
          render: 'Tải lên tệp thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        toogleImportProgramLoading()
        setLoading(false)
        mutate()
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
        toogleImportProgramLoading()
        setLoading(false)
      }
    )
  })

  const handleImport = useCallback(onSubmit, [onSubmit])

  const renderImport = useMemo(
    () => (
      <ImportAdd
        onOpen={openImportTrainingProgramSession}
        onClose={onClose}
        title={`Import chương trình đào tạo vào ${trainingProgram?.title}`}
        onSubmit={handleImport}
        errors={errors}
        loading={loading}
        setValue={setValue}
        pathToFile='/files/chuongtrinhdaotao.xlsx'
        reset={reset}
        files={files}
        setFiles={setFiles}
      />
    ),
    [
      openImportTrainingProgramSession,
      onClose,
      handleImport,
      errors,
      loading,
      setValue,
      reset,
      trainingProgram?.title,
      setFiles,
      files
    ]
  )

  return <>{renderImport}</>
}
