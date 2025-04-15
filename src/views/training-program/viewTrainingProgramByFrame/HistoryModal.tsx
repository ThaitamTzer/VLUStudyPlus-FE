'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import useSWR from 'swr'

import changeHistoryService from '@/services/changeHistory.service'

interface HistoryModalProps {
  open: boolean
  onClose: () => void
  id: string
}

const HistoryModal = ({ open, onClose, id }: HistoryModalProps) => {
  const { data: history } = useSWR(
    `/api/edit-history/get-edit-history/${id}`,
    () => changeHistoryService.getChangeHistoryById(id),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true
    }
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Lịch sử chỉnh sửa
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' gutterBottom>
          Chương trình: {history?.trainingProgramSessionId.title}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          Tổng số tín chỉ: {history?.trainingProgramSessionId.credit}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          Người tạo khung chương trình: {history?.userName} ({history?.userId})
        </Typography>

        <Box sx={{ mt: 2 }}>
          {history?.edit.map(edit => (
            <Accordion key={edit._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant='subtitle1'>
                    Chỉnh sửa ngày {format(new Date(edit.editAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Người chỉnh sửa: {edit.userName}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {/* Thêm danh mục mới */}
                {edit.newC.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='success.main' gutterBottom>
                      Thêm danh mục mới:
                    </Typography>
                    {edit.newC.map((category, idx) => (
                      <Typography key={idx} variant='body2'>
                        • {category}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Thêm môn học mới */}
                {edit.newS.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='success.main' gutterBottom>
                      Thêm môn học mới:
                    </Typography>
                    {edit.newS.map(subject => (
                      <Typography key={subject._id} variant='body2'>
                        • {subject.idOfSubject} - {subject.nameOfSubject}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Thay đổi danh mục */}
                {edit.changesC.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='primary.main' gutterBottom>
                      Thay đổi danh mục:
                    </Typography>
                    {edit.changesC.map(change => (
                      <Box key={change._id} sx={{ mb: 1 }}>
                        <Typography variant='body2'>• {change.oldValue}</Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ pl: 2 }}>
                          Số tín chỉ: {change.oldCredits} → {change.newCredits}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Thay đổi môn học */}
                {edit.changesS.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='primary.main' gutterBottom>
                      Thay đổi môn học:
                    </Typography>
                    {edit.changesS.map(change => (
                      <Box key={change._id} sx={{ mb: 1 }}>
                        <Typography variant='body2'>
                          • {change.idOfSubject} - {change.nameOfSubject}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ pl: 2 }}>
                          {change.change}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Xóa danh mục */}
                {edit.deleteC.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='error.main' gutterBottom>
                      Xóa danh mục:
                    </Typography>
                    {edit.deleteC.map(category => (
                      <Box key={category._id} sx={{ mb: 1 }}>
                        <Typography variant='body2'>• {category.categoryD}</Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ pl: 2 }}>
                          Lý do: {category.reason}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Xóa môn học */}
                {edit.deleteS.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='error.main' gutterBottom>
                      Xóa môn học:
                    </Typography>
                    {edit.deleteS.map(subject => (
                      <Box key={subject._id} sx={{ mb: 1 }}>
                        <Typography variant='body2'>
                          • {subject.idOfSubject} - {subject.nameOfSubject}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ pl: 2 }}>
                          Lý do: {subject.reason}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default HistoryModal
