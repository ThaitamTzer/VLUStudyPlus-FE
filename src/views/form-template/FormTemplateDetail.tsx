import { Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material'

interface FormTemplateDetailProps {
  template: {
    title: string
    documentCode: string
    recipient: string[]
    description: string
    sections: any[]
  }
}

export default function FormTemplateDetail({ template }: FormTemplateDetailProps) {
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        {template.title}
      </Typography>
      <Typography variant='subtitle1' color='text.secondary' gutterBottom>
        Mã đơn: {template.documentCode}
      </Typography>
      <Typography variant='body1' paragraph>
        {template.description}
      </Typography>

      <Typography variant='h6' gutterBottom>
        Người nhận:
      </Typography>
      <List>
        {template.recipient.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6' gutterBottom>
        Các phần của đơn:
      </Typography>
      {template.sections.map((section, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant='subtitle1' gutterBottom>
            {section.sectionTitle}
          </Typography>
          <List>
            {section.fields.map((field: any, fieldIndex: number) => (
              <ListItem key={fieldIndex}>
                <ListItemText
                  primary={field.label}
                  secondary={`Loại: ${field.type}${field.required ? ' (Bắt buộc)' : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  )
}
