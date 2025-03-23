'use client'
import { useCallback, useRef, useState } from 'react'

import { Stepper, Step, StepLabel, Button, Typography, Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import type { KeyedMutator } from 'swr'

import type { InferInput } from 'valibot'

import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import type ReactSignatureCanvas from 'react-signature-canvas'

import AddCommitmentForm from './addCommitmentForm'
import { schema } from './schema/validate'
import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'
import { useStudentAcedemicProcessStore } from '@/stores/studentAcedemicProcess.store'
import SignatureSignModal from './signatureSignModal'
import { CustomDialog } from '@/components/CustomDialog'

type FormData = InferInput<typeof schema>

export default function AddCommitmentFormProcess({ mutate }: { mutate: KeyedMutator<any> }) {
  const sigCanvas = useRef<ReactSignatureCanvas>(null)

  const { idProcess, setIdProcess, toogleAddCommitmentForm, openAddCommitmentForm } = useStudentAcedemicProcessStore()
  const [dataStep, setDataStep] = useState<any>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const steps = ['Tạo đơn', 'Ký đơn']

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
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      title: 'ĐƠN CAM KẾT CẢI THIỆN TÌNH HÌNH HỌC TẬP',
      phoneNumber: '',
      phoneNumberParent: '',
      averageScore: 0,
      credit: 0,
      numberOfViolations: 0,
      reason: '',
      aspiration: '',
      commitment: false,
      debt: [
        {
          term: '',
          subjects: ['']
        }
      ],
      processing: [
        {
          term: '',
          typeProcessing: ''
        }
      ]
    }
  })

  const handleNextStep = useCallback(async (data: FormData) => {
    const newData = {
      ...data,
      debt: data.debt.map(item => ({
        term: item.term,
        subject: item.subjects.filter(subject => subject.trim() !== '').join(', ')
      }))
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setDataStep(newData)
  }, [])

  const onNextStep = handleSubmit(handleNextStep)

  const onClose = useCallback(() => {
    sigCanvas.current?.clear()
    setActiveStep(0)
    reset()
    setIdProcess('')
    toogleAddCommitmentForm()
  }, [reset, setIdProcess, toogleAddCommitmentForm])

  const onSubmit = async () => {
    if (!idProcess) {
      return toast.error('Vui lòng chọn đơn cam kết', { autoClose: 3000 })
    }

    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      return toast.error('Chữ ký không được để trống', { autoClose: 3000 })
    }

    setLoading(true)

    const dataUrl = sigCanvas.current.toDataURL('image/png')
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'signature.png', { type: 'image/png' })
    const formData = new FormData()

    formData.append('insertSignature', file)

    const toastId = toast.loading('Đang tạo đơn cam kết...')

    await studentAcedemicProcessService.addCommitmentForm(
      idProcess,
      dataStep,
      async res => {
        toast.update(toastId, {
          render: 'Tạo đơn cam kết thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        mutate()
        toast.update(toastId, {
          render: 'Đang ký đơn cam kết...',
          type: 'info',
          isLoading: true
        })
        await studentAcedemicProcessService.addSignature(
          res._id,
          formData,
          () => {
            toast.update(toastId, {
              render: 'Ký đơn cam kết thành công!',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            setLoading(false)
            onClose()
          },
          err => {
            setActiveStep(1)
            toast.update(toastId, {
              render: err.message,
              type: 'error',
              isLoading: false,
              autoClose: 2000
            })
            setLoading(false)
          }
        )
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
        setActiveStep(0)
      }
    )
  }

  return (
    <CustomDialog open={openAddCommitmentForm} maxWidth='md' title='📄 Tạo đơn cam kết' onClose={onClose}>
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
            <AddCommitmentForm control={control} errors={errors} getValues={getValues} onSubmit={onNextStep} />
          )}
          {activeStep === 1 && <SignatureSignModal sigCanvas={sigCanvas} loading={false} />}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Quay lại
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === 0 && (
              <LoadingButton onClick={onNextStep} variant='contained' loading={loading}>
                Tiếp theo
              </LoadingButton>
            )}
            {activeStep === 1 && (
              <LoadingButton onClick={onSubmit} variant='contained' loading={loading}>
                Hoàn thành
              </LoadingButton>
            )}
          </Box>
        </Box>
      )}
    </CustomDialog>
  )
}
