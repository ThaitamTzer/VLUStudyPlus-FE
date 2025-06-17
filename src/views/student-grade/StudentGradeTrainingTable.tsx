'use client'

import { Fragment, memo, useCallback, useMemo } from 'react'

import { Table, TableBody, TableContainer, Chip, Paper } from '@mui/material'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'
import type { GradeTypeById } from '@/types/management/gradeTypes'
import TableNoData from '@/components/table/TableNotFound'
import CustomIconButton from '@/@core/components/mui/IconButton'
import Iconify from '@/components/iconify'
import { CategoryRow, ProgramRow, SubjectRow } from './component/TableComppnent'
import { TableHeader } from './component/TableHeader'
import { useGradeStore } from '@/stores/grade/grade.store'
import { useAuth } from '@/hooks/useAuth'

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

  // Tạo fake gradeData để hiển thị cột sinh viên khi không có dữ liệu
  const displayGradeData = useMemo(() => {
    if (gradeData) return [gradeData]

    // Tạo fake data để hiển thị UI
    return [
      {
        _id: '',
        studentId: user?.userId || 'current-user',
        termGrades: [],
        TCTL_SV: 0,
        TCTL_CD: 0,
        TCN: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any
    ]
  }, [gradeData, user?.userId])

  const handleUpdateGrade = useCallback((subjectId: string, studentId: string, subject: Subjects) => {
    // Sinh viên nhập điểm mới - mở modal ImportGradeModal
    const { toogleImportGradeStudent, setSubjectId, setSubject } = useGradeStore.getState()

    // Lưu thông tin môn học được chọn vào store
    setSubjectId(subjectId)
    setSubject(subject)

    toogleImportGradeStudent()
  }, [])

  // Handle click vào điểm hiện có để cập nhật
  const handleUpdateExistingGrade = useCallback(
    (subjectId: string, studentId: string, subject: Subjects) => {
      if (!gradeData?.termGrades) {
        console.error('Không tìm thấy dữ liệu điểm của sinh viên')

        return
      }

      // Tìm termGrade chứa subjectId
      let foundTermGrade = null

      for (const termGrade of gradeData.termGrades) {
        const gradeSubjectIndex = termGrade.gradeOfSubject.findIndex(
          gradeSubject => gradeSubject.subjectId._id === subjectId
        )

        if (gradeSubjectIndex !== -1) {
          foundTermGrade = termGrade
          break
        }
      }

      if (foundTermGrade) {
        // Sinh viên cập nhật điểm hiện có - mở modal UpdateGradeModal với termGrade
        const { toogleUpdateGradeStudent, setTermGradeUpdate, setSubject, setSubjectId } = useGradeStore.getState()

        // Lưu thông tin môn học và termGrade vào store
        setSubject(subject)
        setSubjectId(subjectId)
        setTermGradeUpdate(foundTermGrade)
        toogleUpdateGradeStudent()
      } else {
        console.error('Không tìm thấy termGrade chứa môn học này')
      }
    },
    [gradeData]
  )

  // Tạo map điểm số theo subjectId với memoization tối ưu
  const gradesMap = useMemo(() => {
    if (!gradeData?.termGrades) return new Map<string, GradeInfo>()

    const map = new Map<string, GradeInfo>()
    const studentId = gradeData.studentId

    gradeData.termGrades.forEach(termGrade => {
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
      studentId: string
    ) => {
      if (grade === undefined)
        return (
          <CustomIconButton
            size='small'
            className='text-green-700'
            key={key}
            onClick={() => {
              handleUpdateGrade(subjectId, studentId || user?.userId || 'current-user', subject)
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
          onClick={() => handleUpdateExistingGrade(subjectId, studentId || user?.userId || 'current-user', subject)}
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
    [handleUpdateGrade, handleUpdateExistingGrade, user]
  )

  // Memoized categories renderer để tránh re-render không cần thiết
  const renderCategories = useCallback(
    (categories: Categories[], level: number) => {
      return categories.map(category => {
        return (
          <Fragment key={category._id}>
            <CategoryRow category={category} level={level} gradeData={displayGradeData} />

            {/* Subjects trong category */}
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

            {/* Subcategories */}
            {category.categoriesC3 && renderCategories(category.categoriesC3, level + 1)}
          </Fragment>
        )
      })
    },
    [displayGradeData, gradesMap, renderGradeCell]
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

  return (
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
          {flattenedData.length === 0 && <TableNoData notFound={true} title='Không có dữ liệu chương trình đào tạo' />}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(StudentGradeTrainingTable)
