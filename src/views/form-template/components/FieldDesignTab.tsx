import { useState, useMemo, useCallback, useEffect, memo } from 'react'

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Collapse,
  Typography
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

import type { Field, Section } from '../types'

interface FieldDesignTabProps {
  sections: Section[]
  onSectionChange: (index: number, field: keyof Section, value: any) => void
  onRemoveSection: (index: number) => void
  onAddContentField: (sectionIndex: number, direction: 'right' | 'down', currentField?: Field) => void
  onRemoveContentField: (sectionIndex: number, fieldIndex: number) => void
  onAddContentSection: () => void
  fieldTypes: { value: string; label: string; minLength?: number; maxLength?: number; min?: number; max?: number }[]
  onFieldChange: (sectionIndex: number, fieldIndex: number, field: Field) => void
  errors?: Record<string, string>
}

// Local memoized input to handle label edits with local state and commit on blur
interface FieldLabelInputProps {
  initialValue: string
  onCommit: (value: string) => void
  error?: boolean
  helperText?: string
}

const FieldLabelInput = memo<FieldLabelInputProps>(
  ({ initialValue, onCommit, error, helperText }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <TextField
        label='Nhãn trường'
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => onCommit(value)}
        fullWidth
        size='small'
        error={error}
        helperText={helperText}
      />
    )
  },
  (prev, next) =>
    prev.initialValue === next.initialValue && prev.error === next.error && prev.helperText === next.helperText
)

export default function FieldDesignTab({
  sections,
  onSectionChange,
  onRemoveSection,
  onAddContentField,
  onRemoveContentField,
  onAddContentSection,
  fieldTypes,
  onFieldChange,
  errors = {}
}: FieldDesignTabProps) {
  // Lọc ra các section không chứa chữ ký
  const otherSections = useMemo(
    () => sections.filter(section => !section.fields.some(field => field.type === 'signature')),
    [sections]
  )

  const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({})

  // Nhóm các trường theo row và column
  const groupedFields = useMemo(
    () =>
      otherSections.map(section => {
        const rows: { [key: string]: Field[] } = {}

        section.fields.forEach((field: Field) => {
          if (!rows[field.row]) {
            rows[field.row] = []
          }

          rows[field.row].push(field)
        })

        // Sắp xếp các trường trong mỗi row theo column
        Object.keys(rows).forEach(rowKey => {
          rows[rowKey].sort((a: Field, b: Field) => a.column - b.column)
        })

        return {
          ...section,
          groupedFields: rows
        }
      }),
    [otherSections]
  )

  const toggleFieldExpansion = useCallback((fieldId: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }))
  }, [])

  const handleValidationChange = useCallback(
    (sectionIndex: number, fieldIndex: number, field: Field, validationType: string, value: any) => {
      // Chuyển đổi giá trị sang số nếu là trường số
      const processedValue = ['minLength', 'maxLength', 'min', 'max'].includes(validationType)
        ? value === ''
          ? undefined
          : Number(value)
        : value

      const updatedField = {
        ...field,
        [validationType]: processedValue
      }

      onFieldChange(sectionIndex, fieldIndex, updatedField)
    },
    [onFieldChange]
  )

  const handleLabelChange = useCallback(
    (sectionIndex: number, originalIndex: number, field: Field, newValue: string) => {
      const updatedField = { ...field, label: newValue }

      onFieldChange(sectionIndex, originalIndex, updatedField)
    },
    [onFieldChange]
  )

  const handleTypeChange = useCallback(
    (sectionIndex: number, originalIndex: number, field: Field, newType: string) => {
      const defaultValues = fieldTypes.find(type => type.value === newType)

      const updatedField = {
        ...field,
        type: newType,
        minLength: defaultValues?.minLength,
        maxLength: defaultValues?.maxLength,
        min: defaultValues?.min,
        max: defaultValues?.max,
        pattern: undefined
      }

      onFieldChange(sectionIndex, originalIndex, updatedField)
    },
    [onFieldChange, fieldTypes]
  )

  const handleRequiredChange = useCallback(
    (sectionIndex: number, originalIndex: number, field: Field, section: Section, isRequired: boolean) => {
      onSectionChange(sectionIndex, 'fields', [
        ...section.fields.slice(0, originalIndex),
        { ...field, required: isRequired },
        ...section.fields.slice(originalIndex + 1)
      ])
    },
    [onSectionChange]
  )

  return (
    <Box sx={{ my: 2 }}>
      {otherSections.map((section, sectionIndex) => {
        const groupedFieldsObj = groupedFields[sectionIndex].groupedFields

        return (
          <Paper key={sectionIndex} variant='outlined' sx={{ mb: 3, p: 2, position: 'relative' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Tooltip title='Xóa phần'>
                <IconButton onClick={() => onRemoveSection(sectionIndex)} color='error' disabled={sections.length <= 1}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Hiển thị các trường theo row/column */}
            {Object.keys(groupedFieldsObj).map(rowKey => {
              const fieldsInRow = groupedFieldsObj[rowKey]

              return (
                <Box key={rowKey} sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    {fieldsInRow.map((field: Field, fieldIndex: number) => {
                      // Tìm vị trí thực tế của field trong mảng gốc
                      const originalIndex = section.fields.findIndex(
                        (f: Field) => f.row === field.row && f.column === field.column
                      )

                      const fieldId = `${sectionIndex}-${originalIndex}`

                      return (
                        <Grid item xs={12} md={12 / fieldsInRow.length} key={fieldIndex}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, height: '100%' }}>
                            <Paper variant='outlined' sx={{ p: 2, position: 'relative', flex: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <FieldLabelInput
                                    initialValue={field.label}
                                    onCommit={newVal => handleLabelChange(sectionIndex, originalIndex, field, newVal)}
                                    error={!!errors[`field_${fieldId}_label`]}
                                    helperText={errors[`field_${fieldId}_label`]}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size='small'>
                                    <InputLabel>Loại</InputLabel>
                                    <Select
                                      value={field.type}
                                      label='Loại'
                                      onChange={e =>
                                        handleTypeChange(sectionIndex, originalIndex, field, e.target.value)
                                      }
                                      error={!!errors[`field_${fieldId}_type`]}
                                    >
                                      {fieldTypes.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                          {type.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={field.required}
                                          onChange={e =>
                                            handleRequiredChange(
                                              sectionIndex,
                                              originalIndex,
                                              field,
                                              section,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      }
                                      label='Bắt buộc'
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {field.required &&
                                        field.type !== 'signature' &&
                                        field.type !== 'checkbox' &&
                                        field.type !== 'array' &&
                                        field.type !== 'date' && (
                                          <Tooltip title='Cấu hình nâng cao'>
                                            <Button
                                              startIcon={
                                                <ExpandMoreIcon
                                                  fontSize='small'
                                                  sx={{
                                                    transform: expandedFields[fieldId] ? 'rotate(180deg)' : 'none',
                                                    transition: 'transform 0.3s'
                                                  }}
                                                />
                                              }
                                              size='small'
                                              onClick={() => toggleFieldExpansion(fieldId)}
                                              sx={{ mr: 1 }}
                                            >
                                              Nâng cao
                                            </Button>
                                          </Tooltip>
                                        )}
                                      <Tooltip title='Xóa trường'>
                                        <IconButton
                                          size='small'
                                          color='error'
                                          onClick={() => onRemoveContentField(sectionIndex, originalIndex)}
                                          disabled={section.fields.length <= 1}
                                        >
                                          <DeleteIcon fontSize='small' />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                </Grid>

                                {/* Validation Settings */}
                                <Grid item xs={12}>
                                  <Collapse in={expandedFields[fieldId]}>
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                      <Typography variant='subtitle2' sx={{ mb: 2 }}>
                                        Cấu hình validation
                                      </Typography>
                                      <Grid container spacing={2}>
                                        {(field.type === 'text' ||
                                          field.type === 'shortText' ||
                                          field.type === 'longText' ||
                                          field.type === 'textarea' ||
                                          field.type === 'phone') && (
                                          <>
                                            <Grid item xs={6}>
                                              <TextField
                                                label='Độ dài tối thiểu'
                                                type='number'
                                                value={
                                                  field.minLength ||
                                                  fieldTypes.find(type => type.value === field.type)?.minLength ||
                                                  ''
                                                }
                                                onChange={e =>
                                                  handleValidationChange(
                                                    sectionIndex,
                                                    originalIndex,
                                                    field,
                                                    'minLength',
                                                    e.target.value
                                                  )
                                                }
                                                fullWidth
                                                size='small'
                                                error={!!errors[`field_${fieldId}_minLength`]}
                                                helperText={errors[`field_${fieldId}_minLength`]}
                                              />
                                            </Grid>
                                            <Grid item xs={6}>
                                              <TextField
                                                label='Độ dài tối đa'
                                                type='number'
                                                value={field.maxLength || ''}
                                                onChange={e =>
                                                  handleValidationChange(
                                                    sectionIndex,
                                                    originalIndex,
                                                    field,
                                                    'maxLength',
                                                    e.target.value
                                                  )
                                                }
                                                fullWidth
                                                size='small'
                                                error={!!errors[`field_${fieldId}_maxLength`]}
                                                helperText={errors[`field_${fieldId}_maxLength`]}
                                              />
                                            </Grid>
                                          </>
                                        )}
                                        {field.type === 'number' && (
                                          <>
                                            <Grid item xs={6}>
                                              <TextField
                                                label='Giá trị tối thiểu'
                                                type='number'
                                                value={field.min || ''}
                                                onChange={e =>
                                                  handleValidationChange(
                                                    sectionIndex,
                                                    originalIndex,
                                                    field,
                                                    'min',
                                                    e.target.value
                                                  )
                                                }
                                                fullWidth
                                                size='small'
                                                error={!!errors[`field_${fieldId}_min`]}
                                                helperText={errors[`field_${fieldId}_min`]}
                                              />
                                            </Grid>
                                            <Grid item xs={6}>
                                              <TextField
                                                label='Giá trị tối đa'
                                                type='number'
                                                value={field.max || ''}
                                                onChange={e =>
                                                  handleValidationChange(
                                                    sectionIndex,
                                                    originalIndex,
                                                    field,
                                                    'max',
                                                    e.target.value
                                                  )
                                                }
                                                fullWidth
                                                size='small'
                                                error={!!errors[`field_${fieldId}_max`]}
                                                helperText={errors[`field_${fieldId}_max`]}
                                              />
                                            </Grid>
                                          </>
                                        )}
                                      </Grid>
                                    </Box>
                                  </Collapse>
                                </Grid>
                              </Grid>
                            </Paper>
                            {fieldIndex === fieldsInRow.length - 1 && fieldsInRow.length < 3 && (
                              <Tooltip title='Thêm trường mới bên phải'>
                                <IconButton
                                  size='small'
                                  color='primary'
                                  onClick={() => onAddContentField(sectionIndex, 'right', field)}
                                  sx={{
                                    border: '1px dashed',
                                    borderRadius: 1,
                                    width: 40,
                                    height: '100%',
                                    mt: 1
                                  }}
                                >
                                  <AddIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              )
            })}

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Tooltip title='Thêm trường mới bên dưới'>
                <IconButton
                  size='small'
                  onClick={() => onAddContentField(sectionIndex, 'down')}
                  color='secondary'
                  sx={{
                    border: '1px dashed',
                    borderRadius: 1,
                    width: 1,
                    height: '100%',
                    mt: 1
                  }}
                >
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        )
      })}

      <Button startIcon={<AddIcon />} onClick={onAddContentSection} variant='contained' sx={{ mt: 2 }}>
        Thêm phần mới
      </Button>
    </Box>
  )
}
