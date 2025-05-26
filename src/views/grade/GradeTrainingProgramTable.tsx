'use client'

import React from 'react'

import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Stack,
  Paper
} from '@mui/material'
import type { KeyedMutator } from 'swr'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'
import type { GradeType } from '@/types/management/gradeTypes'
import TableNoData from '@/components/table/TableNotFound'
import { useSettings } from '@/@core/hooks/useSettings'
import StyledTableRow from '@/components/table/StyledTableRow'

interface GradeTrainingProgramTableProps {
  trainingProgramData: TrainingProgramByFrame[]
  gradeData: GradeType[]
  mutate?: KeyedMutator<any>
}

interface GradeInfo {
  [studentId: string]: { grade: number; status: string }
}

const GradeTrainingProgramTable: React.FC<GradeTrainingProgramTableProps> = ({ trainingProgramData, gradeData }) => {
  const { settings } = useSettings()

  // Tạo map điểm số theo subjectId và studentId
  const gradesMap = React.useMemo(() => {
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

  const renderGradeCell = (grade: number | undefined, status: string | undefined) => {
    if (grade === undefined) return '-'

    let color: 'success' | 'warning' | 'error' | 'default' = 'default'

    if (grade >= 8) color = 'success'
    else if (grade >= 6.5) color = 'warning'
    else if (grade < 5) color = 'error'

    return <Chip label={grade} color={color} size='small' variant={status === 'x' ? 'filled' : 'outlined'} />
  }

  const UserInfo = (student: GradeType['studentId']) => (
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

  // Component cho hàng chương trình
  const ProgramRow = ({ program }: { program: TrainingProgramByFrame }) => {
    return (
      <TableRow
        sx={{
          backgroundColor: settings.mode === 'dark' ? '#4D55CC' : '#578FCA',
          position: 'sticky'
        }}
      >
        <TableCell
          sx={{
            position: 'sticky',
            left: 0,
            zIndex: 9,
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
            <Typography variant='subtitle1' fontWeight='bold' color={settings.mode === 'dark' ? 'white' : 'black'}>
              {program.titleN} {program.titleV}
            </Typography>
          </Box>
        </TableCell>
        <TableCell
          colSpan={4 + gradeData.length}
          sx={{
            position: 'sticky',
            left: 0,
            zIndex: 6
          }}
        ></TableCell>
      </TableRow>
    )
  }

  // Component cho hàng danh mục
  const CategoryRow = ({ category, level }: { category: Categories; level: number }) => {
    return (
      <TableRow
        sx={{
          paddingLeft: `${level * 9}px`,
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        <TableCell
          sx={{
            position: 'sticky',
            left: 0,
            zIndex: 6,
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', pl: level * 2 + 1 }}>
            <Typography variant='subtitle2' fontWeight='medium'>
              {category.titleN} {category.titleV}
            </Typography>
          </Box>
        </TableCell>
        <TableCell
          align='center'
          sx={{
            position: 'sticky',
            left: 430.5,
            zIndex: 6,
            overflow: 'hidden',
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          <Typography variant='body2'>{category.credits || ''}</Typography>
        </TableCell>
        <TableCell
          colSpan={2 + gradeData.length}
          sx={{
            position: 'sticky',
            left: 430.5,
            zIndex: 5,
            overflow: 'hidden'
          }}
        ></TableCell>
      </TableRow>
    )
  }

  // Component cho hàng môn học
  const SubjectRow = ({ subject, level }: { subject: Subjects; level: number }) => {
    const subjectGrades = gradesMap.get(subject._id) || {}

    return (
      <TableRow hover>
        <TableCell
          sx={{
            position: 'sticky',
            left: 0,
            zIndex: 6,
            backgroundColor: theme => theme.palette.background.paper
          }}
        >
          <Box sx={{ pl: level * 2 + 1 }}>
            <Typography variant='body2' fontWeight='medium'>
              {subject.courseName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell
          align='center'
          sx={{
            position: 'sticky',
            left: 430.5,
            zIndex: 6,
            backgroundColor: theme => theme.palette.background.paper
          }}
        >
          <Typography variant='body2'>{subject.credits}</Typography>
        </TableCell>
        <TableCell
          sx={{
            position: 'sticky',
            left: 480.5,
            zIndex: 6,
            overflow: 'hidden',
            backgroundColor: theme => theme.palette.background.paper
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            {subject.courseCode || '-'}
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            position: 'sticky',
            left: 604.5,
            zIndex: 6,
            overflow: 'hidden',
            boxShadow: '10px 0 10px -10px rgba(0, 0, 0, 0.3)',
            backgroundColor: theme => theme.palette.background.paper
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            {subject.prerequisites || '-'}
          </Typography>
        </TableCell>
        {gradeData.map(student => {
          const studentGrade = subjectGrades[student.studentId._id]

          return (
            <TableCell key={`${subject._id}-${student._id}`} align='center'>
              {renderGradeCell(studentGrade?.grade, studentGrade?.status)}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }

  // Hàm đệ quy để render categories
  const renderCategories = (categories: Categories[], level: number) => {
    return categories.map(category => {
      return (
        <React.Fragment key={category._id}>
          <CategoryRow category={category} level={level} />

          {/* Subjects trong category */}
          {category.subjects?.map(subject => <SubjectRow key={subject._id} subject={subject} level={level + 1} />)}

          {/* Subcategories */}
          {category.categoriesC3 && renderCategories(category.categoriesC3, level + 1)}
        </React.Fragment>
      )
    })
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)' }}>
      <Table stickyHeader aria-label='training program table' size='small' sx={{ minWidth: 1200 }}>
        <TableHead>
          <StyledTableRow>
            <TableCell
              sx={{
                minWidth: 430,
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase',
                position: 'sticky',
                left: 0,
                zIndex: 9
              }}
            >
              Tên môn học / Danh mục
            </TableCell>
            <TableCell
              sx={{
                minWidth: 50,
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase',
                position: 'sticky',
                left: 430.5,
                zIndex: 9
              }}
            >
              TC
            </TableCell>
            <TableCell
              sx={{
                minWidth: 120,
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase',
                position: 'sticky',
                left: 480.5,
                zIndex: 9
              }}
            >
              Mã MH
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                textTransform: 'uppercase',
                position: 'sticky',
                left: 604,
                zIndex: 9,
                boxShadow: '10px 0 10px -10px rgba(0, 0, 0, 0.3)'
              }}
            >
              ĐKTQ
            </TableCell>
            {gradeData.map(student => (
              <TableCell
                key={student._id}
                sx={{
                  minWidth: 120,
                  backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
                  textTransform: 'uppercase',
                  zIndex: 8
                }}
                align='center'
              >
                {UserInfo(student.studentId)}
              </TableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {trainingProgramData.map(program => {
            return (
              <React.Fragment key={program._id}>
                <ProgramRow program={program} />

                {/* Subjects trực tiếp trong program */}
                {program.subjects?.map(subject => <SubjectRow key={subject._id} subject={subject} level={1} />)}

                {/* Categories trong program */}
                {program.categories && renderCategories(program.categories, 1)}
              </React.Fragment>
            )
          })}
          {trainingProgramData.length === 0 && (
            <TableNoData notFound={true} title='Không có dữ liệu chương trình đào tạo' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default GradeTrainingProgramTable
