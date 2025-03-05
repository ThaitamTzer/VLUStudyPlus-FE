import { Box, Dialog, DialogContent, LinearProgress, Typography } from '@mui/material'

type ProgressModalProps = {
  open: boolean
}

export default function ProgressModal(props: ProgressModalProps) {
  const { open } = props

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogContent>
        <Box p={2}>
          <Typography variant='h6'>Đang xử lý dữ liệu</Typography>
          <Box mt={2}>
            <Typography variant='body2'>Vui lòng đợi trong giây lát</Typography>
          </Box>
          <Box mt={2}>
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
