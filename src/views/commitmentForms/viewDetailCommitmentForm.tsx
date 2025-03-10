'use client'

import { useCallback, useMemo } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  CircularProgress
} from '@mui/material'
import { PDFViewer, pdf } from '@react-pdf/renderer'

import useSWR from 'swr'

import Iconify from '@/components/iconify'

import { useCommitmentStore } from '@/stores/commitment.store'
import commitmentFormService from '@/services/commitmentForm.service'
import { CommitmentFormPDF } from './commitmentPDF'

export default function ViewDetailCommitmentForm() {
  const { toogleViewDetailCommitmentForm, commitmentForms, setCommitmentForms, openViewDetailCommitmentForm } =
    useCommitmentStore()

  const id = commitmentForms._id

  const { data, isLoading } = useSWR(id ? `/detail-commitment-forms/${id}` : null, () =>
    commitmentFormService.getDetail(id)
  )

  const handleClose = useCallback(() => {
    toogleViewDetailCommitmentForm()
    setCommitmentForms({} as any)
  }, [toogleViewDetailCommitmentForm, setCommitmentForms])

  const memoizedPDF = useMemo(() => <CommitmentFormPDF data={data || ({} as any)} />, [data])

  const handleExportPDF = async () => {
    const blob = await pdf(memoizedPDF).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = `Đơn cam kết học tập ${commitmentForms.name}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
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
        <Button variant='contained' onClick={handleExportPDF}>
          Export PDF
        </Button>
      </DialogActions>
    </Dialog>
  )
}
