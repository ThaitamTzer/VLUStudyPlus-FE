'use client'

import { useState, useRef } from 'react'

import { Box, Button, TextField, Typography, Stack, Stepper, Step, StepLabel } from '@mui/material'

import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

import SignatureCanvas from 'react-signature-canvas'

import type { KeyedMutator } from 'swr'

import formInstanceService from '@/services/formInstance.service'

import { CustomDialog } from '@/components/CustomDialog'

import type { FormInstanceType } from '@/types/management/formInstanceType'

interface ApproveFormValues {
  description: string
}

type ApproveFormModalProps = {
  open: boolean
  onClose: () => void
  formInstance: FormInstanceType | null
  mutate: KeyedMutator<any>
  isCVHT?: boolean
  isBCNK?: boolean
  mutateBCNK?: KeyedMutator<any>
}

export default function ApproveFormModal(props: ApproveFormModalProps) {
  const { open, onClose, formInstance, mutate, isCVHT, isBCNK, mutateBCNK } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const sigCanvas = useRef<SignatureCanvas>(null)

  const steps = ['Điền nội dung', 'Ký tên']

  // Schema validation
  const schema = v.object({
    description: v.pipe(v.string(), v.nonEmpty('Vui lòng nhập nội dung duyệt đơn'))
  })

  // Khởi tạo form với react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ApproveFormValues>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      description: 'Nội dung đơn phù hợp'
    }
  })

  const handleNext = () => {
    setActiveStep(1)
  }

  const handleBack = () => {
    setActiveStep(0)
  }

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
    }
  }

  const onSubmit = async (data: ApproveFormValues) => {
    if (!formInstance) return

    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      return toast.error('Chữ ký không được để trống', { autoClose: 3000 })
    }

    setIsSubmitting(true)

    const toastID = toast.loading('Đang xử lý...')

    try {
      const dataUrl = sigCanvas.current?.toDataURL('image/png')

      if (dataUrl) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'signature.png', { type: 'image/png' })
        const formData = new FormData()

        if (isCVHT) {
          formData.append('insertSignature', file)
          formData.append('keyInsert', 'cvhtSignature')
        } else if (isBCNK) {
          formData.append('insertSignature', file)
          formData.append('keyInsert', 'facultyBoardSignature')
        }

        await formInstanceService.inSertSignature(
          formInstance._id,
          formData,
          async () => {
            // Sau khi thêm chữ ký, cập nhật trạng thái duyệt
            await formInstanceService.approveForm(
              formInstance._id,
              {
                approveStatus: 'approved',
                description: data.description
              },
              () => {
                toast.update(toastID, {
                  render: 'Đã duyệt đơn thành công',
                  type: 'success',
                  isLoading: false,
                  autoClose: 3000
                })
                setIsSubmitting(false)
                onClose()
                mutate()

                if (isBCNK) {
                  mutateBCNK?.()
                }
              },
              error => {
                toast.update(toastID, {
                  render: error.message || 'Không thể duyệt đơn',
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000
                })
                setIsSubmitting(false)
              }
            )
          },
          error => {
            toast.update(toastID, {
              render: error.message || 'Không thể thêm chữ ký',
              type: 'error',
              isLoading: false,
              autoClose: 3000
            })
            setIsSubmitting(false)
          }
        )
      }
    } catch (error) {
      toast.update(toastID, {
        render: 'Có lỗi xảy ra',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
      setIsSubmitting(false)
    }
  }

  const renderContentStep = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label='Nội dung duyệt đơn'
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
      </Box>
    )
  }

  const renderSignatureStep = () => {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='h6' gutterBottom>
          Ký tên
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Vui lòng ký tên vào ô bên dưới
        </Typography>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SignatureCanvas
            ref={sigCanvas}
            penColor='black'
            minWidth={2}
            canvasProps={{
              width: 300,
              height: 150,
              className: 'sigCanvas border border-black border-dashed'
            }}
          />
        </Box>
        <Button variant='outlined' color='error' sx={{ mb: 2 }} onClick={handleClear} disabled={isSubmitting}>
          Xóa chữ ký
        </Button>
      </Box>
    )
  }

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title='Duyệt đơn'
      closeOutside
      maxWidth='md'
      fullWidth
      actions={
        <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
          {activeStep > 0 && (
            <Button variant='outlined' onClick={handleBack} disabled={isSubmitting}>
              Quay lại
            </Button>
          )}
          <Button variant='outlined' onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          {activeStep === 0 ? (
            <Button variant='contained' onClick={handleNext} disabled={isSubmitting}>
              Tiếp theo
            </Button>
          ) : (
            <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Duyệt đơn'}
            </Button>
          )}
        </Stack>
      }
    >
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? renderContentStep() : renderSignatureStep()}
    </CustomDialog>
  )
}
