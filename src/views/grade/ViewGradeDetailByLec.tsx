'use client'

import { useCallback } from 'react'

import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Skeleton,
  CardHeader,
  Tooltip,
  IconButton
} from '@mui/material'

import useSWR from 'swr'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'
import gradeService from '@/services/grade.service'
import Iconify from '@/components/iconify'
import type { TermGradesType } from '@/types/management/gradeTypes'

export default function ViewGradeDetailByLec() {
  const { openViewGradeDetail, toogleViewGradeDetail, idGrade, gradeDetail, toogleUpdateGradeDetail, setTermGrade } =
    useGradeStore()

  const handleClose = useCallback(() => {
    toogleViewGradeDetail()
  }, [toogleViewGradeDetail])

  const { data, isValidating, isLoading } = useSWR(
    idGrade ? `/api/grade/view-grade-detail-by-lec/${idGrade}` : null,
    () => gradeService.getGradeById(idGrade)
  )

  const handleUpdateGradeDetail = useCallback(
    (termGrade: TermGradesType) => {
      setTermGrade(termGrade)
      toogleUpdateGradeDetail()
      console.log(termGrade)
    },
    [toogleUpdateGradeDetail, setTermGrade]
  )

  const renderGradeStatus = (status: string) => {
    switch (status) {
      case 'x':
        return <Typography color='success.main'>Đạt</Typography>
      case 'f':
        return <Typography color='error.main'>Không đạt</Typography>
      default:
        return <Typography color='warning.main'>Chưa xác định</Typography>
    }
  }

  const renderLoadingSkeleton = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant='h6' gutterBottom>
          <Skeleton width={200} />
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map(item => (
            <Grid item xs={12} md={4} key={item}>
              <Skeleton variant='text' width='80%' />
              <Skeleton variant='text' width='40%' />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant='h6' gutterBottom>
          <Skeleton width={250} />
        </Typography>
        {[1, 2].map(term => (
          <Card key={term} sx={{ mb: 3 }}>
            <CardContent>
              <Skeleton variant='text' width='60%' />
              <Skeleton variant='text' width='40%' />
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[1, 2, 3, 4, 5].map(col => (
                        <TableCell key={col}>
                          <Skeleton variant='text' />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2].map(row => (
                      <TableRow key={row}>
                        {[1, 2, 3, 4, 5].map(col => (
                          <TableCell key={col}>
                            <Skeleton variant='text' />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  )

  return (
    <>
      <CustomDialog
        open={openViewGradeDetail}
        onClose={handleClose}
        title={`Bảng điểm của ${gradeDetail?.studentId.userName}`}
        maxWidth='md'
        fullWidth
        actions={
          <Button variant='contained' color='error' onClick={handleClose}>
            Đóng
          </Button>
        }
      >
        <Card>
          <CardContent>
            {isLoading || isValidating ? (
              renderLoadingSkeleton()
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom>
                    Thông tin tổng quan
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant='subtitle2' color='text.secondary'>
                        Tín chỉ tích lũy cần đạt:
                      </Typography>
                      <Typography variant='body1'>{data?.TCTL_CD || 0}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant='subtitle2' color='text.secondary'>
                        Tín chỉ tích lũy hiện tại:
                      </Typography>
                      <Typography variant='body1'>{data?.TCTL_SV || 0}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant='subtitle2' color='text.secondary'>
                        Tổng số tín chỉ nợ:
                      </Typography>
                      <Typography variant='body1'>{data?.TCN || 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='h6' gutterBottom>
                    Chi tiết điểm theo học kỳ
                  </Typography>
                  {data?.termGrades.map(termGrade => (
                    <Card key={termGrade._id} sx={{ mb: 3 }}>
                      <CardHeader
                        title={
                          <Typography variant='subtitle1' color='primary' gutterBottom>
                            {termGrade.term.termName} ({termGrade.term.abbreviatName})
                          </Typography>
                        }
                        subheader={
                          <Typography variant='body2' color='text.secondary' gutterBottom>
                            Năm học: {termGrade.term.academicYear}
                          </Typography>
                        }
                        sx={{
                          pb: 0
                        }}
                        action={
                          <Tooltip title='Cập nhật điểm'>
                            <IconButton size='medium' onClick={() => handleUpdateGradeDetail(termGrade)}>
                              <Iconify icon='mage:edit-fill' color='#f1c40f' />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                      <CardContent>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Mã môn học</TableCell>
                                <TableCell>Tên môn học</TableCell>
                                <TableCell align='center'>Số tín chỉ</TableCell>
                                <TableCell align='center'>Điểm</TableCell>
                                <TableCell align='center'>Trạng thái</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {termGrade.gradeOfSubject.map(subject => (
                                <TableRow key={subject._id}>
                                  <TableCell>{subject.subjectId.courseCode}</TableCell>
                                  <TableCell>{subject.subjectId.courseName}</TableCell>
                                  <TableCell align='center'>{subject.subjectId.credits}</TableCell>
                                  <TableCell align='center'>{subject.grade}</TableCell>
                                  <TableCell align='center'>{renderGradeStatus(subject.status)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </CustomDialog>
    </>
  )
}
