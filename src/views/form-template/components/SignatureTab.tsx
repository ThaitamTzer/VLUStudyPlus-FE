import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

import type { Field, Section } from '../types'

interface SignatureTabProps {
  sections: Section[]
  onSectionChange: (index: number, field: keyof Section, value: any) => void
  onRemoveSection: (sectionId: string) => void
  onAddSignatureField: (sectionIndex: number, direction: 'right' | 'down', currentField?: Field) => void
  onRemoveSignatureField: (sectionIndex: number, fieldIndex: number) => void
  onAddSignatureSection: () => void
  signatureTypes: { value: string; label: string }[]
}

export default function SignatureTab({
  sections,
  onSectionChange,
  onRemoveSection,
  onAddSignatureField,
  onRemoveSignatureField,
  onAddSignatureSection,
  signatureTypes
}: SignatureTabProps) {
  // Lọc ra các section chứa chữ ký
  const signatureSections = sections.filter(section => section.fields.some(field => field.type === 'signature'))

  console.log('signatureSections', signatureSections)

  // Nhóm các trường theo row và column
  const groupedFields = signatureSections.map(section => {
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
      {signatureSections.map((section, sectionIndex) => {
        const realSectionIndex = sections.indexOf(section)
        const groupedFieldsObj = groupedFields[sectionIndex].groupedFields

        return (
          <Paper key={sectionIndex} variant='outlined' sx={{ p: 2, mb: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Tooltip title='Xóa phần'>
                <IconButton onClick={() => onRemoveSection(section.id || section.sectionTitle)} color='error'>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {Object.keys(groupedFieldsObj).map(rowKey => {
              const fieldsInRow = groupedFieldsObj[rowKey]

              return (
                <Box key={rowKey} sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    {fieldsInRow.map((field: Field, fieldIndex: number) => {
                      const originalIndex = section.fields.findIndex(
                        (f: Field) => f.row === field.row && f.column === field.column
                      )

                      return (
                        <Grid item xs={12} md={12 / fieldsInRow.length} key={fieldIndex}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, height: '100%' }}>
                            <Paper variant='outlined' sx={{ p: 2, position: 'relative', flex: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size='small'>
                                    <InputLabel>Kiểu chữ ký</InputLabel>
                                    <Select
                                      value={field.key || ''}
                                      label='Kiểu chữ ký'
                                      onChange={e => {
                                        const selectedType = signatureTypes.find(type => type.value === e.target.value)

                                        if (selectedType) {
                                          onSectionChange(realSectionIndex, 'fields', [
                                            ...section.fields.slice(0, originalIndex),
                                            {
                                              ...field,
                                              signatureType: e.target.value,
                                              label: selectedType.label,
                                              key: selectedType.value
                                            },
                                            ...section.fields.slice(originalIndex + 1)
                                          ])
                                        }
                                      }}
                                    >
                                      {signatureTypes.map(type => (
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
                                            onSectionChange(realSectionIndex, 'fields', [
                                              ...section.fields.slice(0, originalIndex),
                                              { ...field, required: e.target.checked },
                                              ...section.fields.slice(originalIndex + 1)
                                            ])
                                          }
                                        />
                                      }
                                      label='Bắt buộc'
                                    />
                                    <Tooltip title='Xóa chữ ký'>
                                      <IconButton
                                        size='small'
                                        color='error'
                                        onClick={() => onRemoveSignatureField(realSectionIndex, originalIndex)}
                                        disabled={section.fields.length <= 1}
                                      >
                                        <DeleteIcon fontSize='small' />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Paper>
                            {fieldIndex === fieldsInRow.length - 1 && fieldsInRow.length < 2 && (
                              <Tooltip title='Thêm chữ ký bên phải'>
                                <IconButton
                                  size='small'
                                  color='primary'
                                  onClick={() => onAddSignatureField(realSectionIndex, 'right', field)}
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

            {/* <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Tooltip title='Thêm chữ ký mới bên dưới'>
                <IconButton
                  size='small'
                  onClick={() => onAddSignatureField(realSectionIndex, 'down')}
                  color='secondary'
                  sx={{
                    border: '1px dashed',
                    borderRadius: 1,
                    width: 40,
                    height: 40
                  }}
                >
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box> */}
          </Paper>
        )
      })}

      <Button startIcon={<AddIcon />} onClick={onAddSignatureSection} variant='contained' sx={{ mt: 2 }}>
        Thêm phần chữ ký
      </Button>
    </Box>
  )
}
