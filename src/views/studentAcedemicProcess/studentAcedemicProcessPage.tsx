'use client'

import { useCallback, useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  CardHeader,
  Tooltip,
  Divider,
  Alert,
  AlertTitle,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Button
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const {
    data: studentData,
    mutate,
    isLoading
  } = useSWR(
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

  const handleToggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const renderCommitmentStatus = (student: any) => {
    if (student.commitment) {
      return <Chip label='Đã làm đơn' color='success' icon={<Iconify icon='mdi:check-circle' />} />
    }

    if (student.processingResult?.commitment === undefined) {
      return <Chip label='Chờ CVHT xử lý' color='info' icon={<Iconify icon='mdi:clock-outline' />} />
    }

    if (student.processingResult?.commitment) {
      return <Chip label='Cần làm đơn cam kết' color='warning' icon={<Iconify icon='mdi:alert' />} />
    }

    return <Chip label='Không cần làm đơn' color='default' />
  }

  // Đếm số đơn cần phải làm
  const commitmentNeededCount =
    studentData?.filter(student => student.processingResult?.commitment && !student.commitment).length || 0

  return (
    <>
      <PageHeader title='Xử lý học tập của sinh viên' />
      {commitmentNeededCount > 0 && (
        <Alert severity='warning' sx={{ mt: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>Chú ý!</AlertTitle>
          Bạn có {commitmentNeededCount} yêu cầu cần làm đơn cam kết. Vui lòng hoàn thành để tránh bị ảnh hưởng đến kết
          quả học tập!
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>Đang tải dữ liệu...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} mt={2}>
          {studentData?.length === 0 && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Iconify icon='mdi:information-outline' fontSize={48} />
                <Typography variant='h6' color='textSecondary' sx={{ mt: 2 }}>
                  Không có dữ liệu xử lý học vụ nào
                </Typography>
              </Paper>
            </Grid>
          )}

          {studentData?.map(student => (
            <Grid item xs={12} sm={6} md={6} key={student._id}>
              <Card
                sx={{
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  boxShadow:
                    student.processingResult?.commitment && !student.commitment ? '0 0 15px rgba(255, 152, 0, 0.5)' : 3
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon='mdi:file-document' fontSize={24} color='primary.main' />
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        {student.academicCategory.title}
                      </Typography>
                    </Box>
                  }
                  action={
                    <Stack direction='row' spacing={1}>
                      {student?.processingResult?.commitment && !student.commitment && (
                        <Tooltip title='Tạo đơn cam kết' arrow>
                          <CustomIconButton
                            variant='contained'
                            color='warning'
                            onClick={() => {
                              handleAddCommitment(student._id)
                            }}
                            sx={{
                              animation: 'pulse 1.5s infinite',
                              '@keyframes pulse': {
                                '0%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.7)' },
                                '70%': { boxShadow: '0 0 0 10px rgba(255, 152, 0, 0)' },
                                '100%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)' }
                              }
                            }}
                          >
                            <Iconify icon='mdi:file-plus' />
                          </CustomIconButton>
                        </Tooltip>
                      )}
                      {student.commitment && (
                        <Tooltip title='Xem đơn cam kết' arrow>
                          <CustomIconButton
                            variant='contained'
                            color='primary'
                            onClick={() => {
                              handleOpenViewDetailCommitmentForm(student)
                            }}
                          >
                            <Iconify icon='mdi:file-document-outline' />
                          </CustomIconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Chip
                        icon={<Iconify icon='mdi:calendar' />}
                        label={`Học kỳ: ${student.termName}`}
                        variant='outlined'
                        size='small'
                      />
                      <Chip
                        icon={<Iconify icon='mdi:school' />}
                        label={`Năm học: ${student.year}`}
                        variant='outlined'
                        size='small'
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1'>
                        <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                          Diện XLHV (PĐT đề nghị):
                        </Box>
                        <Chip label={student.handlingStatusByAAO} color='error' size='small' />
                      </Typography>

                      <Typography variant='body1'>
                        <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                          Trạng thái XLHV:
                        </Box>
                        <Chip
                          label={student.status ? 'Đã xử lý' : 'Chưa xử lý'}
                          color={student.status ? 'success' : 'default'}
                          size='small'
                          icon={<Iconify icon={student.status ? 'mdi:check' : 'mdi:clock-outline'} />}
                        />
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1'>
                        <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                          Trạng thái đơn cam kết:
                        </Box>
                        {renderCommitmentStatus(student)}
                      </Typography>

                      <Button
                        endIcon={<Iconify icon={expandedId === student._id ? 'mdi:chevron-up' : 'mdi:chevron-down'} />}
                        onClick={() => handleToggleAccordion(student._id)}
                        size='small'
                        color='primary'
                      >
                        Chi tiết
                      </Button>
                    </Box>

                    {expandedId === student._id && (
                      <Paper
                        sx={{
                          p: 2,
                          mt: 1,
                          backgroundColor: 'grey.50',
                          borderRadius: 2
                        }}
                      >
                        <Stack spacing={2}>
                          <Typography variant='body1'>
                            <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                              Lý do xử lý:
                            </Box>
                            {student.reasonHandling}
                          </Typography>

                          <Divider />

                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Đăng ký môn học:
                          </Typography>

                          {student.courseRegistration.map((course, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Iconify
                                icon={course.isRegister ? 'mdi:check-circle' : 'mdi:close-circle'}
                                color={course.isRegister ? 'success.main' : 'error.main'}
                              />
                              <Typography variant='body2'>
                                <strong>ĐKMH {course.termName}:</strong>{' '}
                                {course.isRegister ? 'Đã đăng ký' : 'Chưa đăng ký'}
                                {course.note ? ` (${course.note})` : ''}
                              </Typography>
                            </Box>
                          ))}

                          <Divider />

                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Xử lý học vụ (UIS)
                          </Typography>

                          {student.processing.map((process, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Iconify icon='mdi:clock-time-four-outline' />
                              <Typography variant='body2'>
                                <strong>Học kỳ {process.termName}:</strong> {process.statusHandling}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    )}

                    {student.processingResult?.commitment && !student.commitment && (
                      <Button
                        variant='contained'
                        color='warning'
                        fullWidth
                        startIcon={<Iconify icon='mdi:file-plus' />}
                        onClick={() => handleAddCommitment(student._id)}
                        sx={{ mt: 1 }}
                      >
                        Tạo đơn cam kết
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AddCommitmentFormProcess mutate={mutate} />
      <StudentViewDetailCommitmentForm />
    </>
  )
}
