'use client'

import { useState } from 'react'

import { vi } from 'date-fns/locale'
import { registerLocale } from 'react-datepicker'

import useSWR from 'swr'
import {
  Card,
  CardContent,
  Grid,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import sendNotificateService from '@/services/sendNotificate.service'
import CustomTextField from '@/@core/components/mui/TextField'
import EmailTemplate from './EmailTemplate'

export default function MessageHistoryForLecture() {
  registerLocale('vi', vi)

  // Khởi tạo state và SWR
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined

  const {
    data: history,
    error,
    isValidating
  } = useSWR(
    ['get-history-email-for-lecture', formattedStartDate, formattedEndDate, searchTerm],
    () => sendNotificateService.getHistoryMailForCHVT(formattedStartDate, formattedEndDate, searchTerm),
    { revalidateOnFocus: false }
  )

  // Trạng thái cho modal chi tiết
  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [selectedMail, setSelectedMail] = useState<any>(null)

  const handleOpenDetail = (item: any) => {
    setSelectedMail(item)
    setOpenDetail(true)
  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
    setSelectedMail(null)
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <AppReactDatepicker
                isClearable
                locale='vi'
                dateFormat='dd/MM/yyyy'
                selected={startDate}
                onChange={date => {
                  setStartDate(date)
                  setEndDate(null)
                }}
                customInput={<CustomTextField fullWidth size='small' label='Ngày bắt đầu' />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AppReactDatepicker
                isClearable
                locale='vi'
                dateFormat='dd/MM/yyyy'
                selected={endDate}
                minDate={startDate || undefined}
                onChange={date => setEndDate(date)}
                customInput={<CustomTextField fullWidth size='small' label='Ngày kết thúc' />}
                disabled={!startDate}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size='small'
                label='Tìm kiếm'
                placeholder='Tìm kiếm tiêu đề hoặc nội dung'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box mt={2}>
        {isValidating && !history ? (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color='error'>Đã có lỗi xảy ra khi tải dữ liệu</Typography>
        ) : history?.length === 0 ? (
          <Typography align='center'>Không có bản ghi phù hợp</Typography>
        ) : (
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày gửi</TableCell>
                    <TableCell>Người nhận</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Nội dung</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history?.map(item => (
                    <TableRow key={item._id}>
                      <TableCell>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</TableCell>
                      <TableCell width={400}>
                        <Tooltip title={item.emailTo.join(', ')} arrow>
                          <Typography noWrap width={400}>
                            {item.emailTo.length > 1
                              ? `${item.emailTo.slice(0, 1).join(', ')}, ...`
                              : item.emailTo.join(', ')}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>
                        <Button size='small' variant='outlined' onClick={() => handleOpenDetail(item)}>
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Box>
      <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth maxWidth='md'>
        <DialogTitle>Chi tiết thông báo</DialogTitle>
        <DialogContent dividers>
          <Typography variant='h6'>Người nhận:</Typography>
          <Typography
            sx={{
              color: 'primary.main'
            }}
            gutterBottom
          >
            {selectedMail?.emailTo.join(', ')}
          </Typography>
          <Typography variant='h6'>Tiêu đề:</Typography>
          <Typography gutterBottom>{selectedMail?.subject}</Typography>
          <Typography variant='h6'>Nội dung:</Typography>
          <EmailTemplate content={selectedMail?.content || ''} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
