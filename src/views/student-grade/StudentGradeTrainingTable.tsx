'use client'

import { Fragment, memo, useCallback, useMemo, useState, useEffect } from 'react'

import {
  Table,
  TableBody,
  TableContainer,
  Chip,
  Paper,
  Button,
  Box,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  TextField
} from '@mui/material'

import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { mutate as mutateGlobal } from 'swr'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'
import type { GradeTypeById } from '@/types/management/gradeTypes'
import TableNoData from '@/components/table/TableNotFound'
import { CategoryRow, ProgramRow, SubjectRow } from './component/TableComppnent'
import { TableHeader } from './component/TableHeader'
import { useAuth } from '@/hooks/useAuth'
import { useShare } from '@/hooks/useShare'
import CustomTextField from '@/@core/components/mui/TextField'
import gradeService from '@/services/grade.service'

// import { UserType } from '@/types/userType'

interface GradeTrainingProgramTableProps {
  trainingProgramData: TrainingProgramByFrame[]
  gradeData: GradeTypeById | null
}

interface GradeInfo {
  [studentId: string]: { grade: number; status: string }
}

const StudentGradeTrainingTable: React.FC<GradeTrainingProgramTableProps> = ({ trainingProgramData, gradeData }) => {
  const { user } = useAuth()
  const { termOptions } = useShare()

  // Khoá duy nhất đại diện cho sinh viên (lấy từ gradeData nếu có, fallback userId)
  const studentKey = gradeData?.studentId || user?.userId || 'current-user'

  // Lưu điểm người dùng nhập tạm thời
  const [editedGrades, setEditedGrades] = useState<Record<string, { grade: number }>>({})
  const [selectedTermId, setSelectedTermId] = useState('')

  // STATE cho dialog cập nhật điểm hiện có
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

  const [updateInfo, setUpdateInfo] = useState<{
    termGrade: any | null
    gradeValue: number
    subject: Subjects
  } | null>(null)

  // Chuẩn bị dữ liệu bảng sinh viên (luôn có 1 dòng)
  const displayGradeData = useMemo(() => {
    if (gradeData) return [gradeData]

    // Tạo fake data để hiển thị UI khi chưa có điểm
    return [
      {
        _id: '',
        studentId: studentKey,
        termGrades: [],
        TCTL_SV: 0,
        TCTL_CD: 0,
        TCN: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any
    ]
  }, [gradeData, studentKey])

  // Map điểm theo subjectId và studentId (bao gồm điểm chỉnh sửa)
  const gradesMap = useMemo(() => {
    const map = new Map<string, GradeInfo>()

    if (gradeData?.termGrades) {
      gradeData.termGrades.forEach(termGrade => {
        termGrade.gradeOfSubject.forEach(gradeSubject => {
          const subjectId = gradeSubject.subjectId._id

          if (!map.has(subjectId)) {
            map.set(subjectId, {})
          }

          map.get(subjectId)![studentKey] = {
            grade: gradeSubject.grade,
            status: gradeSubject.status
          }
        })
      })
    }

    // Ghi đè bởi các điểm đã chỉnh sửa
    Object.entries(editedGrades).forEach(([key, value]) => {
      const [subjectId] = key.split('-')

      if (!map.has(subjectId)) map.set(subjectId, {})
      map.get(subjectId)![studentKey] = { grade: value.grade, status: 'x' }
    })

    return map
  }, [gradeData, editedGrades, studentKey])

  // Hàm render ô điểm
  const renderGradeCell = useCallback(
    (
      grade: number | undefined,
      status: string | undefined,
      key: string,
      subject: Subjects,
      subjectId: string,
      _studentId: string
    ) => {
      void _studentId
      void key
      void status
      const currentKey = `${subjectId}-${selectedTermId}`
      const editedValueCurrent = editedGrades[currentKey]?.grade

      // tìm chỉnh sửa ở kỳ khác
      const otherTermEntry = Object.entries(editedGrades).find(([k]) => {
        const [sub, term] = k.split('-')

        return sub === subjectId && term !== selectedTermId
      })

      const editedValueOther = otherTermEntry ? otherTermEntry[1].grade : undefined

      // Lấy màu theo giá trị điểm
      const getChipColor = (g: number | undefined): 'success' | 'warning' | 'error' | 'default' | 'info' => {
        if (g === undefined) return 'default'
        if (g >= 8) return 'success'
        if (g >= 6.5) return 'warning'
        if (g < 5) return 'error'

        return 'default'
      }

      // Component nội bộ cho ô chỉnh sửa
      const EditableCell: React.FC = () => {
        const [isEditing, setIsEditing] = useState(false)
        const [value, setValue] = useState<number | ''>(editedValueCurrent ?? grade ?? '')

        // Xác định trạng thái ô
        const stateType: 'currentEdit' | 'otherEdit' | 'normal' =
          editedValueCurrent !== undefined ? 'currentEdit' : editedValueOther !== undefined ? 'otherEdit' : 'normal'

        const handleSaveLocal = () => {
          if (value === '') {
            // xóa chỉnh sửa
            setEditedGrades(prev => {
              const copy = { ...prev }

              delete copy[currentKey]

              return copy
            })
          } else {
            const numericVal = typeof value === 'number' ? value : parseFloat(String(value))

            if (!isNaN(numericVal)) {
              setEditedGrades(prev => ({ ...prev, [currentKey]: { grade: numericVal } }))
            }
          }

          setIsEditing(false)
        }

        if (!selectedTermId) {
          // Chưa chọn term -> hiển thị chip và cho phép mở dialog cập nhật
          const displayVal = editedValueCurrent !== undefined ? editedValueCurrent : (grade ?? editedValueOther)

          return (
            <Chip
              label={displayVal ?? '-'}
              size='small'
              color={
                stateType === 'currentEdit'
                  ? 'info'
                  : stateType === 'otherEdit'
                    ? 'secondary'
                    : getChipColor(displayVal)
              }
              variant={stateType === 'normal' ? 'filled' : 'outlined'}
              onClick={() => {
                if (stateType !== 'normal') return

                if (grade !== undefined) {
                  handleOpenUpdateDialog(subject)
                } else {
                  toast.info('Vui lòng chọn học kỳ trước khi nhập điểm', { autoClose: 3000 })
                }
              }}
              sx={{ cursor: displayVal !== undefined ? 'pointer' : 'default' }}
            />
          )
        }

        return isEditing ? (
          <TextField
            size='small'
            value={value}
            autoFocus
            onBlur={handleSaveLocal}
            onChange={e => {
              const v = e.target.value === '' ? '' : Number(e.target.value)

              if (v === '' || (!isNaN(v) && v <= 10 && v >= 0)) {
                setValue(v as any)
              }
            }}
            inputProps={{ min: 0, max: 10, step: 0.1, type: 'number' }}
            sx={{ width: 60 }}
          />
        ) : (
          <Box
            onClick={() => {
              if (stateType === 'currentEdit' || (stateType === 'normal' && grade === undefined)) {
                setIsEditing(true)

                return
              }

              if (stateType === 'otherEdit') {
                const oldKey = otherTermEntry ? otherTermEntry[0] : ''

                if (oldKey) {
                  setEditedGrades(prev => {
                    const copy = { ...prev }
                    const gradeVal = copy[oldKey].grade

                    delete copy[oldKey]
                    copy[currentKey] = { grade: gradeVal }

                    return copy
                  })
                }

                setIsEditing(true)
              }
            }}
            sx={{
              cursor:
                stateType === 'currentEdit' || (stateType === 'normal' && grade === undefined) ? 'pointer' : 'default',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {(() => {
              const displayVal = editedValueCurrent !== undefined ? editedValueCurrent : (grade ?? editedValueOther)

              if (displayVal === undefined) {
                return <Chip label='+' variant='outlined' size='small' />
              }

              return (
                <Chip
                  label={displayVal}
                  color={
                    stateType === 'currentEdit'
                      ? 'info'
                      : stateType === 'otherEdit'
                        ? 'secondary'
                        : getChipColor(displayVal)
                  }
                  variant={stateType === 'normal' ? 'filled' : 'outlined'}
                  size='small'
                />
              )
            })()}
          </Box>
        )
      }

      return <EditableCell key={currentKey} />
    },
    [editedGrades, selectedTermId]
  )

  // Render categories
  const renderCategories = useCallback(
    (categories: Categories[], level: number) => {
      return categories.map(category => (
        <Fragment key={category._id}>
          <CategoryRow category={category} level={level} gradeData={displayGradeData} />
          {category.subjects?.map(subject => (
            <SubjectRow
              key={subject._id}
              subject={subject}
              level={level + 1}
              gradesMap={gradesMap}
              gradeData={displayGradeData}
              renderGradeCell={renderGradeCell}
            />
          ))}
          {category.categoriesC3 && renderCategories(category.categoriesC3, level + 1)}
        </Fragment>
      ))
    },
    [displayGradeData, gradesMap, renderGradeCell]
  )

  // Flatten data
  const flattenedData = useMemo(() => {
    const result: any[] = []

    trainingProgramData.forEach(program => {
      result.push({ type: 'program', data: program })
      program.subjects?.forEach(subject => {
        result.push({ type: 'subject', data: subject, level: 1 })
      })

      const addCategoriesRecursively = (categories: Categories[], level: number) => {
        categories.forEach(category => {
          result.push({ type: 'category', data: category, level })
          category.subjects?.forEach(subject => {
            result.push({ type: 'subject', data: subject, level: level + 1 })
          })
          if (category.categoriesC3) addCategoriesRecursively(category.categoriesC3, level + 1)
        })
      }

      if (program.categories) addCategoriesRecursively(program.categories, 1)
    })

    return result
  }, [trainingProgramData])

  // Lưu điểm
  const handleSaveGrades = async () => {
    if (!selectedTermId) {
      toast.error('Vui lòng chọn học kỳ trước khi lưu')

      return
    }

    if (Object.keys(editedGrades).length === 0) {
      toast.info('Không có thay đổi để lưu')

      return
    }

    const toastId = toast.loading('Đang lưu điểm...')

    try {
      const grouped: Record<string, { subjectId: string; grade: number }[]> = {}

      Object.entries(editedGrades).forEach(([key, value]) => {
        const [subjectId, termId] = key.split('-')

        if (!grouped[termId]) grouped[termId] = []
        grouped[termId].push({ subjectId, grade: value.grade })
      })

      const termGradesPayload = Object.entries(grouped).map(([term, list]) => ({
        term,
        gradeOfSubject: list
      }))

      const payload = { termGrades: termGradesPayload }

      await gradeService.importGradeStudent(payload)
      toast.update(toastId, {
        render: 'Lưu điểm thành công',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setEditedGrades({})
      mutateGlobal('api/grade/view-grade-SV')
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.message || 'Có lỗi xảy ra khi lưu điểm',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
    }
  }

  // Hủy chỉnh sửa
  const handleCancelEdits = () => {
    if (Object.keys(editedGrades).length === 0) return
    setEditedGrades({})
    toast.info('Đã hủy các thay đổi', { autoClose: 2000 })
  }

  // Dialog cập nhật điểm
  const handleOpenUpdateDialog = (subject: Subjects) => {
    if (!gradeData) return
    let foundTermGrade: any | null = null

    for (const tg of gradeData.termGrades) {
      if (tg.gradeOfSubject.some(gs => gs.subjectId._id === subject._id)) {
        foundTermGrade = tg
        break
      }
    }

    const existingGradeVal = foundTermGrade
      ? (foundTermGrade.gradeOfSubject.find((gs: any) => gs.subjectId._id === subject._id)?.grade ?? 0)
      : 0

    setUpdateInfo({ subject, termGrade: foundTermGrade, gradeValue: existingGradeVal })
    setOpenUpdateDialog(true)
  }

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false)
    setUpdateInfo(null)
  }

  const UpdateGradeDialog: React.FC = () => {
    const [term, setTerm] = useState('')
    const [gradeVal, setGradeVal] = useState<number>(0)

    useEffect(() => {
      if (updateInfo) {
        setTerm(updateInfo.termGrade ? updateInfo.termGrade.term._id : '')
        setGradeVal(updateInfo.gradeValue)
      }
    }, [updateInfo])

    if (!openUpdateDialog || !updateInfo) return null

    const handleSubmit = async () => {
      if (!term) {
        toast.error('Vui lòng chọn học kỳ')

        return
      }

      const toastId = toast.loading('Đang cập nhật điểm...')

      try {
        const targetTermGrade = gradeData?.termGrades.find(tg => tg.term._id === term)
        let gradeOfSubjectList: { subjectId: string; grade: number }[] = []

        if (targetTermGrade) {
          gradeOfSubjectList = targetTermGrade.gradeOfSubject.map(gs => ({
            subjectId: gs.subjectId._id,
            grade: gs.subjectId._id === updateInfo.subject._id ? gradeVal : gs.grade
          }))

          if (!targetTermGrade.gradeOfSubject.some(gs => gs.subjectId._id === updateInfo.subject._id)) {
            gradeOfSubjectList.push({ subjectId: updateInfo.subject._id, grade: gradeVal })
          }

          const payload = {
            termGrades: [
              {
                term,
                gradeOfSubject: gradeOfSubjectList
              }
            ]
          }

          await gradeService.updateGradeStudent(targetTermGrade._id, payload)
        }

        toast.update(toastId, {
          render: 'Cập nhật điểm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        handleCloseUpdateDialog()
        mutateGlobal('api/grade/view-grade-SV')
      } catch (error: any) {
        toast.update(toastId, {
          render: error?.message || 'Cập nhật thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    }

    return (
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth='sm'>
        <DialogTitle>Cập nhật điểm</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <Typography>
              {updateInfo.subject.courseCode} - {updateInfo.subject.courseName}
            </Typography>
            <Autocomplete
              options={termOptions || []}
              getOptionLabel={option => `${option.abbreviatName} - ${option.status}`}
              value={termOptions?.find(t => t._id === term) || null}
              onChange={(_, val) => setTerm(val?._id || '')}
              renderInput={params => <CustomTextField {...params} size='small' placeholder='Học kỳ' />}
            />
            <CustomTextField
              size='small'
              label='Điểm'
              type='number'
              value={gradeVal}
              onChange={e => {
                const v = Number(e.target.value)

                if (!isNaN(v) && v >= 0 && v <= 10) setGradeVal(v)
              }}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Đóng</Button>
          <LoadingButton onClick={handleSubmit} variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <>
      {/* Thanh công cụ */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Autocomplete
            options={termOptions.sort((b, a) => a.abbreviatName.localeCompare(b.abbreviatName)) || []}
            getOptionLabel={option => `${option.abbreviatName} - ${option.status}` || ''}
            value={termOptions?.find(t => t._id === selectedTermId) || null}
            sx={{ width: 250 }}
            onChange={(_, value) => setSelectedTermId(value?._id || '')}
            renderInput={params => <CustomTextField {...params} size='small' placeholder='Chọn học kỳ' />}
          />
          {Object.keys(editedGrades).length > 0 && (
            <Button
              variant='outlined'
              color='secondary'
              size='small'
              onClick={handleCancelEdits}
              disabled={Object.keys(editedGrades).length === 0}
            >
              Hủy
            </Button>
          )}
          <LoadingButton
            variant='contained'
            color='primary'
            size='small'
            onClick={handleSaveGrades}
            disabled={Object.keys(editedGrades).length === 0}
          >
            Lưu điểm
          </LoadingButton>
        </Box>
      </Box>

      {/* Bảng chương trình đào tạo */}
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)' }}>
        <Table stickyHeader aria-label='training program table' size='small' sx={{ minWidth: 1200 }}>
          <TableHeader gradeData={displayGradeData} />
          <TableBody>
            {flattenedData.map(item => {
              switch (item.type) {
                case 'program':
                  return <ProgramRow key={item.data._id} program={item.data} gradeData={displayGradeData} />
                case 'category':
                  return (
                    <CategoryRow
                      key={item.data._id}
                      category={item.data}
                      level={item.level}
                      gradeData={displayGradeData}
                    />
                  )
                case 'subject':
                  return (
                    <SubjectRow
                      key={item.data._id}
                      subject={item.data}
                      level={item.level}
                      gradesMap={gradesMap}
                      gradeData={displayGradeData}
                      renderGradeCell={renderGradeCell}
                    />
                  )
                default:
                  return null
              }
            })}
            {flattenedData.length === 0 && (
              <TableNoData notFound={true} title='Không có dữ liệu chương trình đào tạo' />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <UpdateGradeDialog />
    </>
  )
}

export default memo(StudentGradeTrainingTable)
