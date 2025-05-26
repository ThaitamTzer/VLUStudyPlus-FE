import { Fragment } from 'react'

import { TableBody, Stack, Table, TableHead, Skeleton, TableContainer, TableCell, TableRow, Box } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'

import { useSettings } from '@/@core/hooks/useSettings'

const LoadingSkeleton = () => {
  const { settings } = useSettings()

  const skeletonStudentCount = 3 // Số lượng cột sinh viên giả lập

  return (
    <TableContainer sx={{ maxHeight: 'calc(100vh - 180px)' }}>
      <Table stickyHeader aria-label='training program table' size='small' sx={{ minWidth: 1200 }}>
        <TableHead>
          <StyledTableRow>
            <TableCell
              sx={{
                minWidth: 500,
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase'
              }}
            >
              <Skeleton variant='text' width='60%' sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </TableCell>
            <TableCell
              width={80}
              sx={{
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase'
              }}
            >
              <Skeleton variant='text' width='100%' sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </TableCell>
            <TableCell
              width={100}
              sx={{
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase'
              }}
            >
              <Skeleton variant='text' width='100%' sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </TableCell>
            <TableCell
              width={150}
              sx={{
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase'
              }}
            >
              <Skeleton variant='text' width='100%' sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </TableCell>
            {Array.from({ length: skeletonStudentCount }).map((_, index) => (
              <TableCell
                key={`skeleton-header-${index}`}
                sx={{
                  minWidth: 120,
                  backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                  textTransform: 'uppercase'
                }}
                align='center'
              >
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Box>
                    <Skeleton variant='text' width={80} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Skeleton variant='text' width={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  </Box>
                </Stack>
              </TableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {/* Skeleton cho Program Row */}
          <TableRow
            sx={{
              backgroundColor: settings.mode === 'dark' ? '#4D55CC' : '#578FCA'
            }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                <Skeleton variant='text' width='70%' height={28} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>
            </TableCell>
            <TableCell colSpan={4 + skeletonStudentCount}></TableCell>
          </TableRow>

          {/* Skeleton cho Category Rows */}
          {Array.from({ length: 2 }).map((_, categoryIndex) => (
            <Fragment key={`skeleton-category-${categoryIndex}`}>
              <TableRow
                sx={{
                  backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                    <Skeleton variant='text' width='60%' height={24} />
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant='text' width={30} height={20} />
                </TableCell>
                <TableCell colSpan={2 + skeletonStudentCount}></TableCell>
              </TableRow>

              {/* Skeleton cho Subject Rows */}
              {Array.from({ length: 3 }).map((_, subjectIndex) => (
                <TableRow key={`skeleton-subject-${categoryIndex}-${subjectIndex}`} hover>
                  <TableCell>
                    <Box sx={{ pl: 5 }}>
                      <Skeleton variant='text' width='80%' height={20} />
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Skeleton variant='text' width={20} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width='60%' height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width='40%' height={20} />
                  </TableCell>
                  {Array.from({ length: skeletonStudentCount }).map((_, studentIndex) => (
                    <TableCell key={`skeleton-grade-${categoryIndex}-${subjectIndex}-${studentIndex}`} align='center'>
                      <Skeleton variant='rounded' width={40} height={24} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </Fragment>
          ))}
          {Array.from({ length: 2 }).map((_, categoryIndex) => (
            <Fragment key={`skeleton-category-${categoryIndex}`}>
              <TableRow
                sx={{
                  backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                    <Skeleton variant='text' width='60%' height={24} />
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant='text' width={30} height={20} />
                </TableCell>
                <TableCell colSpan={2 + skeletonStudentCount}></TableCell>
              </TableRow>

              {/* Skeleton cho Subject Rows */}
              {Array.from({ length: 3 }).map((_, subjectIndex) => (
                <TableRow key={`skeleton-subject-${categoryIndex}-${subjectIndex}`} hover>
                  <TableCell>
                    <Box sx={{ pl: 5 }}>
                      <Skeleton variant='text' width='80%' height={20} />
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Skeleton variant='text' width={20} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width='60%' height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width='40%' height={20} />
                  </TableCell>
                  {Array.from({ length: skeletonStudentCount }).map((_, studentIndex) => (
                    <TableCell key={`skeleton-grade-${categoryIndex}-${subjectIndex}-${studentIndex}`} align='center'>
                      <Skeleton variant='rounded' width={40} height={24} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LoadingSkeleton
