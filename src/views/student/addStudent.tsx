// 'use client'
// import { useState } from 'react'

// import type { KeyedMutator } from 'swr'

// type AddStudentProps = {
//   mutate: KeyedMutator<any>
// }

// import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Tab } from '@mui/material'

// import { TabContext, TabList, TabPanel } from '@mui/lab'

// import { vi } from 'date-fns/locale'
// import { registerLocale } from 'react-datepicker'

// registerLocale('vi', vi)

// import Iconify from '@/components/iconify'

// import { useStudentStore } from '@/stores/student/student'

// import ManualAdd from './manualAdd'
// import AutoAdd from './autoAdd'

// export default function AddStudent({ mutate }: AddStudentProps) {
//   const { openAddStudent, toogleAddStudent } = useStudentStore()
//   const [tab, setTab] = useState<string>('1')

//   const onChangeTab = (event: React.SyntheticEvent, newValue: string) => {
//     setTab(newValue)
//   }

//   const handleClose = () => {
//     toogleAddStudent()
//     setTab('1')
//   }

//   return (
//     <Dialog open={openAddStudent} onClose={handleClose} maxWidth='sm' fullWidth>
//       <DialogTitle>
//         <Typography variant='h4'>Thêm sinh viên</Typography>
//         <IconButton
//           onClick={handleClose}
//           sx={{
//             position: 'absolute',
//             top: 8,
//             right: 8
//           }}
//         >
//           <Iconify icon='material-symbols:close-rounded' />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent
//         sx={{
//           pb: 2
//         }}
//       >
//         <TabContext value={tab}>
//           <TabList onChange={onChangeTab}>
//             <Tab value='1' label='Thủ công' />
//             <Tab value='2' label='Import' />
//           </TabList>
//           <TabPanel value='1'>
//             <ManualAdd mutate={mutate} />
//           </TabPanel>
//           <TabPanel value='2'>
//             <AutoAdd mutate={mutate} />
//           </TabPanel>
//         </TabContext>
//       </DialogContent>
//     </Dialog>
//   )
// }
