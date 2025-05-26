'use client'

import React, { useMemo } from 'react'

import { Card, CardContent, Typography, Grid, Box, Chip, LinearProgress, Stack } from '@mui/material'

import type { GradeType } from '@/types/management/gradeTypes'

interface GradeStatisticsProps {
  gradeData: GradeType[]
}

const GradeStatistics: React.FC<GradeStatisticsProps> = ({ gradeData }) => {
  const statistics = useMemo(() => {
    if (!gradeData.length) return null

    const totalStudents = gradeData.length
    let totalGrades = 0
    let gradeSum = 0
    let excellentCount = 0 // >= 8.5
    let goodCount = 0 // 7.0 - 8.4
    let averageCount = 0 // 5.5 - 6.9
    let belowAverageCount = 0 // 4.0 - 5.4
    let failCount = 0 // < 4.0

    const subjectGrades: { [subjectId: string]: number[] } = {}

    gradeData.forEach(student => {
      student.termGrades.forEach(term => {
        term.gradeOfSubject.forEach(gradeSubject => {
          const grade = gradeSubject.grade
          const subjectId = gradeSubject.subjectId._id

          if (!subjectGrades[subjectId]) {
            subjectGrades[subjectId] = []
          }

          subjectGrades[subjectId].push(grade)
          totalGrades++
          gradeSum += grade

          if (grade >= 8.5) excellentCount++
          else if (grade >= 7.0) goodCount++
          else if (grade >= 5.5) averageCount++
          else if (grade >= 4.0) belowAverageCount++
          else failCount++
        })
      })
    })

    const averageGrade = totalGrades > 0 ? gradeSum / totalGrades : 0
    const uniqueSubjects = Object.keys(subjectGrades).length

    return {
      totalStudents,
      uniqueSubjects,
      totalGrades,
      averageGrade,
      excellentCount,
      goodCount,
      averageCount,
      belowAverageCount,
      failCount
    }
  }, [gradeData])

  if (!statistics) {
    return (
      <Card>
        <CardContent>
          <Typography variant='h6'>Thống kê điểm số</Typography>
          <Typography color='text.secondary'>Không có dữ liệu để thống kê</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Thống kê điểm số lớp
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                Thông tin chung
              </Typography>
              <Stack spacing={2}>
                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='body2'>Tổng số sinh viên:</Typography>
                  <Chip label={statistics.totalStudents} color='primary' size='small' />
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='body2'>Số môn học:</Typography>
                  <Chip label={statistics.uniqueSubjects} color='info' size='small' />
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='body2'>Tổng số điểm:</Typography>
                  <Chip label={statistics.totalGrades} color='secondary' size='small' />
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='body2'>Điểm trung bình:</Typography>
                  <Chip
                    label={statistics.averageGrade.toFixed(2)}
                    color={
                      statistics.averageGrade >= 7 ? 'success' : statistics.averageGrade >= 5.5 ? 'warning' : 'error'
                    }
                    size='small'
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                Phân bố điểm số
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box display='flex' justifyContent='space-between' mb={1}>
                    <Typography variant='body2'>Xuất sắc (≥8.5)</Typography>
                    <Typography variant='body2'>
                      {statistics.excellentCount} (
                      {((statistics.excellentCount / statistics.totalGrades) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={(statistics.excellentCount / statistics.totalGrades) * 100}
                    color='success'
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box>
                  <Box display='flex' justifyContent='space-between' mb={1}>
                    <Typography variant='body2'>Giỏi (7.0-8.4)</Typography>
                    <Typography variant='body2'>
                      {statistics.goodCount} ({((statistics.goodCount / statistics.totalGrades) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={(statistics.goodCount / statistics.totalGrades) * 100}
                    color='info'
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box>
                  <Box display='flex' justifyContent='space-between' mb={1}>
                    <Typography variant='body2'>Khá (5.5-6.9)</Typography>
                    <Typography variant='body2'>
                      {statistics.averageCount} ({((statistics.averageCount / statistics.totalGrades) * 100).toFixed(1)}
                      %)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={(statistics.averageCount / statistics.totalGrades) * 100}
                    color='warning'
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box>
                  <Box display='flex' justifyContent='space-between' mb={1}>
                    <Typography variant='body2'>Yếu (&lt;5.5)</Typography>
                    <Typography variant='body2'>
                      {statistics.belowAverageCount + statistics.failCount} (
                      {(((statistics.belowAverageCount + statistics.failCount) / statistics.totalGrades) * 100).toFixed(
                        1
                      )}
                      %)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={((statistics.belowAverageCount + statistics.failCount) / statistics.totalGrades) * 100}
                    color='error'
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default GradeStatistics
