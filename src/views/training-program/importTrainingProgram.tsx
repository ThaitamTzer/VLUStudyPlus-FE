'use client'

import { useCallback, useMemo, useState } from 'react'

import type { KeyedMutator } from 'swr'
import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography
} from '@mui/material'

import { useDropzone } from 'react-dropzone'

import { LoadingButton } from '@mui/lab'

import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'
import Iconify from '@/components/iconify'
import type { CompareBeforeImportType } from '@/types/management/compareBeforImportType'
import ProgressModal from '@/components/dialogs/progressModal'
import CompareDataBeforeImport from './CompareDataBeforeImport'

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
  const [dataCompare, setDataCompare] = useState<CompareBeforeImportType | null>(null)
  const [openProgressModal, setOpenProgressModal] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const {
    openImportTrainingProgramSession,
    toogleImportProgramLoading,
    toogleImportTrainingProgramSession,
    trainingProgram,
    setIsComplete,
    setIsProgress,
    toogleOpenCompareBeforeImport,
    openCompareBeforeImport
  } = useTrainingProgramStore()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      setValue('file', acceptedFiles)
    },
    multiple: false,
    accept: {
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    }
  })

  const renderFilePreview = (file: File) => {
    if (file.type === 'application/vnd.ms-excel' || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      return (
        <Box display='flex' alignItems='center'>
          <Iconify icon='mdi:file-excel' width={24} height={24} />
          <Typography variant='body2' ml={1}>
            {file.name}{' '}
          </Typography>
          <Typography className='file-size ml-1' variant='body2'>
            kích thước:
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </Box>
      )
    } else {
      return <Typography variant='body2'>{file.name}</Typography>
    }
  }

  const handleRemoveFile = useCallback(
    (file: File) => {
      const filteredFiles = files.filter(f => f.name !== file.name)

      setFiles(filteredFiles)
    },
    [files]
  )

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
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
    setIsComplete(false)
    setIsProgress(true)
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
        setIsComplete(true)
        setIsProgress(false)
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

  const openBeforeImport = useCallback(() => {
    toogleOpenCompareBeforeImport()
  }, [toogleOpenCompareBeforeImport])

  const handleCompare = useCallback(async () => {
    if (!trainingProgram) return toast.error('Chưa có khung chương trình nào được chọn')

    const formData = new FormData()

    formData.append('file', getValues('file')[0])

    toogleImportTrainingProgramSession()
    setOpenProgressModal(true)
    setIsProcessing(true)
    setIsCompleted(false)
    setIsError(false)

    await trainingProgramService.compareDataBeforeImport(
      trainingProgram?._id,
      formData,
      res => {
        setDataCompare(res)
        setIsProcessing(false)
        setIsCompleted(true)
      },
      err => {
        toast.error(err.message || 'Lỗi khi so sánh dữ liệu', {
          autoClose: 2000
        })
        setOpenProgressModal(false)
        setIsProcessing(false)
        setIsCompleted(true)
        setIsError(true)
        setDataCompare(null)
        setValue('file', [])
        setFiles([])
        reset()
      }
    )
  }, [trainingProgram, getValues, toogleImportTrainingProgramSession, setValue, setFiles, reset])

  const renderImport = useMemo(
    () => (
      <Dialog open={openImportTrainingProgramSession} onClose={onClose} fullWidth maxWidth='sm'>
        {/* đưa file mẫu cho người dùng */}
        <DialogTitle>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
            onClick={onClose}
          >
            <Iconify icon='mdi:close' />
          </IconButton>
          <Typography variant='h4'>{`Import chương trình đào tạo vào ${trainingProgram?.title}`}</Typography>
        </DialogTitle>
        <DialogContent>
          <div className='flex flex-col items-center gap-2'>
            <Typography variant='body2'>Tải file mẫu tại đây</Typography>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                window.open('/files/chuongtrinhdaotao.xlsx')
              }}
            >
              Tải file mẫu
            </Button>
            <Typography variant='body2'>Chỉ hỗ trợ tệp Excel (.xls, .xlsx)</Typography>
          </div>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <section
                style={{
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <div className='flex items-center flex-col gap-2 text-center'>
                    <Typography variant='h5'>Kéo và thả files của bạn vào đây.</Typography>
                    <Typography color='text.disabled'>hoặc</Typography>
                    <Button variant='tonal' size='small'>
                      Chọn file
                    </Button>
                  </div>
                </div>
              </section>
            </Grid>
          </Grid>
          {errors.file?.message && (
            <Typography color='error' variant='body2'>
              {errors.file.message}
            </Typography>
          )}
          {files.length > 0 && (
            <Box mt={2}>
              <List>
                {files.map(file => (
                  <ListItem key={file.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>{renderFilePreview(file)}</Box>
                    <IconButton onClick={() => handleRemoveFile(file)}>
                      <Iconify icon='tabler:x' />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
                <Button variant='outlined' color='error' onClick={onClose}>
                  Hủy
                </Button>
                <LoadingButton loading={loading} variant='contained' color='success' onClick={handleImport}>
                  Thêm
                </LoadingButton>

                {trainingProgram?.statusImport && (
                  <Button variant='outlined' color='info' onClick={handleCompare}>
                    So sánh CTĐT
                  </Button>
                )}
              </Box>
              {trainingProgram?.statusImport && (
                <Typography variant='body2' mt={2}>
                  Khung chương trình đã được import, bạn có thể so sánh dữ liệu với khung chương trình đã có sẵn
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    ),
    [
      openImportTrainingProgramSession,
      onClose,
      errors,
      loading,
      trainingProgram?.title,
      files,
      trainingProgram?.statusImport,
      handleCompare,
      getInputProps,
      getRootProps,
      handleRemoveFile,
      handleImport
    ]
  )

  const renderPrcessModal = useMemo(
    () => (
      <ProgressModal
        open={openProgressModal}
        isProcessing={isProcessing}
        isCompleted={isCompleted}
        onClose={() => {
          setTimeout(() => {
            setOpenProgressModal(false)
          }, 500)
        }}
        isError={isError}
        processingMessage='Đang so sánh dữ liệu...'
        openEnded={() => {
          openBeforeImport()
        }}
      />
    ),
    [openProgressModal, isProcessing, isCompleted, openBeforeImport, isError]
  )

  const renderCompareBeforeImport = useMemo(
    () => (
      <CompareDataBeforeImport
        open={openCompareBeforeImport}
        onClose={() => {
          toogleOpenCompareBeforeImport()
          setValue('file', [])
          setFiles([])
          reset()
        }}
        onImport={() => {
          toogleOpenCompareBeforeImport()
          handleImport()
        }}
        data={dataCompare || ({} as CompareBeforeImportType)}
      />
    ),
    [openCompareBeforeImport, toogleOpenCompareBeforeImport, dataCompare, handleImport, setValue, setFiles, reset]
  )

  return (
    <>
      {renderImport}
      {renderPrcessModal}
      {renderCompareBeforeImport}
    </>
  )
}
