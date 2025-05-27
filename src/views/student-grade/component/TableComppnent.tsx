import { memo } from 'react'

import { Box, Typography, TableCell, TableRow } from '@mui/material'

import type { Categories, Subjects, TrainingProgramByFrame } from '@/types/management/trainningProgramType'

import { useSettings } from '@/@core/hooks/useSettings'
import type { GradeTypeById } from '@/types/management/gradeTypes'

// Component cho hàng chương trình
export const ProgramRow = memo(
  ({ program, gradeData }: { program: TrainingProgramByFrame; gradeData: GradeTypeById[] }) => {
    const { settings } = useSettings()

    return (
      <TableRow
        sx={{
          backgroundColor: settings.mode === 'dark' ? '#4D55CC' : '#578FCA',
          position: 'sticky'
        }}
      >
        <TableCell
          key={`${program._id}-program`}
          sx={{
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
)

ProgramRow.displayName = 'ProgramRow'

export const CategoryRow = memo(
  ({ category, level, gradeData }: { category: Categories; level: number; gradeData: GradeTypeById[] }) => {
    const { settings } = useSettings()

    return (
      <TableRow
        sx={{
          paddingLeft: `${level * 9}px`,
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        <TableCell
          sx={{
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
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          <Typography variant='body2'>{category.credits || ''}</Typography>
        </TableCell>
        <TableCell
          colSpan={2 + gradeData.length}
          sx={{
            overflow: 'hidden'
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
    gradeData: GradeTypeById[]
    renderGradeCell: (
      grade: number | undefined,
      status: string | undefined,
      key: string,
      subject: Subjects,
      subjectId: string,
      studentId: string
    ) => React.ReactNode
  }) => {
    const subjectGrades = gradesMap.get(subject._id) || {}

    return (
      <TableRow hover>
        <TableCell>
          <Box sx={{ pl: level * 2 + 1 }}>
            <Typography variant='body2' fontWeight='medium'>
              {subject.courseName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align='center'>
          <Typography variant='body2'>{subject.credits}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant='body2' color='text.secondary'>
            {subject.courseCode || '-'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant='body2' color='text.secondary'>
            {subject.prerequisites || '-'}
          </Typography>
        </TableCell>
        {gradeData.map(student => {
          const studentGrade = subjectGrades[student.studentId]

          return (
            <TableCell key={`${subject._id}-${student.studentId}`} align='center'>
              {renderGradeCell(
                studentGrade?.grade,
                studentGrade?.status,
                `${subject._id}-${student.studentId}`,
                subject,
                subject._id,
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
