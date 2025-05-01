'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material'

import { toast } from 'react-toastify'

import useFormTemplateStore from '@/stores/formTemplate.store'
import FormTemplateDetail from './FormTemplateDetail'
import FormTemplateForm from './FormTemplateForm'
import FormTemplatePDF from './FormTemplatePDF'
import formTemplateService from '@/services/formTemplate.service'

export default function FormTemplatePage() {
  const theme = useTheme()
  const { formTemplates, fetchFormTemplates } = useFormTemplateStore()
  const [openDetail, setOpenDetail] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openPDF, setOpenPDF] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  useEffect(() => {
    fetchFormTemplates()
  }, [fetchFormTemplates])

  const handleEdit = (template: any) => {
    setSelectedTemplate(template)
    setOpenForm(true)
  }

  const onCloseForm = () => {
    setSelectedTemplate(null)
    setOpenForm(false)
  }

  const handleDelete = (template: any) => {
    setSelectedTemplate(template)
    setOpenDelete(true)
  }

  const handleViewPDF = (template: any) => {
    setSelectedTemplate(template)
    setOpenPDF(true)
  }

  const handleDuplicate = (template: any) => {
    // Tạo bản sao mới hoàn toàn của template
    const duplicatedTemplate = {
      ...template,
      title: `${template.title} (Bản sao)`,
      _id: undefined, // Xóa _id để tạo mới
      createdAt: undefined, // Xóa thời gian tạo
      updatedAt: undefined, // Xóa thời gian cập nhật
      __v: undefined, // Xóa version
      isNew: true // Đánh dấu là bản mới
    }

    setSelectedTemplate(duplicatedTemplate)
    setOpenForm(true)
  }

  const handleConfirmDelete = async () => {
    const toastID = toast.loading('Đang xóa đơn....')

    await formTemplateService.deleteFormTemplate(
      selectedTemplate._id,
      () => {
        toast.update(toastID, {
          render: 'Đã xóa đơn thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })

        setSelectedTemplate(null)
        setOpenDelete(false)

        fetchFormTemplates()
      },
      err => {
        toast.update(toastID, {
          render: err.message || 'Đã có lỗi xảy ra',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  }

  const memoizedSelectedTemplate = useMemo(() => selectedTemplate, [selectedTemplate])

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4'>Danh sách mẫu đơn</Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTemplate(null)
            setOpenForm(true)
          }}
        >
          Thêm mẫu đơn
        </Button>
      </Box>

      <Grid container spacing={3}>
        {formTemplates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: theme.shadows[10]
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant='h6' gutterBottom>
                  {template.title}
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title='Xem PDF'>
                  <IconButton onClick={() => handleViewPDF(template)} color='primary'>
                    <PdfIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Nhân bản'>
                  <IconButton onClick={() => handleDuplicate(template)} color='primary'>
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Sửa'>
                  <IconButton onClick={() => handleEdit(template)} color='primary'>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Xóa'>
                  <IconButton onClick={() => handleDelete(template)} color='error'>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog xem chi tiết */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth='md' fullWidth>
        <DialogContent>
          {memoizedSelectedTemplate && <FormTemplateDetail template={memoizedSelectedTemplate} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog form thêm/sửa: unmount nội dung khi đóng để reset formData */}
      <Dialog open={openForm} onClose={onCloseForm} maxWidth='lg' fullWidth TransitionProps={{ unmountOnExit: true }}>
        <FormTemplateForm
          key={memoizedSelectedTemplate?._id || (openForm ? 'new' + Date.now() : 'new')}
          template={memoizedSelectedTemplate}
          onClose={onCloseForm}
        />
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa mẫu đơn &quot;{memoizedSelectedTemplate?.title}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color='error' autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem PDF */}
      {selectedTemplate && (
        <FormTemplatePDF template={selectedTemplate} open={openPDF} onClose={() => setOpenPDF(false)} />
      )}
    </Box>
  )
}
