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

  const { setProcessObj, toogleStudentViewDetailCommitmentForm } = useStudentAcedemicProcessStore()

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

  const renderProcessingStatus = (student: ProcessingType) => {
    if (student.reasonHandling?._id) {
      return <Chip label={`${student.reasonHandling.reason} `} color='error' />
    }

    return <Chip label='Chưa xử lý' color='default' icon={<Iconify icon='mdi:clock-outline' />} />
  }

  return (
    <>
      <PageHeader title='Xử lý học tập của sinh viên' />

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
                  boxShadow: 3
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        {student.academicCategory.title}
                      </Typography>
                    </Box>
                  }
                  subheader={
                    <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        size='small'
                        icon={<Iconify icon='mdi:school' />}
                        label={`Lớp: ${student.classId}`}
                        variant='outlined'
                      />
                      <Chip
                        size='small'
                        icon={<Iconify icon='mdi:account-group' />}
                        label={`Khóa: ${student.cohortName}`}
                        variant='outlined'
                      />
                    </Stack>
                  }
                  action={
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='Xem chi tiết' arrow>
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
                    </Stack>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1'>
                        <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                          Lý do XLHT {student.reasonHandling?.note}:
                        </Box>
                        {renderProcessingStatus(student)}
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
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Thông tin xử lý học tập
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Iconify icon='mdi:account-group' color='primary.main' />
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Đối tượng:{' '}
                                </Box>
                                {student.groupedByInstruction}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Iconify icon='mdi:calendar-clock' color='primary.main' />
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Đợt xử lý:{' '}
                                </Box>
                                {student.processingHandle?.statusProcess}
                                {student.processingHandle?.note && ` (${student.processingHandle.note})`}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Iconify icon='mdi:alert-circle' color='primary.main' />
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Lý do XLHT:{' '}
                                </Box>
                                {student.reasonHandling?.reason}
                                {student.reasonHandling?.note && ` (${student.reasonHandling.note})`}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider />

                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Thông tin sinh viên
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Chip
                              icon={<Iconify icon='mdi:school' />}
                              label={`Khoa: ${student.faculty}`}
                              variant='outlined'
                              size='small'
                            />
                            <Chip
                              icon={<Iconify icon='mdi:account-school' />}
                              label={`Năm thứ: ${student.yearLevel}`}
                              variant='outlined'
                              size='small'
                            />
                            <Chip
                              icon={<Iconify icon='mdi:book-open-variant' />}
                              label={`Ngành: ${student.major}`}
                              variant='outlined'
                              size='small'
                            />
                          </Box>

                          <Divider />

                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Đăng ký môn học:
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Iconify
                              icon={student.courseRegistration?.isRegister ? 'mdi:check-circle' : 'mdi:close-circle'}
                              color={student.courseRegistration?.isRegister ? 'success.main' : 'error.main'}
                            />
                            <Typography variant='body2'>
                              {student.courseRegistration?.isRegister ? 'Đã đăng ký' : 'Chưa đăng ký'}
                              {student.courseRegistration?.note ? ` (${student.courseRegistration.note})` : ''}
                            </Typography>
                          </Box>

                          <Divider />

                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Thông tin học tập:
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  ĐTBC:{' '}
                                </Box>
                                {student.DTBC}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  ĐTBCTL:{' '}
                                </Box>
                                {student.DTBCTL}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  TCTL:{' '}
                                </Box>
                                {student.TCTL}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  TCCN:{' '}
                                </Box>
                                {student.TCCN}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Tổng TCCTDT:{' '}
                                </Box>
                                {student.TONGTCCTDT}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Phần trăm TL:{' '}
                                </Box>
                                {student.percentTL?.toFixed(2)}%
                              </Typography>
                            </Grid>
                          </Grid>

                          <Divider />

                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Thông tin liên hệ:
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  SĐT SV:{' '}
                                </Box>
                                {student.sdtsv || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  SĐT Lớp trưởng:{' '}
                                </Box>
                                {student.sdtlh || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  SĐT HKTT:{' '}
                                </Box>
                                {student.sdthktt || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  SĐT Cha:{' '}
                                </Box>
                                {student.sdtcha || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  SĐT Mẹ:{' '}
                                </Box>
                                {student.sdtme || '-'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Stack>
                      </Paper>
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
