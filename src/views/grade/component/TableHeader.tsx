import { memo, useMemo } from 'react'

import { Box, Chip, Stack, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material'

import type { GradeType, StudentType } from '@/types/management/gradeTypes'

import { useSettings } from '@/@core/hooks/useSettings'
import StyledTableRow from '@/components/table/StyledTableRow'
import Iconify from '@/components/iconify'

// Memoized component cho UserInfo
const UserInfo = memo(({ student }: { student: GradeType['studentId'] }) => {
  const { settings } = useSettings()

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Box>
        <Typography color={settings.mode === 'dark' ? 'white' : 'black'} fontWeight='medium'>
          {student.userId}
        </Typography>
        <Typography variant='caption' color={settings.mode === 'dark' ? 'white' : 'black'}>
          {student.userName}
        </Typography>
      </Box>
    </Stack>
  )
})

UserInfo.displayName = 'UserInfo'

export const TableHeader = memo(
  ({
    gradeData,
    onUpdateAdvise
  }: {
    gradeData: GradeType[]
    onUpdateAdvise?: (student: StudentType, gradeId: string, termGrades: any[]) => void
  }) => {
    const { settings } = useSettings()

    // Định nghĩa màu header theo đề xuất
    const subjectHeader = settings.mode === 'dark' ? '#2A3C5E' : '#D2E3FC'
    const studentHeader = settings.mode === 'dark' ? '#5F4822' : '#FFE3B3'

    // Memoized styles để tránh tính toán lại
    const stickyHeaderStyle = useMemo(
      () => ({
        backgroundColor: subjectHeader,
        textTransform: 'uppercase' as const,
        position: 'sticky' as const,
        left: 0,
        zIndex: 9
      }),
      [subjectHeader]
    )

    const cellStyle = useMemo(
      () => ({
        backgroundColor: studentHeader,
        textTransform: 'uppercase' as const,
        zIndex: 8,
        left: 0
      }),
      [studentHeader]
    )

    // Memoized student data để tránh re-render không cần thiết
    const studentCells = useMemo(
      () =>
        gradeData.map(student => {
          const latestTermGrade = student.termGrades.at(-1)

          return {
            id: student.studentId.userId,
            advise: latestTermGrade?.advise || '',
            major: student.majorOfStudent || '-',
            isActive: student.isActive,
            TCTL_CD: student.TCTL_CD || '-',
            TCTL_SV: student.TCTL_SV || '-',
            studentInfo: student.studentId,
            gradeId: student._id,
            termId: latestTermGrade?._id || '',
            latestTermGrade
          }
        }),
      [gradeData]
    )

    return (
      <TableHead sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
        {/* Ghi chú */}
        <TableRow>
          <TableCell
            colSpan={4}
            align='right'
            sx={{
              ...stickyHeaderStyle,
              top: 0.2
            }}
          >
            Ghi chú
          </TableCell>
          {studentCells.map(student => (
            <TableCell
              width={100}
              key={`advise-${student.id}`}
              sx={{
                ...cellStyle,
                top: 0.2
              }}
              align='center'
            >
              {student.termId && onUpdateAdvise ? (
                <Button
                  size='small'
                  variant='text'
                  startIcon={<Iconify icon='tabler:edit' />}
                  onClick={() =>
                    onUpdateAdvise(
                      student.studentInfo,
                      student.gradeId,
                      gradeData.find(g => g._id === student.gradeId)?.termGrades || []
                    )
                  }
                  sx={{
                    color: settings.mode === 'dark' ? 'white' : 'black',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    p: 0.5
                  }}
                >
                  {student.advise || 'Chưa có'}
                </Button>
              ) : (
                <Button
                  size='small'
                  variant='text'
                  startIcon={<Iconify icon='tabler:edit' />}
                  onClick={() =>
                    onUpdateAdvise?.(
                      student.studentInfo,
                      student.gradeId,
                      gradeData.find(g => g._id === student.gradeId)?.termGrades || []
                    )
                  }
                  sx={{
                    color: settings.mode === 'dark' ? 'white' : 'black',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    p: 0.5
                  }}
                >
                  {student.advise || 'Chưa có'}
                </Button>
              )}
            </TableCell>
          ))}
        </TableRow>

        {/* Chuyên ngành */}
        <StyledTableRow>
          <TableCell
            colSpan={4}
            align='right'
            sx={{
              ...stickyHeaderStyle,
              minWidth: 100
            }}
          >
            Chuyên ngành
          </TableCell>
          {studentCells.map(student => (
            <TableCell width={100} key={`major-${student.id}`} sx={cellStyle} align='center'>
              {student.major}
            </TableCell>
          ))}
        </StyledTableRow>

        {/* Trạng thái */}
        <StyledTableRow>
          <TableCell
            colSpan={4}
            align='right'
            sx={{
              ...stickyHeaderStyle,
              minWidth: 100
            }}
          >
            Trạng thái
          </TableCell>
          {studentCells.map(student => (
            <TableCell width={100} key={`status-${student.id}`} sx={cellStyle} align='center'>
              <Chip
                label={student.isActive ? 'Còn học' : 'Đã nghỉ'}
                color={student.isActive ? 'success' : 'error'}
                size='small'
                variant='filled'
              />
            </TableCell>
          ))}
        </StyledTableRow>

        {/* TCTL cần đạt */}
        <StyledTableRow>
          <TableCell
            colSpan={4}
            align='right'
            sx={{
              ...stickyHeaderStyle,
              minWidth: 100
            }}
          >
            TCTL cần đạt
          </TableCell>
          {studentCells.map(student => (
            <TableCell width={100} key={`tctl-cd-${student.id}`} sx={cellStyle} align='center'>
              {student.TCTL_CD}
            </TableCell>
          ))}
        </StyledTableRow>

        {/* TCTL Sinh viên */}
        <StyledTableRow>
          <TableCell
            colSpan={4}
            align='right'
            sx={{
              ...stickyHeaderStyle,
              minWidth: 100
            }}
          >
            TCTL Sinh viên
          </TableCell>
          {studentCells.map(student => (
            <TableCell width={100} key={`tctl-sv-${student.id}`} sx={cellStyle} align='center'>
              {student.TCTL_SV}
            </TableCell>
          ))}
        </StyledTableRow>

        {/* Chính */}
        <StyledTableRow>
          <TableCell
            width={430}
            sx={{
              minWidth: 430,
              backgroundColor: subjectHeader,
              textTransform: 'uppercase',
              position: 'sticky',
              left: 0,
              zIndex: 9
            }}
          >
            Tên môn học / Danh mục
          </TableCell>
          <TableCell
            width={50}
            sx={{
              minWidth: 50,
              backgroundColor: subjectHeader,
              textTransform: 'uppercase',
              position: 'sticky',
              left: 430.5,
              zIndex: 9
            }}
          >
            TC
          </TableCell>
          <TableCell
            width={90}
            sx={{
              minWidth: 90,
              backgroundColor: subjectHeader,
              textTransform: 'uppercase',
              position: 'sticky',
              left: 480.5,
              zIndex: 9
            }}
          >
            Loại HP
          </TableCell>
          <TableCell
            width={180}
            sx={{
              minWidth: 180,
              backgroundColor: subjectHeader,
              textTransform: 'uppercase',
              position: 'sticky',
              left: 570,
              zIndex: 9,
              boxShadow: '10px 0 10px -10px rgba(0, 0, 0, 0.3)'
            }}
          >
            ĐK học trước
          </TableCell>
          {studentCells.map(student => (
            <TableCell
              size='small'
              key={`${student.id}`}
              sx={{
                ...cellStyle,
                minWidth: 200
              }}
              align='center'
            >
              <p>{student.studentInfo.userId}</p>
              <p>{student.studentInfo.userName}</p>
            </TableCell>
          ))}
        </StyledTableRow>
      </TableHead>
    )
  }
)

TableHeader.displayName = 'TableHeader'
