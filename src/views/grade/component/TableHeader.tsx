import { memo, useMemo, useState } from 'react'

import {
  Box,
  Chip,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Popover,
  CircularProgress,
  MenuItem
} from '@mui/material'

import useSWR, { mutate } from 'swr'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import type { GradeType, StudentType } from '@/types/management/gradeTypes'
import type { Concentration } from '@/types/management/majorType'

import { useSettings } from '@/@core/hooks/useSettings'
import StyledTableRow from '@/components/table/StyledTableRow'
import Iconify from '@/components/iconify'
import gradeService from '@/services/grade.service'
import majorService from '@/services/major.service'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { useGradeStore } from '@/stores/grade/grade.store'

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
    onUpdateAdvise?: (student: StudentType, gradeId: string, termGrades: any[], data: GradeType) => void
  }) => {
    const { settings } = useSettings()
    const { idClass, classLecturer } = useGradeStore()

    const fetchGrade = [`/api/grade/view-grade-GV/${idClass}`, idClass]

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
            major: student.majorOfStudent?.concentrationName || 'Cập nhật',
            isActive: student.isActive,
            TCTL_CD: student.TCTL_CD || '-',
            TCTL_SV: student.TCTL_SV || '-',
            studentInfo: student.studentId,
            gradeId: student._id,
            termId: latestTermGrade?._id || '',
            latestTermGrade,
            data: student
          }
        }),
      [gradeData]
    )

    // State popover + editing
    const [anchorElMajor, setAnchorElMajor] = useState<HTMLElement | null>(null)
    const [editingStudent, setEditingStudent] = useState<GradeType | null>(null)
    const [editingMajor, setEditingMajor] = useState<string>('')
    const [isLoadingChangeStatus, setIsLoadingChangeStatus] = useState(false)
    const [isLoadingChangeMajor, setIsLoadingChangeMajor] = useState(false)

    // State for status update
    const [anchorElStatus, setAnchorElStatus] = useState<HTMLElement | null>(null)

    const [editingStudentStatus, setEditingStudentStatus] = useState<{
      gradeId: string
      isActive: 'Còn học' | 'Thôi học' | 'Bảo lưu'
    } | null>(null)

    const [editingStatus, setEditingStatus] = useState<'Còn học' | 'Thôi học' | 'Bảo lưu'>('Còn học')

    // Fetch concentrations theo selectedMajorId và cache
    const { data: concentrationsList = [], isValidating: concentrationsLoading } = useSWR(
      classLecturer?.majorId ? `/api/major/view-list-concentration/${classLecturer.majorId}` : null,
      () => majorService.getConcerntrationByMajor(classLecturer?.majorId || ''),
      { revalidateOnFocus: false, onError: () => toast.error('Lỗi khi lấy danh sách chuyên ngành') }
    )

    const handleOpenMajorPopover = (event: React.MouseEvent<HTMLElement>, student: GradeType) => {
      setAnchorElMajor(event.currentTarget)
      setEditingStudent(student)

      // reset chọn ngành & chuyên ngành
      setEditingMajor('')
    }

    const handleCloseMajorPopover = () => {
      setAnchorElMajor(null)
      setEditingStudent(null)
    }

    // Handlers cho status popover
    const handleOpenStatusPopover = (event: React.MouseEvent<HTMLElement>, student: (typeof studentCells)[number]) => {
      setAnchorElStatus(event.currentTarget)
      setEditingStudentStatus({ gradeId: student.gradeId, isActive: student.isActive })
      setEditingStatus(student.isActive)
    }

    const handleSaveStatus = async () => {
      if (!editingStudentStatus) return toast.error('Không tìm thấy sinh viên')

      const toastID = toast.loading('Đang xử lý...')

      setIsLoadingChangeStatus(true)

      await gradeService.updateActive(
        editingStudentStatus.gradeId,
        {
          isActive: editingStatus
        },
        () => {
          toast.update(toastID, {
            render: 'Cập nhật trạng thái thành công',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
          mutate(fetchGrade)
          setAnchorElStatus(null)
          setEditingStudentStatus(null)
          setIsLoadingChangeStatus(false)
        },
        err => {
          toast.update(toastID, {
            render: err.message || 'Cập nhật trạng thái thất bại',
            type: 'error',
            isLoading: false,
            autoClose: 3000
          })
          setIsLoadingChangeStatus(false)
        }
      )
    }

    const handleSaveMajor = async () => {
      if (!editingStudent?._id) return toast.error('Không tìm thấy sinh viên')

      const toastID = toast.loading('Đang xử lý...')

      setIsLoadingChangeMajor(true)
      handleCloseMajorPopover()

      await gradeService.updateMajor(
        editingStudent._id,
        {
          majorOfStudent: editingMajor
        },
        () => {
          toast.update(toastID, {
            render: 'Cập nhật chuyên ngành thành công',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
          mutate(fetchGrade)
          setIsLoadingChangeMajor(false)
        },
        err => {
          toast.update(toastID, {
            render: err.message || 'Cập nhật chuyên ngành thất bại',
            type: 'error',
            isLoading: false,
            autoClose: 3000
          })
          setIsLoadingChangeMajor(false)
        }
      )
    }

    const handleCloseStatusPopover = () => {
      setAnchorElStatus(null)
      setEditingStudentStatus(null)
    }

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
              {student.termId && onUpdateAdvise && (
                <Button
                  size='small'
                  variant='text'
                  startIcon={<Iconify icon='tabler:edit' />}
                  onClick={() =>
                    onUpdateAdvise?.(
                      student.studentInfo,
                      student.gradeId,
                      gradeData.find(g => g._id === student.gradeId)?.termGrades || [],
                      student.data
                    )
                  }
                  sx={{
                    color: settings.mode === 'dark' ? 'white' : 'black',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    p: 0.5
                  }}
                >
                  Xem ghi chú
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
              <Button
                size='small'
                variant='text'
                endIcon={<Iconify icon='tabler:edit' />}
                onClick={e => handleOpenMajorPopover(e, student.data)}
              >
                {student.major}
              </Button>
            </TableCell>
          ))}
        </StyledTableRow>

        {/* Popover cập nhật chuyên ngành */}
        <Popover
          open={Boolean(anchorElMajor)}
          anchorEl={anchorElMajor}
          onClose={handleCloseMajorPopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Box sx={{ p: 2, width: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='subtitle2'>Chọn chuyên ngành</Typography>
            <CustomAutocomplete
              options={concentrationsList}
              getOptionLabel={(option: Concentration) => option.concentrationName || ''}
              loading={concentrationsLoading}
              fullWidth
              size='small'
              value={concentrationsList.find(c => c._id === editingStudent?.majorOfStudent?._id) || null}
              onChange={(_, value: Concentration | null) => setEditingMajor(value?._id || '')}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Chuyên ngành'
                  size='small'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {concentrationsLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button disabled={isLoadingChangeMajor} size='small' onClick={handleCloseMajorPopover}>
                Hủy
              </Button>
              <LoadingButton
                size='small'
                variant='contained'
                onClick={handleSaveMajor}
                disabled={!editingMajor}
                loading={isLoadingChangeMajor}
              >
                Lưu
              </LoadingButton>
            </Box>
          </Box>
        </Popover>

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
              <Button size='small' variant='text' onClick={e => handleOpenStatusPopover(e, student)}>
                <Chip
                  label={
                    student.isActive === 'Còn học'
                      ? 'Còn học'
                      : student.isActive === 'Thôi học'
                        ? 'Thôi học'
                        : student.isActive === 'Bảo lưu'
                          ? 'Bảo lưu'
                          : 'Thôi học'
                  }
                  color={
                    student.isActive === 'Còn học'
                      ? 'success'
                      : student.isActive === 'Thôi học'
                        ? 'error'
                        : student.isActive === 'Bảo lưu'
                          ? 'warning'
                          : 'error'
                  }
                  size='small'
                  variant='filled'
                />
              </Button>
            </TableCell>
          ))}
        </StyledTableRow>

        {/* Popover cập nhật trạng thái riêng */}
        <Popover
          open={Boolean(anchorElStatus)}
          anchorEl={anchorElStatus}
          onClose={handleCloseStatusPopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Box sx={{ p: 2, width: 200, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='subtitle2'>Cập nhật trạng thái</Typography>
            <CustomTextField
              select
              fullWidth
              size='small'
              value={editingStatus}
              onChange={e => setEditingStatus(e.target.value as 'Còn học' | 'Thôi học' | 'Bảo lưu')}
            >
              <MenuItem value='Còn học'>Còn học</MenuItem>
              <MenuItem value='Thôi học'>Thôi học</MenuItem>
              <MenuItem value='Bảo lưu'>Bảo lưu</MenuItem>
            </CustomTextField>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button disabled={isLoadingChangeStatus} size='small' onClick={handleCloseStatusPopover}>
                Hủy
              </Button>
              <LoadingButton
                loading={isLoadingChangeStatus}
                size='small'
                variant='contained'
                onClick={handleSaveStatus}
              >
                Lưu
              </LoadingButton>
            </Box>
          </Box>
        </Popover>

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
