// 'use client'
// import { useCallback, useState } from 'react'

// import { Button, Grid, Typography } from '@mui/material'

// import { toast } from 'react-toastify'

// import { LoadingButton } from '@mui/lab'

// import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
// import { CustomDialog } from '@/components/CustomDialog'
// import mailService from '@/services/mail.service'
// import { useShare } from '@/hooks/useShare'

// export default function SendMailAgainModal({ id }: { id: string }) {
//   const { openSendEmailAgain, toogleSendEmailAgain } = useAcedemicProcessStore()
//   const [loading, setLoading] = useState(false)
//   const { classOptions } = useShare()

//   console.log('classOptions', classOptions)

//   const onSendMail = async () => {
//     // send mail

//     if (!id) return toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!')

//     setLoading(true)

//     const toastId = toast.loading('Đang gửi mail...')

//     await mailService.sendMail(
//       id,
//       () => {
//         toogleSendEmailAgain()
//         toast.update(toastId, {
//           render: 'Gửi mail thành công',
//           type: 'success',
//           isLoading: false,
//           autoClose: 2000
//         })
//       },
//       err => {
//         setLoading(false)
//         toast.update(toastId, {
//           render: err.message,
//           type: 'error',
//           isLoading: false,
//           autoClose: 2000
//         })
//       }
//     )
//   }

//   const onClose = useCallback(() => {
//     toogleSendEmailAgain()
//   }, [toogleSendEmailAgain])

//   return (
//     <CustomDialog
//       open={openSendEmailAgain}
//       onClose={onClose}
//       title='Xác nhận gửi mail'
//       actions={
//         <>
//           <Button variant='outlined' onClick={onClose}>
//             Hủy
//           </Button>
//           <LoadingButton loading={loading} variant='contained' onClick={onSendMail}>
//             Gửi mail
//           </LoadingButton>
//         </>
//       }
//     >
//       <Grid container spacing={3}>
//         <Grid item xs={12}></Grid>
//       </Grid>
//     </CustomDialog>
//   )
// }
