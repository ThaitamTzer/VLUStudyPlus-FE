'use client'

import type { RefObject } from 'react'

// import { useRef } from 'react'

import SignatureCanvas from 'react-signature-canvas'
import { Button, Typography } from '@mui/material'

// import { toast } from 'react-toastify'

// import type { KeyedMutator } from 'swr'

// import { LoadingButton } from '@mui/lab'

// import { CustomDialog } from '@/components/CustomDialog'
// import { useStudentAcedemicProcessStore } from '@/stores/studentAcedemicProcess.store'
// import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'

export default function SignatureSignModal({
  sigCanvas,
  loading
}: {
  sigCanvas: RefObject<SignatureCanvas>
  loading: boolean
}) {
  // const { openSignSignatureForm, toogleSignSignatureForm } = useStudentAcedemicProcessStore()

  // const [loading, setLoading] = useState(false)

  const handleClear = () => {
    sigCanvas.current?.clear()
  }

  // const handleClose = () => {
  //   toogleSignSignatureForm()
  //   sigCanvas.current?.clear()
  // }

  // const handleSave = async () => {
  //   if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
  //     return toast.error('Chữ ký không được để trống', { autoClose: 3000 })
  //   }

  //   // Chuyển dataURL thành file
  //   const dataUrl = sigCanvas.current.toDataURL('image/png')
  //   const blob = await (await fetch(dataUrl)).blob()
  //   const file = new File([blob], 'signature.png', { type: 'image/png' })

  //   const formData = new FormData()

  //   formData.append('insertSignature', file)

  //   const toastId = toast.loading('Đang xử lý...')

  //   setLoading(true)

  //   await studentAcedemicProcessService.addSignature(
  //     id,
  //     formData,
  //     () => {
  //       handleClose()
  //       mutate()
  //       setLoading(false)
  //       toast.update(toastId, { render: 'Ký tên thành công', type: 'success', autoClose: 3000, isLoading: false })
  //     },
  //     err => {
  //       setLoading(false)
  //       toast.update(toastId, { render: err.message, type: 'error', autoClose: 3000, isLoading: false })
  //     }
  //   )
  // }

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <Typography>Vui lòng ký tên vào ô bên dưới</Typography>
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant='outlined' color='error' sx={{ margin: '10px' }} onClick={handleClear} disabled={loading}>
          Xóa chữ ký
        </Button>
      </div>
    </div>

    // <CustomDialog
    //   title='Ký tên'
    //   open={openSignSignatureForm}
    //   onClose={handleClose}
    //   maxWidth='sm'
    //   actions={
    //     <>
    //       <Button disabled={loading} variant='outlined' color='secondary' onClick={handleClear}>
    //         Xóa chữ ký
    //       </Button>
    //       <Button disabled={loading} variant='outlined' color='secondary' onClick={handleClose}>
    //         Hủy
    //       </Button>
    //       <LoadingButton loading={loading} variant='contained' onClick={handleSave}>
    //         Lưu
    //       </LoadingButton>
    //     </>
    //   }
    // >

    // </CustomDialog>
  )
}
