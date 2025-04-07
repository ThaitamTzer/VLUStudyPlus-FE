'use client'

import { useCallback, useState } from 'react'

import { Stepper, Step, StepLabel, Button, Typography, Box, Grid, List, ListItem, IconButton } from '@mui/material'

import type { KeyedMutator } from 'swr'

import type { InferInput } from 'valibot'

import * as v from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm } from 'react-hook-form'

import { LoadingButton } from '@mui/lab'

import { useDropzone } from 'react-dropzone'

import { toast } from 'react-toastify'

import { CustomDialog } from '@/components/CustomDialog'
import { useShare } from '@/hooks/useShare'
import Iconify from '@/components/iconify'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import trainingProgramService from '@/services/trainingprogram.service'
import CreateTrainingProgram from './createTrainingProgram'

// import trainingProgramService from '@/services/trainingprogram.service'

const schema = v.object({
  title: v.pipe(v.string(), v.nonEmpty('Tên không được để trống'), v.maxLength(100, 'Độ dài tối đa 100 ký tự')),
  majorId: v.undefinedable(v.pipe(v.string(), v.nonEmpty('Chuyên ngành không được để trống')), ''),
  credit: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ phải lớn hơn 0')),
  cohortId: v.undefinedable(v.pipe(v.string(), v.nonEmpty('Khóa không được để trống')), '')
})

const importschema = v.object({
  file: v.pipe(
    v.array(v.file(), 'Cần phải có tệp mới có thể thực hiện'),
    v.minLength(1, 'Cần phải có tệp mới có thể thực hiện')
  )
})

type FormData = InferInput<typeof schema>
type ImportForm = InferInput<typeof importschema>

type AddTrainingProgramStepByStepModalProps = {
  mutate: KeyedMutator<any>
}

export default function AddTrainingProgramStepByStepModal(props: AddTrainingProgramStepByStepModalProps) {
  const { mutate } = props

  const {
    openCreateTrainingProgram,
    toogleCreateTrainingProgram,
    toogleImportProgramLoading,
    setIsComplete,
    setIsProgress
  } = useTrainingProgramStore()

  const steps = ['Tạo khung chương trình đào tạo', 'Import chi tiết khung chương trình']

  const [dataCreateForm, setDataCreateForm] = useState<any | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const { cohorOptions, majorOptions } = useShare()
  const [files, setFiles] = useState<File[]>([])

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      title: '',
      credit: 0,
      cohortId: '',
      majorId: ''
    }
  })

  const handleNextStep = useCallback(async (data: any) => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setDataCreateForm(data)
  }, [])

  const onNextStep = handleSubmit(handleNextStep)

  const {
    handleSubmit: importHandleSubmit,
    reset: importReset,
    setValue,
    formState: { errors: importErrors }
  } = useForm<ImportForm>({
    mode: 'all',
    resolver: valibotResolver(importschema),
    defaultValues: {
      file: []
    }
  })

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

  const onClose = useCallback(() => {
    toogleCreateTrainingProgram()
    reset()
    importReset()
    setFiles([])
    setActiveStep(0)
    setDataCreateForm(null)
  }, [reset, importReset, toogleCreateTrainingProgram])

  const handleImport = useCallback(
    async (data: any) => {
      const toastID = toast.loading('Đang thêm khung chương trình đào tạo...')

      setIsProgress(true)
      setIsComplete(false)
      setLoading(true)
      const formData = new FormData()

      formData.append('file', data.file[0])

      await trainingProgramService.create(
        dataCreateForm,
        async res => {
          toast.success(
            'Thêm khung chương trình đào tạo thành công, Đang tiến hành import chi tiết khung chương trình đào tạo',
            {
              autoClose: 5000
            }
          )
          mutate()
          toogleImportProgramLoading()
          onClose()
          await trainingProgramService.import(
            res._id,
            formData,
            () => {
              setIsProgress(false)
              setIsComplete(true)
              mutate()
              setLoading(false)
            },
            err => {
              toast.update(toastID, {
                render: err.message,
                type: 'error',
                isLoading: false,
                autoClose: 5000
              })
              toast.error('Hãy thử cập nhật lại file sau đó import lại', {
                autoClose: 5000
              })
              toogleImportProgramLoading()
              onClose()
              setLoading(false)
            }
          )
        },
        err => {
          toast.update(toastID, {
            render: err.message,
            type: 'error',
            isLoading: false,
            autoClose: 2000
          })
          setActiveStep(0)
          setLoading(false)
        }
      )
    },
    [mutate, dataCreateForm, onClose, toogleImportProgramLoading, setIsProgress, setIsComplete, setLoading]
  )

  const onSubmit = importHandleSubmit(handleImport)

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

  const handleRemoveFile = (file: File) => {
    const filteredFiles = files.filter(f => f.name !== file.name)

    setFiles(filteredFiles)
  }

  return (
    <CustomDialog
      open={openCreateTrainingProgram}
      maxWidth='sm'
      fullWidth
      title='Thêm chương trình đào tạo'
      onClose={onClose}
      closeOutside
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 2 }}>
          <Typography>Hoàn thành tất cả các bước</Typography>
          <Button onClick={handleReset}>Đặt lại</Button>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && (
            <CreateTrainingProgram
              cohorOptions={cohorOptions}
              majorOptions={majorOptions}
              control={control}
              errors={errors}
            />
          )}
          {activeStep === 1 && (
            <>
              <div className='flex flex-col items-center gap-2'>
                <Typography variant='body2'>Tải file mẫu tại đây</Typography>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    window.open('/public/files/chuongtrinhdaotao.xlsx')
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
              {importErrors.file?.message && (
                <Typography color='error' variant='body2'>
                  {importErrors.file.message}
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
                </Box>
              )}
            </>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pt: 2 }}>
            <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Quay lại
            </Button>
            {activeStep === 0 && (
              <LoadingButton onClick={onNextStep} variant='contained' loading={loading}>
                Tiếp theo
              </LoadingButton>
            )}
            {activeStep === 1 && (
              <LoadingButton onClick={onSubmit} disabled={files.length === 0}>
                Hoàn thành
              </LoadingButton>
            )}
          </Box>
        </Box>
      )}
    </CustomDialog>
  )
}
