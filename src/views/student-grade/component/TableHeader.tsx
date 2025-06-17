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

export const TableHeader = memo(({ gradeData }: { gradeData: GradeTypeById[] | null }) => {
  const { settings } = useSettings()
  const { user } = useAuth()
  const { toogleViewAdviseHistory, setCurrentStudentGradeData } = useGradeStore()

  // Định nghĩa màu header theo đề xuất
  const subjectHeader = settings.mode === 'dark' ? '#2A3C5E' : '#D2E3FC'
  const studentHeader = settings.mode === 'dark' ? '#5F4822' : '#FFE3B3'

  const handleViewAdviseHistory = useCallback(() => {
    // Vì đây là bảng sinh viên, sẽ chỉ có 1 item trong gradeData
    if (gradeData && gradeData.length > 0) {
      setCurrentStudentGradeData(gradeData[0])
      toogleViewAdviseHistory()
    }
  }, [gradeData, setCurrentStudentGradeData, toogleViewAdviseHistory])

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
  const studentCells = useMemo(() => {
    // Nếu có dữ liệu thật, sử dụng dữ liệu đó
    if (gradeData && gradeData.length > 0) {
      return gradeData.map(student => {
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
      })
    }

    // Nếu không có dữ liệu, tạo một student cell giả để hiển thị cột điểm
    return [
      {
        id: user?.userId || 'current-user',
        advise: 'Chưa có tư vấn',
        TCTL_CD: '-',
        TCTL_SV: '-',
        studentInfo: user?.userId || 'current-user',
        gradeId: '',
        termId: '',
        latestTermGrade: null,
        hasAdviseHistory: false
      }
    ]
  }, [gradeData, user?.userId])

  return (
    <TableHead sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
      {/* Ghi chú */}
      <TableRow>
        <TableCell
          colSpan={4}
          align='right'
          sx={{
            ...stickyHeaderStyle
          }}
        >
          <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-end'>
            <Typography variant='inherit'>Tư vấn</Typography>
            <Tooltip title='Xem lịch sử tư vấn'>
              <CustomIconButton variant='contained' size='small' color='warning' onClick={handleViewAdviseHistory}>
                <HistoryIcon fontSize='small' />
              </CustomIconButton>
            </Tooltip>
          </Stack>
        </TableCell>
        {studentCells?.map(student => (
          <TableCell
            key={`advise-${student.id}`}
            sx={{
              ...cellStyle
            }}
            align='center'
          >
            <Box sx={{ position: 'relative' }}>
              <Typography
                variant='body2'
                sx={{
                  overflow: 'hidden'
                }}
              >
                {student?.advise || 'Chưa có tư vấn'}
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
            minWidth: 100
          }}
        >
          TCTL cần đạt
        </TableCell>
        {studentCells?.map(student => (
          <TableCell
            width={100}
            key={`tctl-cd-${student.id}`}
            sx={{
              ...cellStyle
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
            minWidth: 100
          }}
        >
          TCTL Sinh viên
        </TableCell>
        {studentCells?.map(student => (
          <TableCell
            width={100}
            key={`tctl-sv-${student.id}`}
            sx={{
              ...cellStyle
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
            backgroundColor: subjectHeader,
            textTransform: 'uppercase'
          }}
        >
          Tên môn học / Danh mục
        </TableCell>
        <TableCell
          width={50}
          sx={{
            backgroundColor: subjectHeader,
            textTransform: 'uppercase'
          }}
        >
          TC
        </TableCell>
        <TableCell
          width={130}
          sx={{
            backgroundColor: subjectHeader,
            textTransform: 'uppercase'
          }}
        >
          Mã MH
        </TableCell>
        <TableCell
          width={100}
          sx={{
            backgroundColor: subjectHeader,
            textTransform: 'uppercase'
          }}
        >
          ĐKTQ
        </TableCell>
        <TableCell
          size='small'
          sx={{
            backgroundColor: studentHeader,
            textTransform: 'uppercase',
            zIndex: 8
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
