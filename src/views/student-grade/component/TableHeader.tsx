import { memo, useMemo, useCallback } from 'react'

import { Box, Stack, TableCell, TableHead, TableRow, Typography, Tooltip } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'

import type { GradeTypeById } from '@/types/management/gradeTypes'
import { useAuth } from '@/hooks/useAuth'

import { useSettings } from '@/@core/hooks/useSettings'
import StyledTableRow from '@/components/table/StyledTableRow'
import type { UserType } from '@/types/userType'
import { useGradeStore } from '@/stores/grade/grade.store'
import CustomIconButton from '@/@core/components/mui/IconButton'

// Memoized component cho UserInfo
const UserInfo = memo(({ student }: { student: UserType }) => {
  const { settings } = useSettings()

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Box>
        <Typography color={settings.mode === 'dark' ? 'white' : 'black'} fontWeight='medium'>
          {student.userName}
        </Typography>
        <Typography variant='caption' color={settings.mode === 'dark' ? 'white' : 'black'}>
          {student.mail}
        </Typography>
      </Box>
    </Stack>
  )
})

UserInfo.displayName = 'UserInfo'

export const TableHeader = memo(({ gradeData }: { gradeData: GradeTypeById[] }) => {
  const { settings } = useSettings()
  const { user } = useAuth()
  const { toogleViewAdviseHistory, setCurrentStudentGradeData } = useGradeStore()

  const handleViewAdviseHistory = useCallback(() => {
    // Vì đây là bảng sinh viên, sẽ chỉ có 1 item trong gradeData
    if (gradeData.length > 0) {
      setCurrentStudentGradeData(gradeData[0])
      toogleViewAdviseHistory()
    }
  }, [gradeData, setCurrentStudentGradeData, toogleViewAdviseHistory])

  // Memoized styles để tránh tính toán lại
  const stickyHeaderStyle = useMemo(
    () => ({
      backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
      textTransform: 'uppercase' as const
    }),
    [settings.mode]
  )

  const cellStyle = useMemo(
    () => ({
      backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
      textTransform: 'uppercase' as const
    }),
    [settings.mode]
  )

  // Memoized student data để tránh re-render không cần thiết
  const studentCells = useMemo(
    () =>
      gradeData.map(student => {
        const latestTermGrade = student.termGrades.at(-1)
        const hasAdviseHistory = student.termGrades.some(term => term.advise && term.advise.trim() !== '')

        return {
          id: student.studentId,
          advise: latestTermGrade?.advise || '',
          TCTL_CD: student.TCTL_CD || '-',
          TCTL_SV: student.TCTL_SV || '-',
          studentInfo: student.studentId,
          gradeId: student._id,
          termId: latestTermGrade?._id || '',
          latestTermGrade,
          hasAdviseHistory
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
            color: 'white'
          }}
        >
          <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-end'>
            <Typography variant='inherit'>Ghi chú</Typography>
            <Tooltip title='Xem lịch sử ghi chú'>
              <CustomIconButton variant='contained' size='small' color='warning' onClick={handleViewAdviseHistory}>
                <HistoryIcon fontSize='small' />
              </CustomIconButton>
            </Tooltip>
          </Stack>
        </TableCell>
        {studentCells.map(student => (
          <TableCell
            key={`advise-${student.id}`}
            sx={{
              ...cellStyle,
              color: 'white'
            }}
            align='center'
          >
            <Box sx={{ position: 'relative' }}>
              <Typography
                variant='body2'
                color='white'
                sx={{
                  overflow: 'hidden'
                }}
              >
                {student?.advise || 'Chưa có ghi chú'}
              </Typography>
            </Box>
          </TableCell>
        ))}
      </TableRow>

      {/* TCTL cần đạt */}
      <StyledTableRow>
        <TableCell
          colSpan={4}
          align='right'
          sx={{
            ...stickyHeaderStyle,
            minWidth: 100,
            color: 'white'
          }}
        >
          TCTL cần đạt
        </TableCell>
        {studentCells.map(student => (
          <TableCell
            width={100}
            key={`tctl-cd-${student.id}`}
            sx={{
              ...cellStyle,
              color: 'white'
            }}
            align='center'
          >
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
            minWidth: 100,
            color: 'white'
          }}
        >
          TCTL Sinh viên
        </TableCell>
        {studentCells.map(student => (
          <TableCell
            width={100}
            key={`tctl-sv-${student.id}`}
            sx={{
              ...cellStyle,
              color: 'white'
            }}
            align='center'
          >
            {student.TCTL_SV}
          </TableCell>
        ))}
      </StyledTableRow>

      {/* Chính */}
      <StyledTableRow>
        <TableCell
          width={300}
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
            textTransform: 'uppercase',
            color: 'white'
          }}
        >
          Tên môn học / Danh mục
        </TableCell>
        <TableCell
          width={50}
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
            textTransform: 'uppercase',
            color: 'white'
          }}
        >
          TC
        </TableCell>
        <TableCell
          width={130}
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
            textTransform: 'uppercase',
            color: 'white'
          }}
        >
          Mã MH
        </TableCell>
        <TableCell
          width={100}
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
            textTransform: 'uppercase',
            color: 'white'
          }}
        >
          ĐKTQ
        </TableCell>
        <TableCell
          size='small'
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
            textTransform: 'uppercase',
            zIndex: 8,
            color: 'white'
          }}
          align='center'
        >
          <p>{user?.userId}</p>
          <p>{user?.userName}</p>
        </TableCell>
      </StyledTableRow>
    </TableHead>
  )
})

TableHeader.displayName = 'TableHeader'
