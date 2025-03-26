'use client'

import React from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'

import type { Categories, Subjects, TrainingProgramByFrame } from '@/types/management/trainningProgramType'

import { useSettings } from '@/@core/hooks/useSettings'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'

interface SubjectRowProps {
  subject: Subjects
  level: number
}

const SubjectRow: React.FC<SubjectRowProps> = ({ subject, level }) => {
  return (
    <StyledTableRow>
      <TableCell sx={{ paddingLeft: `${level * 9}px` }}>
        {subject.courseCode} - {subject.courseName}
      </TableCell>
      <TableCell align='right'>{subject.credits}</TableCell>
      <TableCell align='right'>{subject.LT}</TableCell>
      <TableCell align='right'>{subject.TH}</TableCell>
      <TableCell align='right'>{subject.TT}</TableCell>
      <TableCell>{subject.isRequire === 'true' ? 'Bắt buộc' : 'Tự chọn'}</TableCell>
      <TableCell>{subject.prerequisites}</TableCell>
      <TableCell>{subject.preConditions}</TableCell>
      <TableCell>{subject.implementationSemester}</TableCell>
    </StyledTableRow>
  )
}

interface CategorySectionProps {
  category: Categories
  level: number
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, level }) => {
  const { settings } = useSettings()

  return (
    <>
      {/* Header row for the category */}
      <TableRow>
        <TableCell
          colSpan={9}
          sx={{
            paddingLeft: `${level * 9}px`,
            fontWeight: 'bold',
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          {category.titleN} {category.titleV} ({category.credits} tín chỉ)
        </TableCell>
      </TableRow>

      {/* Subjects in this category */}
      {category.subjects?.map(subject => <SubjectRow key={subject._id} subject={subject} level={level + 1} />)}

      {/* Sub-categories */}
      {category.categoriesC3?.map(subCategory => (
        <CategorySection key={subCategory._id} category={subCategory} level={level + 1} />
      ))}
    </>
  )
}

interface FlatTrainingProgramTableProps {
  data: TrainingProgramByFrame[]
  isLoading?: boolean
}

const FlatTrainingProgramTable: React.FC<FlatTrainingProgramTableProps> = ({ data, isLoading }) => {
  const { settings } = useSettings()

  return (
    <TableContainer>
      <Table aria-label='training program table' size='small' sx={{ minWidth: 1000 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
              textTransform: 'uppercase'
            }}
          >
            <TableCell width={500} sx={{ fontWeight: 'bold' }}>
              Môn học
            </TableCell>
            <TableCell align='right' sx={{ fontWeight: 'bold' }}>
              Tín chỉ
            </TableCell>
            <TableCell align='right' sx={{ fontWeight: 'bold' }}>
              STLT
            </TableCell>
            <TableCell align='right' sx={{ fontWeight: 'bold' }}>
              STTH
            </TableCell>
            <TableCell align='right' sx={{ fontWeight: 'bold' }}>
              STTT
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Loại môn</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>ĐK Tuyên Quyết</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>ĐK học trước</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Học kỳ triển khai</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data?.map(program => (
            <React.Fragment key={program._id}>
              {/* Program header */}
              <TableRow
                sx={{
                  backgroundColor: settings.mode === 'dark' ? '#4D55CC' : '#578FCA'
                }}
              >
                <TableCell colSpan={9} sx={{ fontWeight: 'bold' }}>
                  {program.titleN} {program.titleV} ({program.credits} tín chỉ)
                </TableCell>
              </TableRow>

              {/* Subjects directly under program */}
              {program.subjects?.map(subject => <SubjectRow key={subject._id} subject={subject} level={2} />)}

              {/* Categories under program */}
              {program.categories?.map(category => (
                <CategorySection key={category._id} category={category} level={3} />
              ))}
            </React.Fragment>
          ))}
          {isLoading ? (
            <TableLoading colSpan={20} />
          ) : (
            <TableNoData notFound={data?.length === 0} title={'Không tìm dữ liệu nào'} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default FlatTrainingProgramTable
