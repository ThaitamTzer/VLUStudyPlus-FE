'use client'
import { useState } from 'react'

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

  const {
    openImportModal,
    toogleImportModal,
    acedemicProcess,
    toogleImportResultModal,
    setInserted,
    setDuplicateRows,
    setMissingInfoRows
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

  const onSubmit = handleSubmit(async data => {
    if (!acedemicProcess) return
    const formData = new FormData()

    formData.append('file', data.file[0])
    formData.append('academicCategoryId', acedemicProcess._id)
    const toastID = toast.loading('Hệ thống đang xử lý...')

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
        toogleImportResultModal()
      },
      err => {
        setLoading(false)
        toast.update(toastID, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000,
          closeButton: true
        })
      }
    )
  })

  return (
    <ImportAdd
      onOpen={openImportModal}
      onClose={toogleImportModal}
      title='Import danh sách xử lý học tập'
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      errors={errors}
      loading={loading}
      pathToFile='acedemicProcess'
    />
  )
}
