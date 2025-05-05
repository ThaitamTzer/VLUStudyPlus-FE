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

import { toast } from 'react-toastify'

import studentAcedemicProcessService from '@/services/studentAcedemicProcess.service'
import PageHeader from '@/components/page-header'
import CustomIconButton from '@/@core/components/mui/IconButton'
import Iconify from '@/components/iconify'
import type { ProcessingType } from '@/types/management/learnProcessType'

// import StudentViewDetailCommitmentForm from './studentViewDetailCommitmentForm'
import AddCommitmentFormProcess from './addCommitmentFormProcess'
import CreateFormModal from '../form-instance/CreateFormModal'
import formInstanceService from '@/services/formInstance.service'
import type { FormInstanceType } from '@/types/management/formInstanceType'
import FormInstancePDF from '../form-instance/FormInstancePDF'
import DeleteFormModal from '../form-instance/DeleteFormModal'
import UpdateFormModal from '../form-instance/UpdateFormModal'

export default function StudentAcedemicProcessPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [openCreateFormModal, setOpenCreateFormModal] = useState(false)
  const [formTemplateId, setFormTemplateId] = useState<string | null>(null)
  const [processId, setProcessId] = useState<string | null>(null)
  const [formInstance, setFormInstance] = useState<FormInstanceType | null>(null)
  const [openFormViewer, setOpenFormViewer] = useState(false)
  const [student, setStudent] = useState<ProcessingType | null>(null)
  const [openDeleteFormModal, setOpenDeleteFormModal] = useState(false)
  const [openUpdateFormModal, setOpenUpdateFormModal] = useState(false)

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

  const { mutate: mutateFormInstance, isLoading: isLoadingFormInstance } = useSWR(
    student?._id ? `/api/form-instance/${student?._id}` : null,
    () => formInstanceService.getFormDetail_Student(student?._id || ''),
    {
      revalidateOnMount: true,
      onSuccess: data => {
        setFormInstance(data)
      }
    }
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

  const renderStatusOfProcessing = (status: string, student: ProcessingType) => {
    switch (status) {
      case 'Hoàn thành':
        return (
          <>
            <Chip label='Hoàn thành' color='success' />
            {student.CVHTHandle?.commitment && (
              <Tooltip title='Xem đơn' arrow>
                <CustomIconButton
                  size='small'
                  variant='contained'
                  color='primary'
                  onClick={() =>
                    handleViewDetailForm(student?._id || '', student || null, student?.CVHTHandle?.formTemplateId || '')
                  }
                  sx={{ ml: 1 }}
                >
                  <Iconify icon='mdi:file-eye-outline' />
                </CustomIconButton>
              </Tooltip>
            )}
          </>
        )

      case 'Cần làm đơn':
        return (
          <>
            <Chip label='Cần làm đơn' color='error' />
            <Tooltip title='Tạo đơn' arrow>
              <CustomIconButton
                size='small'
                variant='contained'
                color='primary'
                sx={{
                  ml: 1
                }}
                onClick={() => {
                  handleOpenCreateFormModal(student?.CVHTHandle?.formTemplateId || '', student?._id || '')
                }}
              >
                <Iconify icon='mdi:plus' />
              </CustomIconButton>
            </Tooltip>
            <Tooltip title='Xem đơn' arrow>
              <CustomIconButton
                size='small'
                variant='contained'
                color='primary'
                onClick={() =>
                  handleViewDetailForm(student?._id || '', student || null, student?.CVHTHandle?.formTemplateId || '')
                }
                sx={{ ml: 1 }}
              >
                <Iconify icon='mdi:file-eye-outline' />
              </CustomIconButton>
            </Tooltip>
          </>
        )
      case 'Đã làm đơn':
        return (
          <>
            <Chip label='Đã làm đơn' color='success' />
            <Tooltip title='Xem đơn' arrow>
              <CustomIconButton
                size='small'
                variant='contained'
                color='primary'
                onClick={() =>
                  handleViewDetailForm(student?._id || '', student || null, student?.CVHTHandle?.formTemplateId || '')
                }
                sx={{ ml: 1 }}
              >
                <Iconify icon='mdi:file-eye-outline' />
              </CustomIconButton>
            </Tooltip>
          </>
        )
      default:
        return <Chip label='Vừa tạo' color='warning' />
    }
  }

  const handleOpenCreateFormModal = useCallback(
    (id: string, processId: string) => {
      setFormTemplateId(id)
      setOpenCreateFormModal(true)
      setProcessId(processId)
    },
    [setOpenCreateFormModal, setFormTemplateId, setProcessId]
  )

  const handleOpenDeleteFormModal = useCallback((id: string) => {
    setOpenDeleteFormModal(true)
    setFormTemplateId(id)
  }, [])

  const handleViewDetailForm = useCallback(async (id: string, student: ProcessingType, formTemplateId: string) => {
    setOpenFormViewer(true)
    setStudent(student)
    setFormTemplateId(formTemplateId)
  }, [])

  const handleUpdateForm = useCallback(async () => {
    setOpenUpdateFormModal(true)
  }, [])

  const handleDeleteForm = useCallback(
    async (id: string) => {
      const toastID = toast.loading('Đang xóa đơn...')

      await formInstanceService.deleleForm(
        id,
        () => {
          toast.update(toastID, {
            render: 'Đã xóa đơn thành công',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
          mutate()
          setOpenDeleteFormModal(false)
          setOpenFormViewer(false)
          setFormInstance(null)
        },
        () => {
          toast.update(toastID, {
            render: 'Đã xóa đơn thất bại',
            type: 'error',
            isLoading: false,
            autoClose: 3000
          })
        }
      )
    },
    [mutate]
  )

  const handleCloseFormViewer = useCallback(() => {
    setOpenFormViewer(false)
  }, [])

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

                  // action={
                  //   <Stack direction='row' spacing={1}>
                  //     <Tooltip title='Xem chi tiết' arrow>
                  //       <CustomIconButton
                  //         variant='contained'
                  //         color='primary'
                  //         onClick={() => {
                  //           handleOpenViewDetailCommitmentForm(student)
                  //         }}
                  //       >
                  //         <Iconify icon='mdi:file-document-outline' />
                  //       </CustomIconButton>
                  //     </Tooltip>
                  //   </Stack>
                  // }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexDirection: 'column',
                          width: '80%'
                        }}
                      >
                        <Typography variant='body1'>
                          <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                            Lý do XLHT {student.reasonHandling?.note}:
                          </Box>
                          {renderProcessingStatus(student)}
                        </Typography>

                        <Typography variant='body1'>
                          <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                            Trạng thái xử lý:
                          </Box>
                          {renderStatusOfProcessing(student.statusOfProcessing, student)}
                        </Typography>
                        <Typography variant='body1'>
                          <Box component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                            CVHT ghi nhận tình trạng xử lý:
                          </Box>
                          {student.CVHTHandle?.processingResultName || 'CVHT chưa ghi nhận'}
                        </Typography>
                      </Box>

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
                          borderRadius: 2,
                          backgroundColor: 'background.default'
                        }}
                      >
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Thông tin xử lý học tập
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Iconify icon='mdi:account' color='primary.main' />
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Người xử lý:{' '}
                                </Box>
                                {student.handlerName || '-'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Iconify icon='mdi:note-text' color='primary.main' />
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Ghi chú CVHT:{' '}
                                </Box>
                                {student.CVHTNote || '-'}
                              </Typography>
                            </Box>

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
                                  XLHT - {student.processingHandle.note} (UIS - XLHT theo quy chế):{' '}
                                </Box>
                                {student.processingHandle?.statusProcess}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Iconify icon='mdi:alert-circle' color='primary.main' />
                              <Typography variant='body2'>
                                <Box component='span' sx={{ fontWeight: 'bold' }}>
                                  Đếm số lần bị XLHT qua 10 học kỳ (Từ HK201 đến {student.countWarning.note}):{' '}
                                </Box>
                                {student.countWarning.academicWarningsCount}
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
                                  SĐTLH:{' '}
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
      {/* <StudentViewDetailCommitmentForm /> */}
      <CreateFormModal
        id={formTemplateId || ''}
        idProcess={processId || ''}
        open={openCreateFormModal}
        onClose={() => setOpenCreateFormModal(false)}
        mutate={mutate}
      />

      <UpdateFormModal
        id={formTemplateId || ''}
        open={openUpdateFormModal}
        onClose={() => setOpenUpdateFormModal(false)}
        mutate={mutateFormInstance}
        formInstance={formInstance}
      />
      {formInstance && (
        <FormInstancePDF
          instance={formInstance}
          open={openFormViewer}
          onClose={handleCloseFormViewer}
          nameOfForm={student?.lastName + ' ' + student?.firstName}
          isStudent
          onDelete={() => handleOpenDeleteFormModal(formInstance._id)}
          onUpdate={handleUpdateForm}
          isLoading={isLoadingFormInstance}
        />
      )}
      <DeleteFormModal
        open={openDeleteFormModal}
        onClose={() => setOpenDeleteFormModal(false)}
        onDelete={() => handleDeleteForm(formInstance?._id || '')}
        title='Xóa đơn'
        description='Bạn có chắc chắn muốn xóa đơn này không?'
      />
    </>
  )
}
