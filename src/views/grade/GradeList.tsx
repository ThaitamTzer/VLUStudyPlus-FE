import { useMemo } from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

interface GradeListProps {
  data: any[]
  loading: boolean
}

export default function GradeList({ data }: GradeListProps) {
  // Tạo danh sách các môn học duy nhất từ dữ liệu
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set()

    data.forEach(student => {
      student.termGrades.forEach((term: any) => {
        term.gradeOfSubject.forEach((grade: any) => {
          subjects.add(grade.subjectId.courseName)
        })
      })
    })

    return Array.from(subjects)
  }, [data])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>MSSV</TableCell>
            <TableCell>Họ và tên</TableCell>
            <TableCell>Email</TableCell>
            {uniqueSubjects.map((subject: any) => (
              <TableCell key={subject}>{subject}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(student => (
            <TableRow key={student._id}>
              <TableCell>{student.studentId.userId}</TableCell>
              <TableCell>{student.studentId.userName}</TableCell>
              <TableCell>{student.studentId.mail}</TableCell>
              {uniqueSubjects.map((subject: any) => {
                const grade = student.termGrades
                  .flatMap((term: any) => term.gradeOfSubject)
                  .find((g: any) => g.subjectId.courseName === subject)

                return <TableCell key={`${student._id}-${subject}`}>{grade ? grade.grade : '-'}</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
