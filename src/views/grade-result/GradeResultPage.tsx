// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'

// import { Card, MenuItem, Table, TableCell, TableContainer, TableHead } from '@mui/material'

// import useSWR from 'swr'

// import PageHeader from '@/components/page-header'
// import trainingProgramService from '@/services/trainingprogram.service'
// import gradeService from '@/services/grade.service'
// import classLecturerService from '@/services/classLecturer.service'
// import CustomTextField from '@/@core/components/mui/TextField'
// import DebouncedInput from '@/components/debouncedInput'
// import StyledTableRow from '@/components/table/StyledTableRow'

// export default function GradeResultPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const limit = searchParams.get('limit') || '10'
//   const page = searchParams.get('page') || '1'
//   const sortField = searchParams.get('sortField') || 'createdAt'
//   const sortOrder = searchParams.get('sortOrder') || 'desc'
//   const searchKey = searchParams.get('searchKey') || ''
//   const classCode = searchParams.get('classCode') || ''

//   const {} = useSWR('trainingProgramSession')

//   return (
//     <>
//       <PageHeader title='Kết quả học tập' />
//       <Card>
//         <TableContainer
//           sx={{
//             position: 'relative',
//             overflowX: 'auto',
//             maxHeight: 'calc(100vh - 300px)'
//           }}
//         >
//           <Table
//             stickyHeader
//             sx={{
//               minWidth: 1100
//             }}
//           >
//             <TableHead>
//               <StyledTableRow
//                 sx={{
//                   textTransform: 'uppercase'
//                 }}
//               >
//                 <TableCell>STT</TableCell>
//               </StyledTableRow>
//             </TableHead>
//           </Table>
//         </TableContainer>
//       </Card>
//     </>
//   )
// }
