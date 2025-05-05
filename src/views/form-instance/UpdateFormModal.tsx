'use client'

import { useState, useEffect, useRef } from 'react'

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
  Paper,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Skeleton
} from '@mui/material'

import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

import SignatureCanvas from 'react-signature-canvas'

import formInstanceService from '@/services/formInstance.service'
import formTemplateService from '@/services/formTemplate.service'

import { CustomDialog } from '@/components/CustomDialog'

import type { FormTemplateType, FieldType } from '@/types/management/formTemplateType'
import type { FormInstanceType } from '@/types/management/formInstanceType'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomIconButton from '@/@core/components/mui/IconButton'

// Mở rộng FieldType để thêm các thuộc tính validation
interface ExtendedFieldType extends FieldType {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
}

interface FormFieldValue {
  text: string
  email: string
  number: number
  select: string
  textarea: string
  checkbox: boolean
  array: string[]
  signature: {
    name: string
    image: string | null
  }
}

type FormFieldType = keyof FormFieldValue

interface FormValues {
  [key: string]: FormFieldValue[FormFieldType]
}

type UpdateFormModalProps = {
  id: string
  open: boolean
  onClose: () => void
  mutate: KeyedMutator<any>
  formInstance: FormInstanceType | null
}

export default function UpdateFormModal(props: UpdateFormModalProps) {
  const { id, mutate, onClose, open, formInstance } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationSchema, setValidationSchema] = useState<any>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<any>(null)
  const sigCanvas = useRef<SignatureCanvas>(null)
  const steps = ['Điền thông tin', 'Ký tên']

  const { data: formTemplateData } = useSWR<FormTemplateType>(id ? `/api/form-template/${id}` : null, () =>
    formTemplateService.getFormTemplateById(id)
  )

  console.log('formTemplateData', formTemplateData)
  console.log('formInstance', formInstance)

  // Tạo schema validation dựa trên các trường trong form template
  useEffect(() => {
    if (formTemplateData && formInstance) {
      const schemaFields: Record<string, any> = {}

      formTemplateData.sections.forEach(section => {
        section.fields.forEach(field => {
          const extendedField = field as ExtendedFieldType

          // Tạo validation rules dựa trên loại trường và các thuộc tính validation
          let fieldSchema: any = v.string()

          // Thêm validation cho trường bắt buộc
          if (field.required) {
            fieldSchema = v.pipe(fieldSchema, v.nonEmpty(`${field.label} là trường bắt buộc`))
          }

          // Thêm validation dựa trên loại trường
          switch (field.type) {
            case 'text':
            case 'shortText':
            case 'longText':
            case 'textarea':
              if (extendedField.minLength) {
                fieldSchema = v.pipe(
                  fieldSchema,
                  v.minLength(
                    extendedField.minLength,
                    `${field.label} phải có ít nhất ${extendedField.minLength} ký tự`
                  )
                )
              }

              if (extendedField.maxLength) {
                fieldSchema = v.pipe(
                  fieldSchema,
                  v.maxLength(
                    extendedField.maxLength,
                    `${field.label} không được vượt quá ${extendedField.maxLength} ký tự`
                  )
                )
              }

              break
            case 'number':
              fieldSchema = v.pipe(v.number('Vui lòng nhập vào số'), v.transform(Number))

              if (extendedField.min !== undefined) {
                fieldSchema = v.pipe(
                  fieldSchema,
                  v.minValue(extendedField.min, `${field.label} phải lớn hơn hoặc bằng ${extendedField.min}`)
                )
              }

              if (extendedField.max !== undefined) {
                fieldSchema = v.pipe(
                  fieldSchema,
                  v.maxValue(extendedField.max, `${field.label} phải nhỏ hơn hoặc bằng ${extendedField.max}`)
                )
              }

              break
            case 'array':
              fieldSchema = v.array(v.string())

              if (field.required) {
                fieldSchema = v.pipe(fieldSchema, v.nonEmpty(`${field.label} là trường bắt buộc`))
              }

              break
            case 'signature':
              fieldSchema = v.object({
                name: field.required ? v.pipe(v.string(), v.nonEmpty(`${field.label} là trường bắt buộc`)) : v.string(),
                image: v.optional(v.nullable(v.string(), null))
              })
              break
            case 'checkbox':
              fieldSchema = v.boolean()
              break
            default:
              // Mặc định là string
              break
          }

          schemaFields[field.key] = fieldSchema
        })
      })

      setValidationSchema(v.object(schemaFields))
    }
  }, [formTemplateData, formInstance])

  // Khởi tạo form với react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    mode: 'all',
    resolver: validationSchema ? valibotResolver(validationSchema) : undefined,
    defaultValues: formInstance?.responses || {}
  })

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      reset()
      setActiveStep(0)

      if (sigCanvas.current) {
        sigCanvas.current.clear()
      }
    }
  }, [open, reset])

  // Cập nhật giá trị form khi formInstance thay đổi
  useEffect(() => {
    if (formInstance?.responses) {
      Object.entries(formInstance.responses).forEach(([key, value]) => {
        setValue(key, value as any)
      })
    }
  }, [formInstance, setValue])

  // Xử lý trước khi gửi form - đảm bảo các trường chữ ký có định dạng đúng
  const prepareFormDataBeforeSubmit = (data: any) => {
    const formData = { ...data }

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
          formData[field.key] = formData[field.key].map((item: string) => item.trim())
        }
      })
    })

    return formData
  }

  const handleNextStep = async (data: FormValues) => {
    const formDataPrepared = prepareFormDataBeforeSubmit(data)

    setFormData(formDataPrepared)
    setActiveStep(1)
  }

  const handleBack = () => {
    setActiveStep(0)
  }

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
    }
  }

  const onSubmit = async () => {
    if (!formData) {
      return toast.error('Vui lòng điền thông tin đơn trước', { autoClose: 3000 })
    }

    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      return toast.error('Chữ ký không được để trống', { autoClose: 3000 })
    }

    setIsSubmitting(true)

    const toastID = toast.loading('Đang cập nhật đơn...')

    // Cập nhật đơn trước
    await formInstanceService.updateForm(
      formInstance?._id || '',
      {
        templateId: formTemplateData?._id,
        responses: formData
      },
      async res => {
        toast.update(toastID, {
          render: 'Đã cập nhật đơn thành công, đang ký tên...',
          type: 'success',
          isLoading: true,
          autoClose: 2000
        })

        // Sau khi cập nhật đơn thành công, thêm chữ ký
        const dataUrl = sigCanvas.current?.toDataURL('image/png')

        if (dataUrl) {
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], 'signature.png', { type: 'image/png' })
          const formData = new FormData()

          formData.append('insertSignature', file)
          formData.append('keyInsert', 'applicantSignature')

          await formInstanceService.inSertSignature(
            res._id,
            formData,
            () => {
              toast.update(toastID, {
                render: 'Đã cập nhật đơn và ký tên thành công',
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
                render: error.message || 'Không thể ký tên',
                type: 'error',
                isLoading: false,
                autoClose: 3000
              })
              setIsSubmitting(false)
            }
          )
        }
      },
      error => {
        toast.update(toastID, {
          render: error.message || 'Không thể cập nhật đơn',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        setIsSubmitting(false)
      }
    )
  }

  const renderField = (field: FieldType) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <CustomTextField
                fullWidth
                id={field.key}
                name={field.key}
                label={field.label}
                type={field.type}
                value={(value as string) || ''}
                onChange={onChange}
                {...((errors as any)[field.key] && { error: true, helperText: (errors as any)[field.key].message })}
                required={field.required}
                margin='normal'
                size='small'
              />
            )}
          />
        )
      case 'number':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
              <CustomTextField
                fullWidth
                id={field.key}
                name={field.key}
                label={field.label}
                type={field.type}
                value={value === undefined || value === null ? '' : value}
                onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                {...((errors as any)[field.key] && { error: true, helperText: (errors as any)[field.key].message })}
                required={field.required}
                margin='normal'
                size='small'
              />
            )}
          />
        )
      case 'select':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <FormControl
                fullWidth
                error={!!(errors as any)[field.key]}
                required={field.required}
                margin='normal'
                size='small'
              >
                <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
                <Select
                  labelId={`${field.key}-label`}
                  id={field.key}
                  value={(value as string) || ''}
                  label={field.label}
                  onChange={onChange}
                >
                  <MenuItem value=''>
                    <em>Chọn</em>
                  </MenuItem>
                  {/* Nơi này có thể được cập nhật với các tùy chọn thực tế khi có dữ liệu */}
                  <MenuItem value='option1'>Tùy chọn 1</MenuItem>
                  <MenuItem value='option2'>Tùy chọn 2</MenuItem>
                  <MenuItem value='option3'>Tùy chọn 3</MenuItem>
                </Select>
                {(errors as any)[field.key] && <FormHelperText>{(errors as any)[field.key].message}</FormHelperText>}
              </FormControl>
            )}
          />
        )
      case 'textarea':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                id={field.key}
                name={field.key}
                label={field.label}
                multiline
                rows={4}
                value={(value as string) || ''}
                onChange={onChange}
                error={!!(errors as any)[field.key]}
                helperText={(errors as any)[field.key]?.message}
                required={field.required}
                margin='normal'
                size='small'
              />
            )}
          />
        )
      case 'checkbox':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={<Checkbox checked={(value as boolean) || false} onChange={onChange} />}
                label={field.label}
              />
            )}
          />
        )

      case 'array':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => {
              const arrayValues = (value as string[]) || []

              return (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='subtitle2' sx={{ mb: 1, width: '100%' }}>
                    {field.label}
                    {field.required && (
                      <Box component='span' sx={{ color: 'error.main' }}>
                        {' '}
                        *
                      </Box>
                    )}
                  </Typography>

                  {arrayValues.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      {arrayValues.map((item: string, index: number) => (
                        <Box key={index} sx={{ width: '100%', p: 2, mb: 2 }}>
                          <TextField
                            fullWidth
                            size='small'
                            multiline
                            rows={6}
                            value={item}
                            onChange={e => {
                              const newArray = [...arrayValues]

                              newArray[index] = e.target.value
                              onChange(newArray)
                              setValue(field.key, newArray)
                            }}
                            placeholder={`Mục ${index + 1}`}
                          />
                          <IconButton
                            color='error'
                            onClick={() => {
                              const newArray = [...arrayValues]

                              newArray.splice(index, 1)
                              onChange(newArray)
                            }}
                            size='small'
                            sx={{ ml: 'auto' }}
                          >
                            <Iconify icon='mdi:delete' />
                          </IconButton>
                        </Box>
                      ))}
                      <Tooltip title='Thêm mục'>
                        <CustomIconButton
                          onClick={() => {
                            const newArray = [...arrayValues, '']

                            onChange(newArray)
                          }}
                          variant='contained'
                          size='small'
                          sx={{ mb: 2, width: '100%', display: arrayValues.length > 1 ? 'none' : 'block' }}
                        >
                          <Iconify icon='mdi:plus' />
                        </CustomIconButton>
                      </Tooltip>
                    </Box>
                  ) : (errors as any)[field.key] ? (
                    <Typography color='error.main' variant='caption' sx={{ mb: 1, display: 'block', width: '100%' }}>
                      {(errors as any)[field.key].message}
                    </Typography>
                  ) : null}
                  {arrayValues.length < 1 && (
                    <Button
                      startIcon={<Iconify icon='mdi:plus' />}
                      onClick={() => {
                        const newArray = [...arrayValues, '']

                        onChange(newArray)
                      }}
                      variant='outlined'
                      size='small'
                      sx={{ mb: 2, width: '100%' }}
                    >
                      Thêm {field.label.toLowerCase()}
                    </Button>
                  )}
                </Box>
              )
            }}
          />
        )
      case 'signature':
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue={{ name: '', image: null }}
            render={({ field: { onChange, value } }) => {
              const signatureValue = value as { name: string; image: string | null }

              return (
                <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
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
                    <CustomTextField
                      fullWidth
                      size='small'
                      placeholder='Nhập tên người ký'
                      value={signatureValue?.name || ''}
                      onChange={e => {
                        onChange({ ...signatureValue, name: e.target.value })
                      }}
                      error={!!(errors as any)[field.key]}
                      helperText={(errors as any)[field.key]?.name?.message}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant='caption' color='text.secondary'>
                      Chữ ký điện tử sẽ được thêm sau khi gửi đơn
                    </Typography>
                  </Paper>
                </Box>
              )
            }}
          />
        )
      default:
        return (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                id={field.key}
                name={field.key}
                label={field.label}
                value={(value as string) || ''}
                onChange={onChange}
                error={!!(errors as any)[field.key]}
                helperText={(errors as any)[field.key]?.message}
                required={field.required}
                margin='normal'
                size='small'
              />
            )}
          />
        )
    }
  }

  const renderSignatureStep = () => {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='h6' gutterBottom>
          Ký tên
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Vui lòng ký tên vào ô bên dưới
        </Typography>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SignatureCanvas
            ref={sigCanvas}
            penColor='black'
            minWidth={2}
            canvasProps={{
              width: 300,
              height: 150,
              className: 'sigCanvas border border-black border-dashed'
            }}
          />
        </Box>
        <Button variant='outlined' color='error' sx={{ mb: 2 }} onClick={handleClear} disabled={isSubmitting}>
          Xóa chữ ký
        </Button>
      </Box>
    )
  }

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={formTemplateData?.title || 'Cập nhật đơn'}
      closeOutside
      maxWidth='md'
      actions={
        <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
          {activeStep > 0 && (
            <Button variant='outlined' onClick={handleBack} disabled={isSubmitting}>
              Quay lại
            </Button>
          )}
          <Button variant='outlined' onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          {activeStep === 0 ? (
            <Button variant='contained' onClick={handleSubmit(handleNextStep)} disabled={isSubmitting}>
              Tiếp theo
            </Button>
          ) : (
            <Button variant='contained' onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật đơn'}
            </Button>
          )}
        </Stack>
      }
    >
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? (
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
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Skeleton variant='text' width={210} height={40} sx={{ mb: 2 }} />
              <Skeleton variant='rectangular' width='100%' height={118} />
            </Box>
          )}
        </Box>
      ) : (
        renderSignatureStep()
      )}
    </CustomDialog>
  )
}
