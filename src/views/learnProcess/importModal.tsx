'use client'
import { useCallback, useState } from 'react'

import type { KeyedMutator } from 'swr'
import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import ImportAdd from '@/components/dialogs/importAdd'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import type { ImportResult } from '@/types/management/learnProcessType'

type ImportModalProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  file: v.pipe(
    v.array(v.file(), 'Cần phải có tệp mới có thể thực hiện'),
    v.minLength(1, 'Cần phải có tệp mới có thể thực hiện')
  )
})

type ImportForm = InferInput<typeof schema>

export default function ImportModal(props: ImportModalProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    openImportModal,
    toogleImportModal,
    acedemicProcess,
    setInserted,
    setDuplicateRows,
    setMissingInfoRows,
    toogleProgress,
    setIsCompleted,
    setIsProcessing,
    setAcedemicProcess
  } = useAcedemicProcessStore()

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

  const handleGetData = (data: ImportResult) => {
    if (data) {
      setInserted(data.data?.inserted)
      setDuplicateRows(data.data?.duplicateRows)
      setMissingInfoRows(data.data?.missingInfoRows)
    }
  }

  const onClose = useCallback(() => {
    reset()
    toogleImportModal()
    setValue('file', [])
    setFiles([])
    setAcedemicProcess(null)
  }, [reset, toogleImportModal, setValue, setFiles, setAcedemicProcess])

  const onSubmit = handleSubmit(async data => {
    if (!acedemicProcess) return
    const formData = new FormData()

    formData.append('file', data.file[0])
    formData.append('academicCategoryId', acedemicProcess._id)
    const toastID = toast.loading('Hệ thống đang xử lý...')

    onClose()
    toogleProgress()
    setIsProcessing(true)
    setIsCompleted(false)
    setLoading(true)

    await learnProcessService.import(
      formData,
      res => {
        handleGetData(res)
        setLoading(false)
        toast.update(toastID, {
          render: 'Import thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
          closeButton: true
        })
        mutate()
        setIsProcessing(false)
        setIsCompleted(true)
      },
      err => {
        setLoading(false)
        setIsProcessing(false)
        setIsCompleted(false)
        toogleProgress()
        toast.update(toastID, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          closeButton: true
        })
      }
    )
  })

  return (
    <ImportAdd
      files={files}
      setFiles={setFiles}
      onOpen={openImportModal}
      onClose={onClose}
      title='Import danh sách xử lý học tập'
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      errors={errors}
      loading={loading}
      pathToFile='/files/KCT_XLHT_HK241 - GUI CVHT.xlsx'
    />
  )
}
