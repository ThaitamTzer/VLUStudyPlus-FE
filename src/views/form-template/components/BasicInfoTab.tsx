import { Grid, TextField } from '@mui/material'

interface BasicInfoTabProps {
  title: string
  documentCode: string
  description: string
  onFieldChange: (field: string, value: string) => void
}

export default function BasicInfoTab({ title, documentCode, description, onFieldChange }: BasicInfoTabProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label='Tiêu đề'
          value={title}
          onChange={e => onFieldChange('title', e.target.value)}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label='Số hiệu văn bản'
          value={documentCode}
          onChange={e => onFieldChange('documentCode', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Mô tả'
          value={description}
          onChange={e => onFieldChange('description', e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  )
}
