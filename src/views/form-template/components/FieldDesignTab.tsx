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
  onRemoveSection: (sectionId: string) => void
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

// Component hiển thị một section – được memo hoá để chỉ render lại khi object section thay đổi
const SectionFields = memo(
  function SectionFields({
    section,
    localIndex,
    realIndex,
    sectionsLength,
    onRemoveSection,
    onAddContentField,
    onRemoveContentField,
    onFieldChange,
    onSectionChange,
    fieldTypes,
    expandedFields,
    toggleFieldExpansion,
    errors
  }: {
    section: Section
    localIndex: number
    realIndex: number
    sectionsLength: number
    onRemoveSection: (sectionId: string) => void
    onAddContentField: (sectionIndex: number, direction: 'right' | 'down', currentField?: Field) => void
    onRemoveContentField: (sectionIndex: number, fieldIndex: number) => void
    onFieldChange: (sectionIndex: number, fieldIndex: number, field: Field) => void
    onSectionChange: (index: number, field: keyof Section, value: any) => void
    fieldTypes: FieldDesignTabProps['fieldTypes']
    expandedFields: { [key: string]: boolean }
    toggleFieldExpansion: (fieldId: string) => void
    errors: Record<string, string>
  }) {
    // Gom các field theo row/column và memo hoá kết quả
    const groupedFieldsObj = useMemo(() => {
      const rows: { [key: string]: Field[] } = {}

      section.fields.forEach((field: Field) => {
        if (!rows[field.row]) rows[field.row] = []
        rows[field.row].push(field)
      })

      Object.keys(rows).forEach(rowKey => {
        rows[rowKey].sort((a, b) => a.column - b.column)
      })

      return rows
    }, [section.fields])

    const handleLabelChangeLocal = useCallback(
      (originalIndex: number, field: Field, newValue: string) => {
        const updatedField = { ...field, label: newValue }

        onFieldChange(realIndex, originalIndex, updatedField)
      },
      [onFieldChange, realIndex]
    )

    const handleTypeChangeLocal = useCallback(
      (originalIndex: number, field: Field, newType: string) => {
        const defaultValues = fieldTypes.find(type => type.value === newType)

        const updatedField: Field = {
          ...field,
          type: newType,
          minLength: defaultValues?.minLength,
          maxLength: defaultValues?.maxLength,
          min: defaultValues?.min,
          max: defaultValues?.max,
          pattern: undefined
        }

        onFieldChange(realIndex, originalIndex, updatedField)
      },
      [fieldTypes, onFieldChange, realIndex]
    )

    const handleRequiredChangeLocal = useCallback(
      (originalIndex: number, field: Field, isRequired: boolean) => {
        onSectionChange(realIndex, 'fields', [
          ...section.fields.slice(0, originalIndex),
          { ...field, required: isRequired },
          ...section.fields.slice(originalIndex + 1)
        ])
      },
      [onSectionChange, realIndex, section.fields]
    )

    const handleValidationChangeLocal = useCallback(
      (originalIndex: number, field: Field, validationType: string, value: any) => {
        const processedValue = ['minLength', 'maxLength', 'min', 'max'].includes(validationType)
          ? value === ''
            ? undefined
            : Number(value)
          : value

        const updatedField = { ...field, [validationType]: processedValue }

        onFieldChange(realIndex, originalIndex, updatedField)
      },
      [onFieldChange, realIndex]
    )

    return (
      <Paper variant='outlined' sx={{ mb: 3, p: 2, position: 'relative' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Tooltip title='Xóa phần'>
            <IconButton
              onClick={() => onRemoveSection(section.id || section.sectionTitle)}
              color='error'
              disabled={sectionsLength <= 1}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 2 }} />

        {Object.keys(groupedFieldsObj).map(rowKey => {
          const fieldsInRow = groupedFieldsObj[rowKey]

          return (
            <Box key={rowKey} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                {fieldsInRow.map((field, fieldIndex) => {
                  const originalIndex = section.fields.findIndex(f => f.row === field.row && f.column === field.column)
                  const fieldId = `${localIndex}-${originalIndex}`

                  return (
                    <Grid item xs={12} md={12 / fieldsInRow.length} key={fieldIndex}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, height: '100%' }}>
                        <Paper variant='outlined' sx={{ p: 2, position: 'relative', flex: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FieldLabelInput
                                initialValue={field.label}
                                onCommit={newVal => handleLabelChangeLocal(originalIndex, field, newVal)}
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
                                  onChange={e => handleTypeChangeLocal(originalIndex, field, e.target.value)}
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
                                      onChange={e => handleRequiredChangeLocal(originalIndex, field, e.target.checked)}
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
                                      onClick={() => onRemoveContentField(realIndex, originalIndex)}
                                      disabled={section.fields.length <= 1}
                                    >
                                      <DeleteIcon fontSize='small' />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Grid>
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
                                              handleValidationChangeLocal(
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
                                              handleValidationChangeLocal(
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
                                              handleValidationChangeLocal(originalIndex, field, 'min', e.target.value)
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
                                              handleValidationChangeLocal(originalIndex, field, 'max', e.target.value)
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
                              onClick={() => onAddContentField(realIndex, 'right', field)}
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
              onClick={() => onAddContentField(realIndex, 'down')}
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
  },
  (prevProps, nextProps) => {
    // So sánh các props quan trọng để quyết định có re-render không
    return (
      prevProps.section.id === nextProps.section.id &&
      prevProps.section.sectionTitle === nextProps.section.sectionTitle &&
      prevProps.section.fields.length === nextProps.section.fields.length &&
      prevProps.localIndex === nextProps.localIndex &&
      prevProps.realIndex === nextProps.realIndex &&
      prevProps.sectionsLength === nextProps.sectionsLength &&
      prevProps.expandedFields === nextProps.expandedFields
    )
  }
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

  const toggleFieldExpansion = useCallback((fieldId: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }))
  }, [])

  return (
    <Box sx={{ my: 2 }}>
      {otherSections.map((section, idx) => {
        const realIndex = sections.indexOf(section)

        return (
          <SectionFields
            key={section.id || section.sectionTitle}
            section={section}
            localIndex={idx}
            realIndex={realIndex}
            sectionsLength={sections.length}
            onRemoveSection={onRemoveSection}
            onAddContentField={onAddContentField}
            onRemoveContentField={onRemoveContentField}
            onFieldChange={onFieldChange}
            onSectionChange={onSectionChange}
            fieldTypes={fieldTypes}
            expandedFields={expandedFields}
            toggleFieldExpansion={toggleFieldExpansion}
            errors={errors}
          />
        )
      })}

      <Button startIcon={<AddIcon />} onClick={onAddContentSection} variant='contained' sx={{ mt: 2 }}>
        Thêm phần mới
      </Button>
    </Box>
  )
}
