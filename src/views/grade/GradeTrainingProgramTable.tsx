'use client'

import { Fragment, useCallback, useMemo, useState, useEffect } from 'react'

import {
  Table,
  TableBody,
  TableContainer,
  Chip,
  Paper,
  Button,
  Box,
  Skeleton,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Tooltip
} from '@mui/material'

import { useDebounce } from 'react-use'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { Controller, useForm } from 'react-hook-form'

import type { KeyedMutator } from 'swr'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'
import type { GradeType, StudentType } from '@/types/management/gradeTypes'
import TableNoData from '@/components/table/TableNotFound'
import { CategoryRow, ProgramRow, SubjectRow } from './component/TableComppnent'
import { TableHeader } from './component/TableHeader'

import gradeService from '@/services/grade.service'
import { useShare } from '@/hooks/useShare'
import CustomTextField from '@/@core/components/mui/TextField'

interface GradeTrainingProgramTableProps {
  trainingProgramData: TrainingProgramByFrame[]
  gradeData: GradeType[]
  mutateGrade: KeyedMutator<any>
}

interface GradeInfo {
  [studentId: string]: { grade: number; status: string }
}

const ITEMS_PER_PAGE = 50 // Phân trang để tối ưu hiệu suất

const GradeTrainingProgramTable: React.FC<GradeTrainingProgramTableProps> = ({
  trainingProgramData,
  gradeData,
  mutateGrade
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { termOptions } = useShare()

  // State cho tìm kiếm sinh viên
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // NEW STATE: lưu điểm người dùng nhập tạm thời
  const [editedGrades, setEditedGrades] = useState<Record<string, { grade: number }>>({})
  const [selectedTermId, setSelectedTermId] = useState('')

  // STATE cho dialog cập nhật điểm hiện có
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

  const [updateInfo, setUpdateInfo] = useState<{
    studentGradeRow: GradeType
    subject: Subjects
    termGrade: any | null
    gradeValue: number
  } | null>(null)

  // Debounce giá trị tìm kiếm để tối ưu hiệu suất
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase())
    },
    300,
    [searchTerm]
  )

  // Lọc dữ liệu sinh viên dựa trên từ khóa tìm kiếm
  const filteredGradeData = useMemo(() => {
    if (!debouncedSearchTerm) return gradeData

    return gradeData.filter(student => {
      const id = student.studentId.userId.toLowerCase()
      const name = student.studentId.userName.toLowerCase()

      return id.includes(debouncedSearchTerm) || name.includes(debouncedSearchTerm)
    })
  }, [gradeData, debouncedSearchTerm])

  // Map điểm theo subjectId và studentId (đã bao gồm điểm chỉnh sửa)
  const gradesMap = useMemo(() => {
    if (!gradeData?.length) return new Map<string, GradeInfo>()

    const map = new Map<string, GradeInfo>()

    gradeData.forEach(studentGrade => {
      const studentId = studentGrade.studentId._id

      studentGrade.termGrades.forEach(termGrade => {
        termGrade.gradeOfSubject.forEach(gradeSubject => {
          const subjectId = gradeSubject.subjectId._id

          if (!map.has(subjectId)) {
            map.set(subjectId, {})
          }

          map.get(subjectId)![studentId] = {
            grade: gradeSubject.grade,
            status: gradeSubject.status
          }
        })
      })
    })

    // Ghi đè bởi các điểm đã chỉnh sửa
    Object.entries(editedGrades).forEach(([key, value]) => {
      const [studentId, subjectId] = key.split('-')

      if (!map.has(subjectId)) map.set(subjectId, {})
      map.get(subjectId)![studentId] = { grade: value.grade, status: 'x' }
    })

    return map
  }, [gradeData, editedGrades])

  // Memoized render grade cell với performance optimization
  const renderGradeCell = useCallback(
    (
      grade: number | undefined,
      status: string | undefined,
      key: string,
      subject: Subjects,
      subjectId: string,
      studentId: string,
      _student: StudentType
    ) => {
      const currentKey = `${studentId}-${subjectId}-${selectedTermId}`
      const editedValueCurrent = editedGrades[currentKey]?.grade

      // tìm xem có chỉnh sửa ở kỳ khác
      const otherTermEntry = Object.entries(editedGrades).find(([k]) => {
        const [stu, sub, term] = k.split('-')

        return stu === studentId && sub === subjectId && term !== selectedTermId
      })

      const editedValueOther = otherTermEntry ? otherTermEntry[1].grade : undefined

      // Đánh dấu biến đã sử dụng để tránh lỗi linter
      void _student
      void status
      void key

      const getTermLabel = (termId?: string) => {
        if (!termId) return ''
        const term = termOptions?.find(t => t._id === termId)

        return term?.abbreviatName || ''
      }

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

        // Xác định trạng thái màu / chỉnh sửa của ô
        const stateType: 'currentEdit' | 'otherEdit' | 'normal' =
          editedValueCurrent !== undefined ? 'currentEdit' : editedValueOther !== undefined ? 'otherEdit' : 'normal'

        const handleSaveLocal = () => {
          if (value === '') {
            // Nếu trống => xóa chỉnh sửa
            setEditedGrades(prev => {
              const copy = { ...prev }

              const keySave = `${studentId}-${subjectId}-${selectedTermId}`

              delete copy[keySave]

              return copy
            })
          } else {
            const numericVal = typeof value === 'number' ? value : parseFloat(String(value))

            if (!isNaN(numericVal)) {
              const keySave = `${studentId}-${subjectId}-${selectedTermId}`

              setEditedGrades(prev => ({ ...prev, [keySave]: { grade: numericVal } }))
            }
          }

          setIsEditing(false)
        }

        if (!selectedTermId) {
          // Chưa chọn học kỳ -> hiển thị chip và cho phép mở dialog cập nhật
          const displayVal = editedValueCurrent !== undefined ? editedValueCurrent : (grade ?? editedValueOther)

          return (
            <div className='flex items-center justify-center gap-2'>
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
                  // Nếu ô đang chứa điểm tạm (chưa lưu) thì không cho mở dialog cập nhật
                  if (stateType !== 'normal') return

                  if (grade !== undefined) {
                    handleOpenUpdateDialog(studentId, subject)
                  } else {
                    toast.info('Vui lòng chọn học kỳ trước khi cập nhật điểm', { autoClose: 3000 })
                  }
                }}
                sx={{ cursor: displayVal !== undefined ? 'pointer' : 'default' }}
              />
              {stateType !== 'normal' && (
                <Typography variant='body2' color='text.secondary'>
                  {getTermLabel(stateType === 'otherEdit' ? otherTermEntry?.[0].split('-')[2] : selectedTermId)} chưa
                  lưu
                </Typography>
              )}
            </div>
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
          <Box>
            {(() => {
              const displayVal = editedValueCurrent !== undefined ? editedValueCurrent : (grade ?? editedValueOther)

              if (displayVal === undefined) {
                return (
                  <Chip
                    label='+'
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      if (stateType === 'currentEdit') {
                        setIsEditing(true)

                        return
                      }

                      if (stateType === 'normal' && grade === undefined) {
                        setIsEditing(true)
                      }

                      // Nếu điểm thuộc học kỳ khác nhưng muốn chuyển sang kỳ hiện tại
                      if (stateType === 'otherEdit') {
                        // Chuyển key sang kỳ hiện tại
                        const oldKey = otherTermEntry ? otherTermEntry[0] : ''

                        if (oldKey) {
                          setEditedGrades(prev => {
                            const copy = { ...prev }
                            const gradeVal = copy[oldKey].grade

                            delete copy[oldKey]
                            const newKey = `${studentId}-${subjectId}-${selectedTermId}`

                            copy[newKey] = { grade: gradeVal }

                            return copy
                          })
                        }

                        // Bắt đầu chỉnh sửa nếu muốn
                        setIsEditing(true)
                      }
                    }}
                  />
                )
              }

              return (
                <div className='flex items-center justify-center gap-2'>
                  <Tooltip
                    title={
                      stateType === 'currentEdit'
                        ? 'Chỉnh sửa'
                        : stateType === 'otherEdit'
                          ? `Nhấp để chuyển điểm từ ${getTermLabel(otherTermEntry?.[0].split('-')[2])} sang ${getTermLabel(selectedTermId)}`
                          : ''
                    }
                  >
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
                      onClick={() => {
                        if (stateType === 'currentEdit') {
                          setIsEditing(true)

                          return
                        }

                        if (stateType === 'normal' && grade === undefined) {
                          setIsEditing(true)
                        }

                        // Nếu điểm thuộc học kỳ khác nhưng muốn chuyển sang kỳ hiện tại
                        if (stateType === 'otherEdit') {
                          // Chuyển key sang kỳ hiện tại
                          const oldKey = otherTermEntry ? otherTermEntry[0] : ''

                          if (oldKey) {
                            setEditedGrades(prev => {
                              const copy = { ...prev }
                              const gradeVal = copy[oldKey].grade

                              delete copy[oldKey]
                              const newKey = `${studentId}-${subjectId}-${selectedTermId}`

                              copy[newKey] = { grade: gradeVal }

                              return copy
                            })
                          }

                          // Bắt đầu chỉnh sửa nếu muốn
                          setIsEditing(true)
                        }
                      }}
                    />
                  </Tooltip>
                  {stateType === 'currentEdit' && (
                    <Typography variant='body2' color='text.secondary'>
                      {getTermLabel(selectedTermId)}
                    </Typography>
                  )}
                  {stateType === 'otherEdit' && (
                    <Typography variant='body2' color='text.secondary'>
                      {getTermLabel(otherTermEntry?.[0].split('-')[2])} {'=>'} {getTermLabel(selectedTermId)}
                    </Typography>
                  )}
                </div>
              )
            })()}
          </Box>
        )
      }

      // Trả về component
      return <EditableCell key={currentKey} />
    },
    [editedGrades, selectedTermId]
  )

  // Memoized categories renderer để tránh re-render không cần thiết
  const renderCategories = useCallback(
    (categories: Categories[], level: number) => {
      return categories.map(category => {
        return (
          <Fragment key={category._id}>
            <CategoryRow category={category} level={level} gradeData={gradeData} />

            {/* Subjects trong category */}
            {category.subjects?.map(subject => (
              <SubjectRow
                key={subject._id}
                subject={subject}
                level={level + 1}
                gradesMap={gradesMap}
                gradeData={gradeData}
                renderGradeCell={renderGradeCell}
              />
            ))}

            {/* Subcategories */}
            {category.categoriesC3 && renderCategories(category.categoriesC3, level + 1)}
          </Fragment>
        )
      })
    },
    [gradeData, gradesMap, renderGradeCell]
  )

  // Flatten data cho virtualization
  const flattenedData = useMemo(() => {
    const result: any[] = []

    trainingProgramData.forEach(program => {
      result.push({ type: 'program', data: program })

      // Subjects trực tiếp trong program
      program.subjects?.forEach(subject => {
        result.push({ type: 'subject', data: subject, level: 1 })
      })

      // Categories trong program
      const addCategoriesRecursively = (categories: Categories[], level: number) => {
        categories.forEach(category => {
          result.push({ type: 'category', data: category, level })

          category.subjects?.forEach(subject => {
            result.push({ type: 'subject', data: subject, level: level + 1 })
          })

          if (category.categoriesC3) {
            addCategoriesRecursively(category.categoriesC3, level + 1)
          }
        })
      }

      if (program.categories) {
        addCategoriesRecursively(program.categories, 1)
      }
    })

    return result
  }, [trainingProgramData])

  // Pagination data
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return flattenedData.slice(startIndex, endIndex)
  }, [flattenedData, currentPage])

  const totalPages = Math.ceil(flattenedData.length / ITEMS_PER_PAGE)

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setIsLoading(true)

      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsLoading(false)
      }, 100)
    }
  }, [currentPage, totalPages])

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setIsLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsLoading(false)
      }, 100)
    }
  }, [currentPage])

  // Skeleton loading component
  const renderSkeleton = () => (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index}>
          <td style={{ padding: '8px' }}>
            <Skeleton variant='text' width='80%' height={20} />
          </td>
          <td style={{ padding: '8px' }}>
            <Skeleton variant='text' width='60%' height={20} />
          </td>
          <td style={{ padding: '8px' }}>
            <Skeleton variant='text' width='70%' height={20} />
          </td>
          <td style={{ padding: '8px' }}>
            <Skeleton variant='text' width='50%' height={20} />
          </td>
          {filteredGradeData.map((_, idx) => (
            <td key={idx} style={{ padding: '8px' }}>
              <Skeleton variant='circular' width={24} height={24} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )

  // Hàm lưu dữ liệu điểm đã nhập
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
      // Gom nhóm theo sinh viên
      const grouped: Record<string, Record<string, { subjectId: string; grade: number }[]>> = {}

      Object.entries(editedGrades).forEach(([key, value]) => {
        const [studentId, subjectId, termId] = key.split('-')

        if (!grouped[studentId]) grouped[studentId] = {}
        if (!grouped[studentId][termId]) grouped[studentId][termId] = []
        grouped[studentId][termId].push({ subjectId, grade: value.grade })
      })

      for (const studentId in grouped) {
        const termGradesPayload = Object.entries(grouped[studentId]).map(([termId, list]) => ({
          term: termId,
          gradeOfSubject: list.map(item => ({ subjectId: item.subjectId, grade: item.grade }))
        }))

        const payload = { termGrades: termGradesPayload }

        await gradeService.importGrades(studentId, payload)
      }

      toast.update(toastId, {
        render: 'Lưu điểm thành công',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      // Sau khi cập nhật thành công, refetch và CHỜ dữ liệu mới về rồi mới clear buffer
      await mutateGrade()
      setEditedGrades({})
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.message || 'Có lỗi xảy ra khi lưu điểm',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
    }
  }

  const handleOpenUpdateDialog = (studentId: string, subject: Subjects) => {
    const studentGradeRow = gradeData.find(g => g.studentId._id === studentId)

    if (!studentGradeRow) return

    let foundTermGrade: any | null = null

    for (const tg of studentGradeRow.termGrades) {
      if (tg.gradeOfSubject.some(gs => gs.subjectId._id === subject._id)) {
        foundTermGrade = tg
        break
      }
    }

    const existingGradeVal = foundTermGrade
      ? (foundTermGrade.gradeOfSubject.find((gs: any) => gs.subjectId._id === subject._id)?.grade ?? 0)
      : 0

    setUpdateInfo({ studentGradeRow, subject, termGrade: foundTermGrade, gradeValue: existingGradeVal })
    setOpenUpdateDialog(true)
  }

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false)
    setUpdateInfo(null)
  }

  const UpdateGradeDialog: React.FC = () => {
    const {
      control,
      handleSubmit,
      formState: { isValid },
      reset
    } = useForm<{ term: string; grade: number }>({
      mode: 'onChange',
      defaultValues: { term: '', grade: 0 }
    })

    // Khi updateInfo thay đổi, reset form cho phù hợp
    useEffect(() => {
      if (updateInfo) {
        reset({
          term: updateInfo.termGrade ? updateInfo.termGrade.term._id : '',
          grade: updateInfo.gradeValue
        })
      }
    }, [updateInfo, reset])

    if (!openUpdateDialog || !updateInfo) return null

    const onSubmit = handleSubmit(async data => {
      const toastId = toast.loading('Đang cập nhật điểm...')

      try {
        const { studentGradeRow, subject } = updateInfo

        // Kiểm tra xem termGrade đã tồn tại hay chưa
        const targetTermGrade = studentGradeRow.termGrades.find(tg => tg.term._id === data.term)

        let gradeOfSubjectList: { subjectId: string; grade: number }[] = []

        if (targetTermGrade) {
          // clone danh sách hiện có và cập nhật / thêm môn
          gradeOfSubjectList = targetTermGrade.gradeOfSubject.map(gs => ({
            subjectId: gs.subjectId._id,
            grade: gs.subjectId._id === subject._id ? data.grade : gs.grade
          }))

          // nếu môn chưa có thì push
          if (!targetTermGrade.gradeOfSubject.some(gs => gs.subjectId._id === subject._id)) {
            gradeOfSubjectList.push({ subjectId: subject._id, grade: data.grade })
          }
        } else {
          // chưa có termGrade -> tạo mới
          gradeOfSubjectList = [{ subjectId: subject._id, grade: data.grade }]
        }

        const payload = {
          termGrades: [
            {
              term: data.term,
              gradeOfSubject: gradeOfSubjectList
            }
          ]
        }

        await gradeService.updateGrade(
          studentGradeRow._id,
          targetTermGrade ? targetTermGrade._id : 'new',
          payload,
          () => {
            toast.update(toastId, {
              render: 'Cập nhật điểm thành công',
              type: 'success',
              isLoading: false,
              autoClose: 3000
            })
          }
        )

        handleCloseUpdateDialog()
      } catch (error: any) {
        toast.update(toastId, {
          render: error?.message || 'Cập nhật thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    })

    return (
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth='sm'>
        <DialogTitle>Cập nhật điểm</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <Typography>
              {updateInfo.subject.courseCode} - {updateInfo.subject.courseName}
            </Typography>

            <Controller
              control={control}
              name='term'
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={termOptions || []}
                  getOptionLabel={option => `${option.abbreviatName} - ${option.status}`}
                  value={termOptions?.find(t => t._id === field.value) || null}
                  onChange={(_, val) => field.onChange(val?._id || '')}
                  renderInput={params => <CustomTextField {...params} size='small' placeholder='Học kỳ' />}
                />
              )}
            />

            <Controller
              control={control}
              name='grade'
              rules={{ required: true, min: 0, max: 10 }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  size='small'
                  label='Điểm'
                  type='number'
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Đóng</Button>
          <LoadingButton disabled={!isValid} onClick={onSubmit} variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </Dialog>
    )
  }

  // Hủy chỉnh sửa
  const handleCancelEdits = () => {
    if (Object.keys(editedGrades).length === 0) return

    setEditedGrades({})
    toast.info('Đã hủy các thay đổi', { autoClose: 2000 })
  }

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        {/* LEFT: chọn học kỳ + tìm kiếm */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size='small'
            placeholder='Tìm kiếm sinh viên...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>

        {/* CENTER: thông tin trang */}
        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
          Trang {currentPage + 1} / {totalPages} - Tổng: {flattenedData.length} mục
        </Box>

        {/* RIGHT: điều khiển trang + lưu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handlePrevPage} disabled={currentPage === 0 || isLoading} variant='outlined' size='small'>
              Trước
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1 || isLoading}
              variant='outlined'
              size='small'
            >
              Sau
            </Button>
          </Box>
          <Autocomplete
            options={termOptions || []}
            getOptionLabel={option => `${option.abbreviatName} - ${option.status}` || ''}
            value={termOptions?.find((t: any) => t._id === selectedTermId) || null}
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
            loading={false}
          >
            Lưu điểm
          </LoadingButton>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)' }}>
        <Table stickyHeader aria-label='training program table' size='small' sx={{ minWidth: 1200 }}>
          <TableHeader gradeData={filteredGradeData} />
          <TableBody>
            {isLoading
              ? renderSkeleton()
              : paginatedData.map(item => {
                  switch (item.type) {
                    case 'program':
                      return <ProgramRow key={item.data._id} program={item.data} gradeData={filteredGradeData} />
                    case 'category':
                      return (
                        <CategoryRow
                          key={item.data._id}
                          category={item.data}
                          level={item.level}
                          gradeData={filteredGradeData}
                        />
                      )
                    case 'subject':
                      return (
                        <SubjectRow
                          key={item.data._id}
                          subject={item.data}
                          level={item.level}
                          gradesMap={gradesMap}
                          gradeData={filteredGradeData}
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

export default GradeTrainingProgramTable
