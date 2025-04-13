import { useState, useEffect } from 'react'

import { Button, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material'

import { toast } from 'react-toastify'

import useFormTemplateStore from '@/stores/formTemplate.store'
import type { Field, FormTemplate, Section } from './types'
import BasicInfoTab from './components/BasicInfoTab'
import RecipientTab from './components/RecipientTab'
import FieldDesignTab from './components/FieldDesignTab'
import SignatureTab from './components/SignatureTab'
import formTemplateService from '@/services/formTemplate.service'

const FIELD_TYPES = [
  { value: 'text', label: 'Chữ' },
  { value: 'shortText', label: 'Chữ ngắn' },
  { value: 'longText', label: 'Chữ dài' },
  { value: 'number', label: 'Số' },
  { value: 'array', label: 'Mảng' },
  { value: 'date', label: 'Ngày' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'textArea', label: 'Mô tả' }
]

const SIGNATURE_TYPES = [
  { value: 'rectorSignature', label: 'TL. HIỆU TRƯỞNG - TRƯỞNG PHÒNG ĐÀO TẠO' },
  { value: 'facultyBoardSignature', label: 'BAN CHỦ NHIỆM KHOA' },
  { value: 'applicantSignature', label: 'Người làm đơn' },
  { value: 'parentSignature', label: 'Xác nhận của phụ huynh SV' }
]

interface FormTemplateFormProps {
  template?: FormTemplate & { _id: string }
  onClose: () => void
}

export default function FormTemplateForm({ template, onClose }: FormTemplateFormProps) {
  const { fetchFormTemplates } = useFormTemplateStore()
  const [activeTab, setActiveTab] = useState(0)

  const [formData, setFormData] = useState<FormTemplate>(
    template || {
      title: '',
      documentCode: 'Số:……………………..',
      recipient: [''],
      description: '',
      sections: [
        {
          sectionTitle: 'contentSection1',
          fields: [
            {
              label: '',
              key: '',
              type: 'text',
              row: 1,
              column: 1,
              required: true
            }
          ]
        }
      ]
    }
  )

  useEffect(() => {
    if (template) {
      setFormData(template)
    }
  }, [template])

  const handleChange = (field: keyof FormTemplate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...formData.recipient]

    newRecipients[index] = value
    handleChange('recipient', newRecipients)
  }

  const addRecipient = () => {
    handleChange('recipient', [...formData.recipient, ''])
  }

  const removeRecipient = (index: number) => {
    const newRecipients = formData.recipient.filter((_: string, i: number) => i !== index)

    handleChange('recipient', newRecipients)
  }

  const handleSectionChange = (index: number, field: keyof Section, value: any) => {
    const newSections = [...formData.sections]
    const section = newSections[index]
    const isSignatureSection = section.fields.some(field => field.type === 'signature')

    // Nếu đang thay đổi tiêu đề section, kiểm tra xem có phải là section chữ ký không
    if (field === 'sectionTitle') {
      const sectionType = isSignatureSection ? 'signatureSection' : 'contentSection'

      const sectionCount = formData.sections.filter(s =>
        isSignatureSection ? s.fields.some(f => f.type === 'signature') : !s.fields.some(f => f.type === 'signature')
      ).length

      value = `${sectionType}${sectionCount}`
    }

    newSections[index] = {
      ...newSections[index],
      [field]: value
    }
    handleChange('sections', newSections)
  }

  const removeSection = (index: number) => {
    const newSections = formData.sections.filter((_: Section, i: number) => i !== index)

    handleChange('sections', newSections)
  }

  const findNextPosition = (
    sectionIndex: number,
    direction: 'right' | 'down',
    currentRow: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentColumn: number
  ) => {
    const fields = formData.sections[sectionIndex].fields

    if (direction === 'right') {
      // Kiểm tra xem row hiện tại có đủ chỗ thêm một field không (max 3 field trên một row)
      const fieldsInCurrentRow = fields.filter((f: Field) => f.row === currentRow)
      const maxColumnInRow = Math.max(...fieldsInCurrentRow.map((f: Field) => f.column))

      return { row: currentRow, column: maxColumnInRow + 1 }
    } else {
      // Tìm row mới
      const maxRow = Math.max(...fields.map((f: Field) => f.row))

      return { row: maxRow + 1, column: 1 }
    }
  }

  const addContentSection = () => {
    const contentSectionCount = formData.sections.filter(
      section => !section.fields.some(field => field.type === 'signature')
    ).length

    handleChange('sections', [
      ...formData.sections,
      {
        sectionTitle: `contentSection${contentSectionCount + 1}`,
        fields: [
          {
            label: '',
            key: '',
            type: 'text',
            row: 1,
            column: 1,
            required: true
          }
        ]
      }
    ])
  }

  const addSignatureSection = () => {
    const signatureSectionCount = formData.sections.filter(section =>
      section.fields.some(field => field.type === 'signature')
    ).length

    const newSections = [...formData.sections]

    newSections.push({
      sectionTitle: `signatureSection${signatureSectionCount + 1}`,
      fields: [
        {
          label: SIGNATURE_TYPES[0].label,
          key: SIGNATURE_TYPES[0].value,
          type: 'signature',
          signatureType: SIGNATURE_TYPES[0].value,
          row: 1,
          column: 1,
          required: true
        }
      ]
    })
    handleChange('sections', newSections)
  }

  const addContentField = (sectionIndex: number, direction: 'right' | 'down' = 'down', currentField?: Field) => {
    const newSections = [...formData.sections]
    const fields = newSections[sectionIndex].fields

    // Tìm field cuối cùng để xác định vị trí mới
    const lastField = currentField || fields[fields.length - 1]
    const { row, column } = findNextPosition(sectionIndex, direction, lastField.row, lastField.column)

    // Thêm field mới với vị trí đã tính toán
    const newField = {
      label: '',
      key: '',
      type: 'text',
      row,
      column,
      required: true
    }

    fields.push(newField)
    newSections[sectionIndex].fields = fields
    handleChange('sections', newSections)
  }

  const addSignatureField = (sectionIndex: number, direction: 'right' | 'down' = 'down', currentField?: Field) => {
    const newSections = [...formData.sections]
    const fields = newSections[sectionIndex].fields

    // Tìm field cuối cùng để xác định vị trí mới
    const lastField = currentField || fields[fields.length - 1]
    const { row, column } = findNextPosition(sectionIndex, direction, lastField.row, lastField.column)

    // Thêm field mới với vị trí đã tính toán
    const newField = {
      label: SIGNATURE_TYPES[0].label,
      key: SIGNATURE_TYPES[0].value,
      type: 'signature',
      signatureType: SIGNATURE_TYPES[0].value,
      row,
      column,
      required: true
    }

    fields.push(newField)
    newSections[sectionIndex].fields = fields
    handleChange('sections', newSections)
  }

  const removeContentField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...formData.sections]
    const section = newSections[sectionIndex]

    section.fields = section.fields.filter((_: Field, i: number) => i !== fieldIndex)
    handleChange('sections', newSections)
  }

  const removeSignatureField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...formData.sections]
    const section = newSections[sectionIndex]

    section.fields = section.fields.filter((_: Field, i: number) => i !== fieldIndex)
    handleChange('sections', newSections)
  }

  const handleSubmit = async () => {
    try {
      if (template) {
        const toastID = toast.loading('Đang cập nhật đơn....')

        await formTemplateService.updateFormTemplate(
          template._id,
          formData,
          () => {
            toast.update(toastID, {
              render: 'Đã cập nhật đơn thành công',
              type: 'success',
              isLoading: false,
              autoClose: 3000
            })

            onClose()
            fetchFormTemplates()
          },
          err => {
            toast.update(toastID, {
              render: err.message || 'Đã cập nhật đơn thành công',
              type: 'error',
              isLoading: false,
              autoClose: 3000
            })
          }
        )
      } else {
        const toastID = toast.loading('Đang tạo đơn....')

        await formTemplateService.createFormTemplate(
          formData,
          () => {
            toast.update(toastID, {
              render: 'Đã tạo đơn thành công',
              type: 'success',
              isLoading: false,
              autoClose: 3000
            })

            onClose()
            fetchFormTemplates()
          },
          err => {
            toast.update(toastID, {
              render: err.message || 'Đã tạo đơn thành công',
              type: 'error',
              isLoading: false,
              autoClose: 3000
            })
          }
        )
      }

      onClose()
    } catch (error) {
      console.error('Error saving form template:', error)
    }
  }

  return (
    <>
      <DialogTitle sx={{ pb: 0 }}>{template ? 'Chỉnh sửa mẫu đơn' : 'Thêm mẫu đơn mới'}</DialogTitle>
      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(_: any, newValue: number) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label='Thông tin cơ bản' />
          <Tab label='Người nhận' />
          <Tab label='Thiết kế trường' />
          <Tab label='Chữ ký' />
        </Tabs>

        {activeTab === 0 && (
          <BasicInfoTab
            title={formData.title}
            documentCode={formData.documentCode}
            description={formData.description}
            onFieldChange={(field, value) => handleChange(field as keyof FormTemplate, value)}
          />
        )}

        {activeTab === 1 && (
          <RecipientTab
            recipients={formData.recipient}
            onRecipientChange={handleRecipientChange}
            onAddRecipient={addRecipient}
            onRemoveRecipient={removeRecipient}
          />
        )}

        {activeTab === 2 && (
          <FieldDesignTab
            sections={formData.sections}
            onSectionChange={handleSectionChange}
            onRemoveSection={removeSection}
            onAddContentField={addContentField}
            onRemoveContentField={removeContentField}
            onAddContentSection={addContentSection}
            fieldTypes={FIELD_TYPES}
          />
        )}

        {activeTab === 3 && (
          <SignatureTab
            sections={formData.sections}
            onSectionChange={handleSectionChange}
            onRemoveSection={removeSection}
            onAddSignatureField={addSignatureField}
            onRemoveSignatureField={removeSignatureField}
            onAddSignatureSection={addSignatureSection}
            signatureTypes={SIGNATURE_TYPES}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={!formData.title || !formData.sections.every(section => section.fields.length > 0)}
        >
          {template ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </>
  )
}
