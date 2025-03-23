'use client'

import { useCallback } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  CardHeader,
  Tooltip,
  Divider
} from '@mui/material'

import useSWR from 'swr'

import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'
import PageHeader from '@/components/page-header'
import { useStudentAcedemicProcessStore } from '@/stores/studentAcedemicProcess.store'
import CustomIconButton from '@/@core/components/mui/IconButton'
import Iconify from '@/components/iconify'
import type { ProcessingType } from '@/types/management/learnProcessType'
import StudentViewDetailCommitmentForm from './studentViewDetailCommitmentForm'
import AddCommitmentFormProcess from './addCommitmentFormProcess'

export default function StudentAcedemicProcessPage() {
  const { data: studentData, mutate } = useSWR(
    '/api/academic-processing/view-list-academicProcessing-of-student',
    studentAcedemicProcessService.getStudentAcedemicProcess,
    {
      revalidateOnMount: true
    }
  )

  const { toogleAddCommitmentForm, setIdProcess, setProcessObj, toogleStudentViewDetailCommitmentForm } =
    useStudentAcedemicProcessStore()

  const handleAddCommitment = useCallback(
    (id: string) => {
      setIdProcess(id)
      toogleAddCommitmentForm()
    },
    [setIdProcess, toogleAddCommitmentForm]
  )

  const handleOpenViewDetailCommitmentForm = useCallback(
    (processObj: ProcessingType) => {
      setProcessObj(processObj)
      toogleStudentViewDetailCommitmentForm()
    },
    [setProcessObj, toogleStudentViewDetailCommitmentForm]
  )

  const renderCommitmentStatus = (student: any) => {
    if (student.commitment) {
      return <p className='text-success'>Đã làm đơn</p>
    }

    if (student.processingResult?.commitment === undefined) {
      return <p className='text-info'>Chờ CVHT xử lý</p>
    }

    if (student.processingResult?.commitment) {
      return <p className='text-warning'>Sinh viên chưa làm đơn</p>
    }

    return <p>Sinh viên không cần làm đơn</p>
  }

  return (
    <>
      <AddCommitmentFormProcess mutate={mutate} />
      <Card
        variant='outlined'
        sx={{
          padding: 7
        }}
      >
        <PageHeader title='Xử lý học tập của sinh viên' />
        <Grid container spacing={3} mt={4}>
          {studentData?.length === 0 && (
            <Grid item xs={12}>
              <Typography variant='h6' color='black'>
                Không có dữ liệu
              </Typography>
            </Grid>
          )}
          {studentData?.map(student => (
            <Grid item xs={12} sm={6} md={6} key={student._id}>
              <Card sx={{ minWidth: 275, boxShadow: 5 }}>
                <CardHeader
                  title={`📖 ${student.academicCategory.title}`}
                  action={
                    <Stack direction='row' spacing={1}>
                      {student?.processingResult?.commitment && !student.commitment && (
                        <Tooltip title='Tạo đơn cam kết' arrow>
                          <CustomIconButton
                            variant='contained'
                            onClick={() => {
                              handleAddCommitment(student._id)
                            }}
                          >
                            <Iconify icon='fluent-color:document-add-48' />
                          </CustomIconButton>
                        </Tooltip>
                      )}
                      {student.commitment && (
                        <>
                          <Tooltip title='Xem đơn cam kết' arrow>
                            <CustomIconButton
                              variant='contained'
                              onClick={() => {
                                handleOpenViewDetailCommitmentForm(student)
                              }}
                            >
                              <Iconify icon='fluent-emoji-flat:information' />
                            </CustomIconButton>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  }
                />
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant='h6'>
                      <strong>📅 Học kỳ:</strong> {student.termName}
                    </Typography>
                    <Typography variant='h6'>
                      <strong>🎓 Năm học:</strong> {student.year}
                    </Typography>
                    <Typography variant='h6'>
                      <strong>⚠️ Diện XLHV (PĐT đề nghị):</strong> {student.handlingStatusByAAO}
                    </Typography>
                    <Typography variant='h6'>
                      {student.status ? '✅' : '❌'} <strong>Kết quả XLHV:</strong>{' '}
                      {student.status ? 'CVHT đã xử lý' : 'CVHT chưa xử lý'}
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <strong>📜 Đơn cam kết:</strong> {renderCommitmentStatus(student)}
                    </Typography>
                    <Accordion>
                      <AccordionSummary>
                        <Typography variant='subtitle2'>🔎 Xem chi tiết</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ color: 'black' }}>
                        <Stack spacing={1}>
                          <Typography variant='h6'>
                            <strong>📝 Lý do xử lý:</strong> {student.reasonHandling}
                          </Typography>
                          {student.courseRegistration.map((course, index) => (
                            <Stack key={index} spacing={1}>
                              <Typography variant='subtitle2'>
                                {course.isRegister ? '✅' : '❌'} <strong>ĐKMH {course.termName}:</strong>{' '}
                                {course.isRegister ? 'Đã đăng ký' : 'Chưa đăng ký'}
                                {course.note ? `; ghi chú: ${course.note}` : ''}
                              </Typography>
                            </Stack>
                          ))}
                          <Divider
                            sx={{
                              backgroundColor: 'black',
                              height: 1,
                              margin: '10px 0'
                            }}
                          />
                          {student?.processingResult?.commitment && student.commitment}
                          {student.processing.map((process, index) => (
                            <Stack key={index} spacing={1}>
                              <Typography variant='subtitle2'>
                                <strong>⏳ Học kỳ XLHV</strong> {process.termName}: {process.statusHandling}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
      <StudentViewDetailCommitmentForm />
      {/* <AddCommitmentForm mutate={mutate} /> */}
    </>
  )
}
