'use client'

import { useRef, useState } from 'react'

import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

import type { KeyedMutator } from 'swr'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'
import commitmentFormService from '@/services/commitmentForm.service'
import { useCommitmentStore } from '@/stores/commitment.store'

export default function SignatureSignModalLecturer({ id, mutate }: { id: string; mutate: KeyedMutator<any> }) {
  const { openSignSignatureForm, toogleOpenSignSignatureForm } = useCommitmentStore()
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [loading, setLoading] = useState(false)

  const handleClear = () => {
    sigCanvas.current?.clear()
  }

  const handleClose = () => {
    toogleOpenSignSignatureForm()
    sigCanvas.current?.clear()
  }

  const handleSave = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      return toast.error('Chữ ký không được để trống', { autoClose: 3000 })
    }

    // Chuyển dataURL thành file
    const dataUrl = sigCanvas.current.toDataURL('image/png')
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'signature.png', { type: 'image/png' })

    const formData = new FormData()

    formData.append('insertSignature', file)

    const toastId = toast.loading('Đang xử lý...')

    setLoading(true)

    await commitmentFormService.addSignature(
      id,
      formData,
      () => {
        handleClose()
        mutate()
        setLoading(false)
        toast.update(toastId, { render: 'Ký tên thành công', type: 'success', autoClose: 3000, isLoading: false })
      },
      err => {
        setLoading(false)
        toast.update(toastId, { render: err.message, type: 'error', autoClose: 3000, isLoading: false })
      }
    )
  }

  return (
    <CustomDialog
      title='Ký tên'
      open={openSignSignatureForm}
      onClose={handleClose}
      maxWidth='sm'
      actions={
        <>
          <Button disabled={loading} variant='outlined' color='error' onClick={handleClear}>
            Xóa chữ ký
          </Button>
          <Button disabled={loading} variant='outlined' color='secondary' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} variant='contained' onClick={handleSave}>
            Lưu
          </LoadingButton>
        </>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      </div>
    </CustomDialog>
  )
}
