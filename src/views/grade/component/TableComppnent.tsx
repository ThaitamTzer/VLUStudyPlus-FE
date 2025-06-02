import { memo } from 'react'

import { Box, Typography, TableCell, TableRow } from '@mui/material'

import type { Categories, Subjects, TrainingProgramByFrame } from '@/types/management/trainningProgramType'

import { useSettings } from '@/@core/hooks/useSettings'
import type { GradeType, StudentType } from '@/types/management/gradeTypes'

// Component cho hàng chương trình
export const ProgramRow = memo(
  ({ program, gradeData }: { program: TrainingProgramByFrame; gradeData: GradeType[] }) => {
    const { settings } = useSettings()

    return (
      <TableRow
        sx={{
          backgroundColor: settings.mode === 'dark' ? '#475569' : '#93c5fd',
          position: 'sticky'
        }}
      >
        <TableCell
          key={`${program._id}-program`}
          sx={{
            position: 'sticky',
            left: 0,
            zIndex: 9,
            backgroundColor: settings.mode === 'dark' ? '#475569' : '#93c5fd'
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
)

ProgramRow.displayName = 'ProgramRow'

export const CategoryRow = memo(
  ({ category, level, gradeData }: { category: Categories; level: number; gradeData: GradeType[] }) => {
    const { settings } = useSettings()

    return (
      <TableRow
        sx={{
          paddingLeft: `${level * 9}px`,
          backgroundColor: settings.mode === 'dark' ? '#334155' : '#93c5fd'
        }}
      >
        <TableCell
          sx={{
            position: 'sticky',
            left: 0,
            zIndex: 6,
            backgroundColor: settings.mode === 'dark' ? '#334155' : '#bfdbfe'
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
            backgroundColor: settings.mode === 'dark' ? '#334155' : '#bfdbfe'
          }}
        >
          <Typography variant='body2'>{category.credits || ''}</Typography>
        </TableCell>
        <TableCell
          colSpan={2 + gradeData.length}
          sx={{
            position: 'sticky',
            left: 450.5,
            zIndex: 4,
            backgroundColor: settings.mode === 'dark' ? '#334155' : '#bfdbfe'
          }}
        ></TableCell>
      </TableRow>
    )
  }
)

CategoryRow.displayName = 'CategoryRow'

interface GradeInfo {
  [studentId: string]: { grade: number; status: string }
}

// Component cho hàng môn học
export const SubjectRow = memo(
  ({
    subject,
    level,
    gradesMap,
    gradeData,
    renderGradeCell
  }: {
    subject: Subjects
    level: number
    gradesMap: Map<string, GradeInfo>
    gradeData: GradeType[]
    renderGradeCell: (
      grade: number | undefined,
      status: string | undefined,
      key: string,
      subject: Subjects,
      subjectId: string,
      studentId: string,
      student: StudentType
    ) => React.ReactNode
  }) => {
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
              {subject.courseCode} - {subject.courseName}
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
            {subject.isRequire ? 'BB' : 'TC'}
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            position: 'sticky',
            left: 570.5,
            zIndex: 6,
            overflow: 'hidden',
            boxShadow: '10px 0 10px -10px rgba(0, 0, 0, 0.3)',
            backgroundColor: theme => theme.palette.background.paper
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            {subject.preConditions || '-'}
          </Typography>
        </TableCell>
        {gradeData.map(student => {
          const studentGrade = subjectGrades[student.studentId._id]

          return (
            <TableCell key={`${subject._id}-${student.studentId._id}`} align='center'>
              {renderGradeCell(
                studentGrade?.grade,
                studentGrade?.status,
                `${subject._id}-${student.studentId._id}`,
                subject,
                subject._id,
                student.studentId._id,
                student.studentId
              )}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }
)

SubjectRow.displayName = 'SubjectRow'
