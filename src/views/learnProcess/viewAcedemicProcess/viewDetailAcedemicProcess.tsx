'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
  Card,
  Divider,
  Chip,
  Box
} from '@mui/material'
import useSWR from 'swr'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import Iconify from '@/components/iconify'
import { fDate } from '@/utils/format-time'

type ViewDetailAcedecmicProcessProps = {
  id: string
}

export default function ViewDetailAcedecmicProcess(props: ViewDetailAcedecmicProcessProps) {
  const { id } = props

  const { data } = useSWR(
    id ? `/api/academic-processing/view-academicProcessing/${id}` : null,
    () => learnProcessService.viewDetailProcess(id),
    {
      revalidateOnFocus: false
    }
  )

  const { toogleViewDetailAcademicProcess, openViewDetailAcademicProcess } = useAcedemicProcessStore()

  const onClose = () => {
    toogleViewDetailAcademicProcess()
  }

  return (
    <Dialog open={openViewDetailAcademicProcess} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme => theme.palette.primary.main,
          color: '#fff',
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap={1.5}>
            <span style={{ fontSize: '1.8rem' }}>📋</span>
            <Typography variant='h5' fontWeight='bold'>
              Chi tiết xử lý học vụ
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <Iconify icon='mdi:close' />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3, mt: 2 }}>
        {data ? (
          <Grid container spacing={3}>
            {/* Student Information Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderLeft: '4px solid #3b82f6',
                  boxShadow: 5
                }}
              >
                <SectionHeader emoji='👨‍🎓' title='Thông tin sinh viên' />
                <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                <InfoGrid>
                  <InfoItemSmall emoji='🆔' label='Mã sinh viên' value={data.checkAcademicProcessing.studentId} />
                  <InfoItemSmall
                    emoji='👤'
                    label='Họ và tên'
                    value={`${data.checkAcademicProcessing.lastName} ${data.checkAcademicProcessing.firstName}`}
                  />
                  <InfoItemSmall emoji='📧' label='Email' value={data?.student?.mail || 'N/A'} />
                  <InfoItemSmall
                    emoji='🎂'
                    label='Ngày sinh'
                    value={fDate(data?.student?.dateOfBirth, 'dd/MM/yyyy') || 'N/A'}
                  />
                  <InfoItemSmall emoji='👥' label='Lớp' value={data.checkAcademicProcessing.classId} />
                  <InfoItemSmall emoji='📅' label='Niên khóa' value={data.checkAcademicProcessing.cohortName} />
                  <InfoItemSmall emoji='🏛️' label='Khoa' value={data.checkAcademicProcessing.faculty} />
                </InfoGrid>
              </Card>
            </Grid>

            {/* Academic Information Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderLeft: '4px solid #8b5cf6',
                  boxShadow: 5
                }}
              >
                <SectionHeader emoji='📚' title='Thông tin học tập' />
                <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                <InfoGrid>
                  <InfoItemSmall emoji='🎓' label='Năm học' value={data.checkAcademicProcessing.yearLevel} />
                  <InfoItemSmall emoji='🗓️' label='Học kỳ' value={data.checkAcademicProcessing.admissionYear} />
                  <InfoItemSmall
                    emoji='📊'
                    label='Điểm TB chung'
                    value={
                      <Box component='span' fontWeight='bold' color='#3b82f6'>
                        {data.checkAcademicProcessing.DTBC}
                      </Box>
                    }
                  />
                  <InfoItemSmall emoji='🪙' label='Số tín chỉ' value={data.checkAcademicProcessing.TONGTCCTDT} />
                  <InfoItemSmall
                    emoji='📈'
                    label='Điểm TB tích lũy'
                    value={
                      <Box component='span' fontWeight='bold' color='#3b82f6'>
                        {data.checkAcademicProcessing.DTBCTL}
                      </Box>
                    }
                  />
                  <InfoItemSmall emoji='🪙' label='Số TC tích lũy' value={data.checkAcademicProcessing.TCTL} />
                </InfoGrid>
              </Card>
            </Grid>

            {/* Academic Processing Section */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3,
                  borderLeft: '4px solid #ef4444',
                  boxShadow: 5
                }}
              >
                <SectionHeader emoji='⚖️' title='Diện XLHV (PĐT đề nghị)' />
                <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      emoji='🏷️'
                      label='Diện XLHV'
                      value={
                        <Chip
                          label={data.checkAcademicProcessing.statusOn.status}
                          color={
                            data.checkAcademicProcessing.statusOn.status === 'Đạt'
                              ? 'success'
                              : data.checkAcademicProcessing.statusOn.status === 'Không đạt'
                                ? 'error'
                                : 'error'
                          }
                          size='small'
                          sx={{
                            fontWeight: 'bold',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      emoji='❗'
                      label='Lý do XLHV (UIS)'
                      value={data.checkAcademicProcessing.reasonHandling.reason}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoItem
                      emoji='📝'
                      label='Lưu ý'
                      value={data.checkAcademicProcessing.statusOn.note || 'Không có ghi chú'}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Processing History Section */}
            {data.checkAcademicProcessing.processingHandle && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    borderLeft: '4px solid #6366f1',
                    boxShadow: 5
                  }}
                >
                  <SectionHeader emoji='🔄' title='Xử lý học vụ (UIS)' />
                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        variant='outlined'
                        sx={{
                          p: 2,
                          height: '100%',
                          borderRadius: '8px',
                          borderColor: '#d1d5db',
                          borderLeft: '4px solid #6366f1'
                        }}
                      >
                        <Box display='flex' alignItems='center' gap={1} mb={1}>
                          <span style={{ fontSize: '1.2rem' }}>📝</span>
                          <Typography variant='subtitle2' fontWeight='bold'>
                            Học kỳ {data.checkAcademicProcessing.processingHandle.note}
                          </Typography>
                        </Box>
                        <Chip
                          label={data.checkAcademicProcessing.processingHandle.statusProcess}
                          color={
                            data.checkAcademicProcessing.processingHandle.statusProcess === 'Đạt'
                              ? 'success'
                              : data.checkAcademicProcessing.processingHandle.statusProcess === 'Cảnh cáo học vụ'
                                ? 'warning'
                                : data.checkAcademicProcessing.processingHandle.statusProcess === 'Buộc thôi học'
                                  ? 'error'
                                  : 'default'
                          }
                          size='small'
                          sx={{
                            fontWeight: 'medium',
                            px: 0.5,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            )}

            {/* Course Registration Section */}
            {data.checkAcademicProcessing.courseRegistration && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    borderLeft: '4px solid #10b981',
                    boxShadow: 5
                  }}
                >
                  <SectionHeader emoji='📝' title='Đăng ký học phần' />
                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        variant='outlined'
                        sx={{
                          p: 2,
                          height: '100%',
                          borderRadius: '8px',
                          borderColor: data.checkAcademicProcessing.courseRegistration.isRegister
                            ? '#d1fae5'
                            : '#fee2e2',
                          borderLeft: data.checkAcademicProcessing.courseRegistration.isRegister
                            ? '4px solid #10b981'
                            : '4px solid #ef4444'
                        }}
                      >
                        <Box display='flex' alignItems='center' gap={1} mb={1}>
                          <span style={{ fontSize: '1.2rem' }}>
                            {data.checkAcademicProcessing.courseRegistration.isRegister ? '✅' : '❌'}
                          </span>
                          <Typography variant='subtitle2' fontWeight='bold'>
                            Học kỳ {data.checkAcademicProcessing.courseRegistration.note}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            data.checkAcademicProcessing.courseRegistration.isRegister ? 'Đã đăng ký' : 'Chưa đăng ký'
                          }
                          color={data.checkAcademicProcessing.courseRegistration.isRegister ? 'success' : 'error'}
                          size='small'
                          sx={{
                            fontWeight: 'medium',
                            px: 0.5,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            )}

            {/* Class Information Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  borderLeft: '4px solid #f59e0b',
                  boxShadow: 5
                }}
              >
                <SectionHeader emoji='🏫' title='Thông tin lớp học' />
                <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                <InfoGrid>
                  <InfoItem emoji='🆔' label='Mã lớp' value={data.checkAcademicProcessing.classId} />
                  <InfoItem emoji='👨‍🏫' label='Giảng viên' value={data.informationClass?.userName || 'N/A'} />
                  <InfoItem emoji='✉️' label='Email GV' value={data.informationClass?.lectureId.mail || 'N/A'} />
                </InfoGrid>
              </Card>
            </Grid>

            {/* Missing Information Section */}
            {data.missingInfoRows.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 3,
                    borderLeft: '4px solid #f59e0b',
                    boxShadow: 5
                  }}
                >
                  <SectionHeader emoji='⚠️' title='Thông tin thiếu' />
                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                  <Box
                    component='ul'
                    sx={{
                      pl: 3,
                      m: 0,
                      '& li': {
                        mb: 1,
                        pl: 1,
                        display: 'flex',
                        alignItems: 'flex-start'
                      }
                    }}
                  >
                    {data.missingInfoRows.map((info, index) => (
                      <li key={index}>
                        <Box display='flex' alignItems='flex-start' gap={1}>
                          <Typography variant='body2'>{info.message}</Typography>
                        </Box>
                      </li>
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        ) : (
          <Grid container justifyContent='center' sx={{ py: 6 }}>
            <Grid item>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 3,
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: 5,
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <Iconify icon='mdi:loading' width={24} height={24} className='animate-spin' />
                <Typography variant='h6' fontWeight='medium'>
                  Đang tải dữ liệu...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Reusable Components
function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <Box display='flex' alignItems='center' gap={1.5}>
      <span style={{ fontSize: '1.8rem' }}>{emoji}</span>
      <Typography variant='h6' fontWeight='bold'>
        {title}
      </Typography>
    </Box>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  )
}

function InfoItem({ emoji, label, value }: { emoji: string; label: string; value: React.ReactNode }) {
  return (
    <Grid item xs={12}>
      <Box display='flex' gap={1.5}>
        <span
          style={{
            fontSize: '1.2rem',
            alignSelf: 'flex-start',
            flexShrink: 0
          }}
        >
          {emoji}
        </span>
        <Box>
          <Typography
            variant='body2'
            fontWeight={700}
            sx={{
              display: 'block',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            {label}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              lineHeight: 1.3,
              wordBreak: 'break-word',
              fontSize: '0.8rem'
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  )
}

function InfoItemSmall({ emoji, label, value }: { emoji: string; label: string; value: React.ReactNode }) {
  return (
    <Grid item xs={12} sm={6}>
      <Box display='flex' gap={1.5}>
        <span
          style={{
            fontSize: '1.2rem',
            alignSelf: 'flex-start',
            flexShrink: 0
          }}
        >
          {emoji}
        </span>
        <Box>
          <Typography
            variant='body2'
            fontWeight={700}
            sx={{
              display: 'block',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            {label}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              lineHeight: 1.3,
              wordBreak: 'break-word',
              fontSize: '0.8rem'
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  )
}
