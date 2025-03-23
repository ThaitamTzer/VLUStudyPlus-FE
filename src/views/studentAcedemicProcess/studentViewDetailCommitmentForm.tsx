'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  CircularProgress,
  Typography
} from '@mui/material'
import { PDFViewer, pdf } from '@react-pdf/renderer'

import type { KeyedMutator } from 'swr'
import useSWR, { mutate as fetchData } from 'swr'

import { toast } from 'react-toastify'

import type ReactSignatureCanvas from 'react-signature-canvas'

import Iconify from '@/components/iconify'

import { useStudentAcedemicProcessStore } from '@/stores/studentAcedemicProcess.store'
import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'
import { CommitmentFormPDF } from '../commitmentForms/commitmentPDF'
import type { CommitmentForm } from '@/types/management/comimentFormType'
import UpdateCommitmentForm from './updateCommitmentForm'
import AlertDelete from '@/components/alertModal'
import { CustomDialog } from '@/components/CustomDialog'
import SignatureSignModal from './signatureSignModal'

export default function StudentViewDetailCommitmentForm() {
  const {
    toogleStudentViewDetailCommitmentForm,
    processObj,
    setProcessObj,
    openStudentViewDetailCommitmentForm,
    toogleUpdateCommitmentForm,
    setCommitmentFormObj,
    openDeleteCommitmentForm,
    tooogleDeleteCommitmentForm,
    toogleSignSignatureForm
  } = useStudentAcedemicProcessStore()

  const [loading, setLoading] = useState(false)

  const id = processObj?._id || ''

  const { data, isLoading, mutate } = useSWR(id ? `/detail-commitment-forms-of-student/${id}` : null, () =>
    studentAcedemicProcessService.getCommitmentForm(id)
  )

  console.log('data', data)

  const handleClose = useCallback(() => {
    toogleStudentViewDetailCommitmentForm()
    setProcessObj({} as any)
  }, [toogleStudentViewDetailCommitmentForm, setProcessObj])

  const memoizedPDF = useMemo(() => <CommitmentFormPDF data={data || ({} as any)} />, [data])

  const handleExportPDF = async () => {
    const blob = await pdf(memoizedPDF).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = `Đơn cam kết học tập ${data?.name}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenUpdateCommitmentForm = useCallback(
    (data: CommitmentForm) => {
      setCommitmentFormObj(data)
      toogleUpdateCommitmentForm()
    },
    [setCommitmentFormObj, toogleUpdateCommitmentForm]
  )

  const handleDeleteCommitmentForm = useCallback(
    async (id: string) => {
      const toastId = toast.loading('Đang xóa đơn cam kết học tập...')

      setLoading(true)

      await studentAcedemicProcessService.deleteCommitmentForm(
        id,
        () => {
          setLoading(false)
          toast.update(toastId, {
            render: 'Xóa đơn cam kết học tập thành công!',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
          tooogleDeleteCommitmentForm()
          toogleStudentViewDetailCommitmentForm()
          mutate()
          fetchData('/api/academic-processing/view-list-academicProcessing-of-student')
        },
        err => {
          setLoading(false)
          toast.update(toastId, {
            render: err.message,
            type: 'error',
            isLoading: false,
            autoClose: 3000
          })
        }
      )
    },
    [tooogleDeleteCommitmentForm, toogleStudentViewDetailCommitmentForm, mutate]
  )

  return (
    <>
      <Dialog open={openStudentViewDetailCommitmentForm} onClose={handleClose} fullScreen>
        <DialogTitle>
          <IconButton
            sx={{
              position: 'absolute',
              right: '10px',
              top: '10px'
            }}
            onClick={handleClose}
          >
            <Iconify icon='eva:close-outline' />
          </IconButton>
          {data?.approved?.approveStatus === 'rejected' && (
            <>
              <Typography variant='h5' color='error'>
                Đơn đã bị từ chối
              </Typography>
              <Typography variant='h5' color='error'>
                <strong>Ghi chú: </strong> {data?.approved?.description}
              </Typography>
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <div className='flex justify-center items-center w-full h-full'>
              <CircularProgress color='success' />
            </div>
          ) : (
            <PDFViewer width='100%' height='100%'>
              {memoizedPDF}
            </PDFViewer>
          )}
        </DialogContent>
        <DialogActions>
          {!data?.insertSignatureStudent && (
            <Button variant='contained' color='success' onClick={toogleSignSignatureForm}>
              Ký đơn
            </Button>
          )}
          {data?.approved?.approveStatus !== 'approved' && (
            <>
              <Button variant='contained' color='error' onClick={tooogleDeleteCommitmentForm}>
                Xóa đơn
              </Button>
              <Button
                onClick={() => {
                  handleOpenUpdateCommitmentForm(data as CommitmentForm)
                }}
                variant='contained'
                color='warning'
              >
                Cập nhật đơn
              </Button>
            </>
          )}
          {data?.approved?.approveStatus === 'approved' && (
            <Button variant='contained' onClick={handleExportPDF}>
              Xuất file PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <UpdateCommitmentForm mutate={mutate} />
      <AlertDelete
        open={openDeleteCommitmentForm}
        onClose={tooogleDeleteCommitmentForm}
        title='Xóa đơn cam kết'
        content='Bạn có đồng ý xóa đơn cam kết này không ?'
        loading={loading}
        submitColor='error'
        submitText='Xóa'
        onSubmit={() => {
          handleDeleteCommitmentForm(data?._id || '')
        }}
      />
      <RenderSignatureModal data={data} mutate={mutate} />
    </>
  )
}

const RenderSignatureModal = ({ data, mutate }: { data: CommitmentForm | undefined; mutate: KeyedMutator<any> }) => {
  const sigCanvas = useRef<ReactSignatureCanvas>(null)
  const { openSignSignatureForm, toogleSignSignatureForm } = useStudentAcedemicProcessStore()
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    toogleSignSignatureForm()
    sigCanvas.current?.clear()
    setLoading(false)
  }, [toogleSignSignatureForm])

  const handleSave = async () => {
    if (!data) return toast.error('Chưa có dữ liệu')

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

    await studentAcedemicProcessService.addSignature(
      data._id,
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
      open={openSignSignatureForm}
      onClose={toogleSignSignatureForm}
      title='Ký tên'
      actions={
        <>
          <Button variant='outlined' color='secondary' onClick={toogleSignSignatureForm} disabled={loading}>
            Hủy
          </Button>
          <Button variant='contained' color='success' onClick={handleSave}>
            Ký tên
          </Button>
        </>
      }
    >
      <SignatureSignModal sigCanvas={sigCanvas} loading={false} />
    </CustomDialog>
  )
}
