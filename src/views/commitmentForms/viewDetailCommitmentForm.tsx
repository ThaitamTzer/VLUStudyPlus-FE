'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Grid
} from '@mui/material'
import { PDFViewer, pdf } from '@react-pdf/renderer'

import useSWR from 'swr'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { Controller, useForm } from 'react-hook-form'

import Iconify from '@/components/iconify'

import { useCommitmentStore } from '@/stores/commitment.store'
import commitmentFormService from '@/services/commitmentForm.service'
import { CommitmentFormPDF } from './commitmentPDF'
import { CustomDialog } from '@/components/CustomDialog'
import CustomTextField from '@/@core/components/mui/TextField'

export default function ViewDetailCommitmentForm() {
  const {
    toogleViewDetailCommitmentForm,
    commitmentForms,
    setCommitmentForms,
    openViewDetailCommitmentForm,
    toogleOpenApproveCommitment,
    toogleOpenRejectCommitment,
    openApproveCommitment,
    openRejectCommitment
  } = useCommitmentStore()

  const [commitmentId, setCommitmentId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const id = commitmentForms._id

  const { data, isLoading, mutate } = useSWR(id ? `/detail-commitment-forms/${id}` : null, () =>
    commitmentFormService.getDetail(id)
  )

  const handleClose = useCallback(() => {
    toogleViewDetailCommitmentForm()
    setCommitmentForms({} as any)
  }, [toogleViewDetailCommitmentForm, setCommitmentForms])

  const memoizedPDF = useMemo(() => <CommitmentFormPDF data={data?.commitmentForm || ({} as any)} />, [data])

  const handleExportPDF = async () => {
    const blob = await pdf(memoizedPDF).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = `Đơn cam kết học tập ${commitmentForms.name}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenApprove = useCallback(
    (id: string) => {
      toogleOpenApproveCommitment()
      setCommitmentId(id)
    },
    [toogleOpenApproveCommitment, setCommitmentId]
  )

  const handleOpenReject = useCallback(
    (id: string) => {
      toogleOpenRejectCommitment()
      setCommitmentId(id)
    },
    [toogleOpenRejectCommitment, setCommitmentId]
  )

  const handleApproveCloseModal = useCallback(() => {
    toogleOpenApproveCommitment()
    setCommitmentId('')
  }, [setCommitmentId, toogleOpenApproveCommitment])

  const handleRecjectCloseModal = useCallback(() => {
    toogleOpenRejectCommitment()
    setCommitmentId('')
  }, [setCommitmentId, toogleOpenRejectCommitment])

  const handleApprove = async (id: string, status: string, description: string) => {
    const toastId = toast.loading('Đang cập nhật trạng thái')

    setLoading(true)

    await commitmentFormService.updateStatus(
      id,
      { approveStatus: status, description: description },
      () => {
        toast.update(toastId, {
          render: 'Cập nhật trạng thái thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
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
        setLoading(false)
      }
    )
  }

  const RenderModal = (
    open: boolean,
    onClose: () => void,
    status: 'approved' | 'pending' | 'rejected',
    color: 'info' | 'success' | 'warning' | 'error' | 'inherit' | 'primary' | 'secondary',
    submitText: string,
    title: string
  ) => {
    const { control, handleSubmit } = useForm<{ description: string }>({
      defaultValues: { description: '' }
    })

    const onSubmit = handleSubmit(({ description }) => {
      handleApprove(commitmentId, status, description)
    })

    return (
      <CustomDialog
        open={open}
        onClose={onClose}
        title={title}
        maxWidth='sm'
        actions={
          <>
            <Button variant='outlined' color='secondary' onClick={onClose}>
              Hủy
            </Button>
            <LoadingButton loading={loading} variant='contained' color={color} onClick={onSubmit}>
              {submitText}
            </LoadingButton>
          </>
        }
      >
        <form onSubmit={onSubmit}>
          <Grid container>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} id='description' label='Ghi chú' multiline rows={5} fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </CustomDialog>
    )
  }

  return (
    <>
      <Dialog open={openViewDetailCommitmentForm} onClose={handleClose} fullScreen>
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
          <Typography variant='h4'>Chi tiết đơn cam kết của {commitmentForms.name}</Typography>
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
          {data?.commitmentForm.approved.approveStatus === 'approved' && (
            <Button variant='contained' onClick={handleExportPDF}>
              Xuất file PDF
            </Button>
          )}
          {data?.commitmentForm.approved.approveStatus === 'pending' && (
            <>
              <Button variant='contained' color='error' onClick={() => handleOpenReject(data?.commitmentForm?._id)}>
                Từ chối
              </Button>
              <Button variant='contained' color='success' onClick={() => handleOpenApprove(data?.commitmentForm?._id)}>
                Duyệt
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {RenderModal(openApproveCommitment, handleApproveCloseModal, 'approved', 'success', 'Duyệt', 'Duyệt đơn cam kết')}
      {RenderModal(
        openRejectCommitment,
        handleRecjectCloseModal,
        'rejected',
        'error',
        'Từ chối',
        'Từ chối đơn cam kết'
      )}
    </>
  )
}
