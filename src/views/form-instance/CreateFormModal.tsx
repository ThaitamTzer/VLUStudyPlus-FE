import { useState } from 'react'

import type { KeyedMutator } from 'swr'
import useSWR from 'swr'

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  IconButton,
  Paper
} from '@mui/material'

import { toast } from 'react-toastify'

import formInstanceService from '@/services/formInstance.service'
import formTemplateService from '@/services/formTemplate.service'

import { CustomDialog } from '@/components/CustomDialog'

import type { FormTemplateType, FieldType } from '@/types/management/formTemplateType'
import Iconify from '@/components/iconify'

type CreateFormModalProps = {
  id: string
  idProcess: string
  open: boolean
  onClose: () => void
  mutate: KeyedMutator<any>
}

export default function CreateFormModal(props: CreateFormModalProps) {
  const { id, idProcess, mutate, onClose, open } = props
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: formTemplateData } = useSWR<FormTemplateType>(id ? `/api/form-template/${id}` : null, () =>
    formTemplateService.getFormTemplateById(id)
  )

  console.log(formTemplateData)

  const handleFieldChange = (key: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }))

    // Xóa lỗi khi người dùng nhập lại
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev }

        delete newErrors[key]

        return newErrors
      })
    }
  }

  // Xử lý đặc biệt cho trường chữ ký
  const handleSignatureChange = (key: string, name: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: {
        name: name,
        image: null
      }
    }))

    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev }

        delete newErrors[key]

        return newErrors
      })
    }
  }

  // Hàm xử lý thay đổi trường trong mảng
  const handleArrayFieldChange = (arrayKey: string, index: number, value: any) => {
    setFormValues(prev => {
      const arrayValues = [...(prev[arrayKey] || [])]

      arrayValues[index] = value

      return {
        ...prev,
        [arrayKey]: arrayValues
      }
    })
  }

  // Thêm mục mới vào mảng
  const handleAddArrayItem = (arrayKey: string) => {
    setFormValues(prev => {
      const arrayValues = [...(prev[arrayKey] || [])]

      arrayValues.push('')

      return {
        ...prev,
        [arrayKey]: arrayValues
      }
    })
  }

  // Xóa mục khỏi mảng
  const handleRemoveArrayItem = (arrayKey: string, index: number) => {
    setFormValues(prev => {
      const arrayValues = [...(prev[arrayKey] || [])]

      arrayValues.splice(index, 1)

      return {
        ...prev,
        [arrayKey]: arrayValues
      }
    })
  }

  // Xử lý trước khi gửi form - đảm bảo các trường chữ ký có định dạng đúng
  const prepareFormDataBeforeSubmit = () => {
    const formData = { ...formValues }

    // Kiểm tra và đảm bảo tất cả các trường signature có định dạng đúng
    formTemplateData?.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'signature') {
          // Nếu trường không có giá trị, khởi tạo nó
          if (!formData[field.key]) {
            formData[field.key] = {
              name: '',
              image: null
            }
          }

          // Nếu chỉ có name mà không có cấu trúc đúng
          else if (typeof formData[field.key] === 'string') {
            formData[field.key] = {
              name: formData[field.key],
              image: null
            }
          }
        } else if (field.type === 'array') {
          // Nếu là mảng thì sẽ chuyển thành chuỗi và phân tách bởi dấu phẩy
          if (Array.isArray(formData[field.key])) {
            formData[field.key] = formData[field.key].join(',')
          }
        }
      })
    })

    return formData
  }

  const handleSubmit = async () => {
    // if (!validateForm()) return

    setIsSubmitting(true)

    const formDataPrepared = prepareFormDataBeforeSubmit()

    const data = {
      templateId: formTemplateData?._id,
      responses: formDataPrepared
    }

    const toastID = toast.loading('Đang tạo đơn...')

    await formInstanceService.createForm(
      idProcess,
      data,
      () => {
        toast.update(toastID, {
          render: 'Đã tạo đơn thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })

        mutate()
        setIsSubmitting(false)
        onClose()
      },
      error => {
        toast.update(toastID, {
          render: error.message || 'Không thể tạo đơn',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })

        setIsSubmitting(false)
      }
    )
  }

  const renderField = (field: FieldType) => {
    // Bỏ qua các trường có kiểu là signature

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <TextField
            key={field.key}
            fullWidth
            id={field.key}
            name={field.key}
            label={field.label}
            type={field.type}
            value={formValues[field.key] || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            error={!!errors[field.key]}
            helperText={errors[field.key]}
            required={field.required}
            margin='normal'
            size='small'
          />
        )
      case 'select':
        return (
          <FormControl
            key={field.key}
            fullWidth
            error={!!errors[field.key]}
            required={field.required}
            margin='normal'
            size='small'
          >
            <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.key}-label`}
              id={field.key}
              value={formValues[field.key] || ''}
              label={field.label}
              onChange={e => handleFieldChange(field.key, e.target.value)}
            >
              <MenuItem value=''>
                <em>Chọn</em>
              </MenuItem>
              {/* Nơi này có thể được cập nhật với các tùy chọn thực tế khi có dữ liệu */}
              <MenuItem value='option1'>Tùy chọn 1</MenuItem>
              <MenuItem value='option2'>Tùy chọn 2</MenuItem>
              <MenuItem value='option3'>Tùy chọn 3</MenuItem>
            </Select>
            {errors[field.key] && <FormHelperText>{errors[field.key]}</FormHelperText>}
          </FormControl>
        )
      case 'textarea':
        return (
          <TextField
            key={field.key}
            fullWidth
            id={field.key}
            name={field.key}
            label={field.label}
            multiline
            rows={4}
            value={formValues[field.key] || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            error={!!errors[field.key]}
            helperText={errors[field.key]}
            required={field.required}
            margin='normal'
            size='small'
          />
        )
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.key}
            control={
              <Checkbox
                checked={formValues[field.key] || false}
                onChange={e => handleFieldChange(field.key, e.target.checked)}
              />
            }
            label={field.label}
          />
        )

      case 'array':
        const arrayValues = formValues[field.key] || []

        return (
          <Box key={field.key} sx={{ width: '100%' }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              {field.label}
              {field.required && (
                <Box component='span' sx={{ color: 'error.main' }}>
                  {' '}
                  *
                </Box>
              )}
            </Typography>

            {arrayValues.length > 0 ? (
              <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
                {arrayValues.map((value: string, index: number) => (
                  <Stack key={index} direction='row' spacing={2} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      size='small'
                      multiline
                      rows={4}
                      value={value}
                      onChange={e => handleArrayFieldChange(field.key, index, e.target.value)}
                      placeholder={`Mục ${index + 1}`}
                    />
                    <IconButton color='error' onClick={() => handleRemoveArrayItem(field.key, index)} size='small'>
                      <Iconify icon='mdi:delete' />
                    </IconButton>
                  </Stack>
                ))}
              </Paper>
            ) : errors[field.key] ? (
              <Typography color='error.main' variant='caption' sx={{ mb: 1, display: 'block' }}>
                {errors[field.key]}
              </Typography>
            ) : null}

            <Button
              startIcon={<Iconify icon='mdi:plus' />}
              onClick={() => handleAddArrayItem(field.key)}
              variant='outlined'
              size='small'
              sx={{ mb: 2 }}
            >
              Thêm {field.label.toLowerCase()}
            </Button>
          </Box>
        )
      case 'signature':
        return (
          <Box key={field.key} sx={{ mt: 2, mb: 2, width: '100%' }}>
            <Typography variant='subtitle2' gutterBottom>
              {field.label}
              {field.required && (
                <Box component='span' sx={{ color: 'error.main' }}>
                  {' '}
                  *
                </Box>
              )}
            </Typography>
            <Paper variant='outlined' sx={{ p: 2 }}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Nhập tên người ký
              </Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Nhập tên người ký'
                value={formValues[field.key]?.name || ''}
                onChange={e => handleSignatureChange(field.key, e.target.value)}
                error={!!errors[field.key]}
                helperText={errors[field.key]}
                sx={{ mb: 1 }}
              />
              <Typography variant='caption' color='text.secondary'>
                Chữ ký điện tử sẽ được thêm sau khi gửi đơn
              </Typography>
            </Paper>
          </Box>
        )
      default:
        return (
          <TextField
            key={field.key}
            fullWidth
            id={field.key}
            name={field.key}
            label={field.label}
            value={formValues[field.key] || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            error={!!errors[field.key]}
            helperText={errors[field.key]}
            required={field.required}
            margin='normal'
            size='small'
          />
        )
    }
  }

  return (
    <CustomDialog open={open} onClose={onClose} title={formTemplateData?.title || 'Tạo đơn'} closeOutside maxWidth='md'>
      <Box sx={{ p: 2 }}>
        {formTemplateData ? (
          <>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              {formTemplateData.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box component='form' noValidate autoComplete='off'>
              {formTemplateData.sections.map(section => (
                <Box key={section._id}>
                  <Grid container>
                    {section.fields.map(field => (
                      <Grid item xs={12} key={field._id}>
                        {renderField(field)}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}

              <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
                <Button variant='outlined' onClick={onClose} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button variant='contained' onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi...' : 'Gửi đơn'}
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography>Đang tải thông tin đơn...</Typography>
          </Box>
        )}
      </Box>
    </CustomDialog>
  )
}
