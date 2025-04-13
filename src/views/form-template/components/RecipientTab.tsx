import { Box, Button, Grid, IconButton, Stack, TextField, Typography } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface RecipientTabProps {
  recipients: string[]
  onRecipientChange: (index: number, value: string) => void
  onAddRecipient: () => void
  onRemoveRecipient: (index: number) => void
}

export default function RecipientTab({
  recipients,
  onRecipientChange,
  onAddRecipient,
  onRemoveRecipient
}: RecipientTabProps) {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant='subtitle1' gutterBottom>
        Thêm người nhận đơn
      </Typography>
      <Stack spacing={2}>
        {recipients.map((recipient: string, index: number) => (
          <Grid container spacing={2} key={index} alignItems='center'>
            <Grid item xs={10}>
              <TextField
                label={`Người nhận ${index + 1}`}
                value={recipient}
                onChange={e => onRecipientChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => onRemoveRecipient(index)} color='error' disabled={recipients.length <= 1}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddIcon />} onClick={onAddRecipient} variant='outlined' sx={{ alignSelf: 'flex-start' }}>
          Thêm người nhận
        </Button>
      </Stack>
    </Box>
  )
}
