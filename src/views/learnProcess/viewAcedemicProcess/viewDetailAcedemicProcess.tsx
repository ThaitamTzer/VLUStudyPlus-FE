'use client'

import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Grid, Paper } from '@mui/material'

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
      <DialogTitle>
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
          <Iconify icon='eva:close-outline' />
        </IconButton>
        <Typography variant='h4'>📚 Chi tiết xử lý học vụ</Typography>
      </DialogTitle>
      <DialogContent>
        {data ? (
          <Grid container spacing={2}>
            {/* Thông tin sinh viên */}
            <Section title='👨‍🎓 Thông tin sinh viên'>
              <Info label='Mã sinh viên' value={data.checkAcademicProcessing.studentId} />
              <Info
                label='Họ và tên'
                value={`${data.checkAcademicProcessing.lastName} ${data.checkAcademicProcessing.firstName}`}
              />
              <Info label='📧 Email' value={data?.student?.mail || 'Không tìm thấy'} />
              <Info label='🎂 Ngày sinh' value={fDate(data?.student?.dateOfBirth, 'dd/MM/yyyy') || 'Không tìm thấy'} />
              <Info label='📌 Lớp' value={data.checkAcademicProcessing.classId} />
              <Info label='📅 Niên khóa' value={data.checkAcademicProcessing.cohortName} />
              <Info label='🏢 Khoa' value={data.checkAcademicProcessing.faculty} />
              <Info label='📖 Năm học' value={data.checkAcademicProcessing.year} />
              <Info label='📆 Học kỳ' value={data.checkAcademicProcessing.termName} />
            </Section>

            {/* Thông tin xử lý học vụ */}
            <Section title='⚖️ Thông tin xử lý học vụ'>
              <Info label='📌 Trạng thái' value={data.checkAcademicProcessing.handlingStatusByAAO} />
              <Info label='❗ Lý do' value={data.checkAcademicProcessing.reasonHandling} />
              <Info label='📝 Ghi chú' value={data.checkAcademicProcessing.note || 'Không có'} />
            </Section>

            {/* Quá trình học tập */}
            <Section title='📈 Quá trình học tập'>
              <Info label='📊 Điểm trung bình chung' value={String(data.checkAcademicProcessing.DTBC)} />
              <Info label='📚 Số tín chỉ' value={String(data.checkAcademicProcessing.STC)} />
              <Info label='🔢 Điểm trung bình tích lũy' value={String(data.checkAcademicProcessing.DTBCTL)} />
              <Info label='🎓 Số tín chỉ tích lũy' value={String(data.checkAcademicProcessing.STCTL)} />
            </Section>

            {/* Đăng ký học phần */}
            <Section title='📝 Đăng ký học phần'>
              {data.checkAcademicProcessing.courseRegistration.map((course, index) => (
                <Info
                  key={index}
                  label={`📌 Học kỳ ${course.termName}`}
                  value={`Đăng ký: ${course.isRegister ? 'Có' : 'Không'}`}
                />
              ))}
            </Section>

            {/* Thông tin lớp học */}
            <Section title='🏫 Thông tin lớp học'>
              <Info label='📎 Mã lớp' value={data.checkAcademicProcessing.classId} />
              <Info label='👨‍🏫 Giảng viên' value={data.informationClass?.userName || 'Không có'} />
              <Info label='📩 Email giảng viên' value={data.informationClass?.lectureId.mail || 'Không có'} />
            </Section>

            {/* Thông tin thiếu */}
            <Section title='⚠️ Thông tin thiếu'>
              {data.missingInfoRows.map((info, index) => (
                <Typography key={index} variant='body2' fontWeight='bold'>
                  ❗ {info.message}
                </Typography>
              ))}
            </Section>
          </Grid>
        ) : (
          <Typography variant='h6'>🔄 Đang tải dữ liệu...</Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Component phụ cho mỗi mục
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Grid item xs={12}>
      <Typography variant='h6' sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
        {title}
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
        {children}
      </Paper>
    </Grid>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Typography variant='body1' sx={{ display: 'flex', gap: 1 }}>
      <span style={{ fontWeight: 'bold', color: '#555' }}>{label}:</span> {value}
    </Typography>
  )
}
