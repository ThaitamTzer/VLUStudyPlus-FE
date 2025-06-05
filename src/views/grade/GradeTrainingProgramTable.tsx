'use client'

import { Fragment, memo, useCallback, useMemo, useState } from 'react'

import { Table, TableBody, TableContainer, Chip, Paper, Button, Box, Skeleton, TextField } from '@mui/material'

import { useDebounce } from 'react-use'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'
import type { GradeType, StudentType } from '@/types/management/gradeTypes'
import TableNoData from '@/components/table/TableNotFound'
import CustomIconButton from '@/@core/components/mui/IconButton'
import Iconify from '@/components/iconify'
import { CategoryRow, ProgramRow, SubjectRow } from './component/TableComppnent'
import { TableHeader } from './component/TableHeader'
import { useGradeStore } from '@/stores/grade/grade.store'

interface GradeTrainingProgramTableProps {
  trainingProgramData: TrainingProgramByFrame[]
  gradeData: GradeType[]
}

interface GradeInfo {
  [studentId: string]: { grade: number; status: string }
}

const ITEMS_PER_PAGE = 50 // Phân trang để tối ưu hiệu suất

const GradeTrainingProgramTable: React.FC<GradeTrainingProgramTableProps> = ({ trainingProgramData, gradeData }) => {
  const {
    toogleUpdateGrade,
    setSubjectId,
    setStudentId,
    setSubject,
    setStudentGrade,
    toogleUpdateExistingGrade,
    setCurrentTermGrade,
    setCurrentGradeSubjectIndex,
    setIsUpdatingExisting,
    setCurrentGradeId,
    setCurrentTermGradeId,
    toogleUpdateAdvise,
    setCurrentAdviseGradeId,
    setCurrentAdviseTermId,
    setCurrentAdvise,
    setCurrentGradeData
  } = useGradeStore()

  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // State cho tìm kiếm sinh viên
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

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

  const handleUpdateGrade = useCallback(
    (subjectId: string, studentId: string, subject: Subjects, student: StudentType) => {
      toogleUpdateGrade()
      setSubjectId(subjectId)
      setStudentId(studentId)
      setSubject(subject)
      setStudentGrade(student)
    },
    [toogleUpdateGrade, setSubjectId, setStudentId, setSubject, setStudentGrade]
  )

  // Handle click vào điểm hiện có để cập nhật
  const handleUpdateExistingGrade = useCallback(
    (subjectId: string, studentId: string, subject: Subjects, student: StudentType) => {
      // Tìm student data trong gradeData
      const studentGradeData = gradeData.find(grade => grade.studentId._id === studentId)

      if (!studentGradeData) {
        console.error('Không tìm thấy dữ liệu điểm của sinh viên')

        return
      }

      // Tìm termGrade chứa subjectId
      let foundTermGrade = null
      let foundGradeSubjectIndex = -1

      for (const termGrade of studentGradeData.termGrades) {
        const gradeSubjectIndex = termGrade.gradeOfSubject.findIndex(
          gradeSubject => gradeSubject.subjectId._id === subjectId
        )

        if (gradeSubjectIndex !== -1) {
          foundTermGrade = termGrade
          foundGradeSubjectIndex = gradeSubjectIndex
          break
        }
      }

      if (foundTermGrade && foundGradeSubjectIndex !== -1) {
        // Set thông tin cần thiết vào store
        setSubjectId(subjectId)
        setStudentId(studentId)
        setSubject(subject)
        setStudentGrade(student)
        setCurrentTermGrade(foundTermGrade)
        setCurrentGradeSubjectIndex(foundGradeSubjectIndex)
        setCurrentGradeId(studentGradeData._id) // Set gradeId
        setCurrentTermGradeId(foundTermGrade._id) // Set termGradeId
        setIsUpdatingExisting(true)
        toogleUpdateExistingGrade()
      } else {
        console.error('Không tìm thấy termGrade chứa môn học này')
      }
    },
    [
      gradeData,
      setSubjectId,
      setStudentId,
      setSubject,
      setStudentGrade,
      setCurrentTermGrade,
      setCurrentGradeSubjectIndex,
      setIsUpdatingExisting,
      toogleUpdateExistingGrade,
      setCurrentGradeId,
      setCurrentTermGradeId
    ]
  )

  // Handle update advise
  const handleUpdateAdvise = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (student: StudentType, gradeId: string, _termGrades: any[], data: GradeType) => {
      setStudentGrade(student)
      setCurrentAdviseGradeId(gradeId)

      // Reset other states - will be set when user selects a term
      setCurrentAdviseTermId('')
      setCurrentAdvise('')
      setCurrentTermGrade(null as any)
      setCurrentGradeData(data)
      toogleUpdateAdvise()
    },
    [
      setStudentGrade,
      setCurrentAdviseGradeId,
      setCurrentAdviseTermId,
      setCurrentAdvise,
      setCurrentTermGrade,
      toogleUpdateAdvise,
      setCurrentGradeData
    ]
  )

  // Tạo map điểm số theo subjectId và studentId với memoization tối ưu
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

    return map
  }, [gradeData])

  // Memoized render grade cell với performance optimization
  const renderGradeCell = useCallback(
    (
      grade: number | undefined,
      status: string | undefined,
      key: string,
      subject: Subjects,
      subjectId: string,
      studentId: string,
      student: StudentType
    ) => {
      if (grade === undefined)
        return (
          <CustomIconButton
            size='small'
            className='text-green-700'
            key={key}
            onClick={() => {
              handleUpdateGrade(subjectId, studentId, subject, student)
            }}
          >
            <Iconify icon='tabler:edit' />
          </CustomIconButton>
        )

      let color: 'success' | 'warning' | 'error' | 'default' = 'default'

      if (grade >= 8) color = 'success'
      else if (grade >= 6.5) color = 'warning'
      else if (grade < 5) color = 'error'

      return (
        <Chip
          label={grade}
          color={color}
          size='small'
          variant={status === 'x' ? 'filled' : 'filled'}
          onClick={() => handleUpdateExistingGrade(subjectId, studentId, subject, student)}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        />
      )
    },
    [handleUpdateGrade, handleUpdateExistingGrade]
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

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          size='small'
          placeholder='Tìm kiếm sinh viên...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <div>
          Trang {currentPage + 1} / {totalPages} - Tổng: {flattenedData.length} mục
        </div>
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
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)' }}>
        <Table stickyHeader aria-label='training program table' size='small' sx={{ minWidth: 1200 }}>
          <TableHeader gradeData={filteredGradeData} onUpdateAdvise={handleUpdateAdvise} />
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
    </>
  )
}

export default memo(GradeTrainingProgramTable)
