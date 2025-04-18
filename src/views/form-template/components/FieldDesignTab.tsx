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
  Tooltip
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

import type { Field, Section } from '../types'

interface FieldDesignTabProps {
  sections: Section[]
  onSectionChange: (index: number, field: keyof Section, value: any) => void
  onRemoveSection: (index: number) => void
  onAddContentField: (sectionIndex: number, direction: 'right' | 'down', currentField?: Field) => void
  onRemoveContentField: (sectionIndex: number, fieldIndex: number) => void
  onAddContentSection: () => void
  fieldTypes: { value: string; label: string }[]
  onFieldChange: (sectionIndex: number, fieldIndex: number, field: Field) => void
}

export default function FieldDesignTab({
  sections,
  onSectionChange,
  onRemoveSection,
  onAddContentField,
  onRemoveContentField,
  onAddContentSection,
  fieldTypes,
  onFieldChange
}: FieldDesignTabProps) {
  // Lọc ra các section không chứa chữ ký
  const otherSections = sections.filter(section => !section.fields.some(field => field.type === 'signature'))

  // Nhóm các trường theo row và column
  const groupedFields = otherSections.map(section => {
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
  })

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

                      return (
                        <Grid item xs={12} md={12 / fieldsInRow.length} key={fieldIndex}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, height: '100%' }}>
                            <Paper variant='outlined' sx={{ p: 2, position: 'relative', flex: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <TextField
                                    label='Nhãn trường'
                                    value={field.label}
                                    onChange={e => {
                                      const updatedField = { ...field, label: e.target.value }

                                      onFieldChange(sectionIndex, originalIndex, updatedField)
                                    }}
                                    fullWidth
                                    size='small'
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size='small'>
                                    <InputLabel>Loại</InputLabel>
                                    <Select
                                      value={field.type}
                                      label='Loại'
                                      onChange={e =>
                                        onSectionChange(sectionIndex, 'fields', [
                                          ...section.fields.slice(0, originalIndex),
                                          { ...field, type: e.target.value },
                                          ...section.fields.slice(originalIndex + 1)
                                        ])
                                      }
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
                                            onSectionChange(sectionIndex, 'fields', [
                                              ...section.fields.slice(0, originalIndex),
                                              { ...field, required: e.target.checked },
                                              ...section.fields.slice(originalIndex + 1)
                                            ])
                                          }
                                        />
                                      }
                                      label='Bắt buộc'
                                    />
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
