import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { alpha } from '@mui/material/styles'

import Logo from '@/components/logo'

type ProgressModalProps = {
  open: boolean
}

export default function ProgressModal(props: ProgressModalProps) {
  const { open } = props

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogContent
        sx={{
          minHeight: '300px'
        }}
      >
        <Box p={2} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
          <Box
            sx={{
              width: 1,
              height: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              marginBottom: 15
            }}
          >
            <>
              <motion.div
                key='logo-animation'
                animate={{
                  scale: [1, 0.9, 0.9, 1, 1],
                  opacity: [1, 0.48, 0.48, 1, 1]
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  repeatDelay: 1,
                  repeat: Infinity
                }}
              >
                <Logo disabledLink sx={{ width: 64, height: 64 }} />
              </motion.div>

              <Box
                component={motion.div}
                animate={{
                  scale: [1.6, 1, 1, 1.6, 1.6],
                  rotate: [270, 0, 0, 270, 270],
                  opacity: [0.25, 1, 1, 1, 0.25],
                  borderRadius: ['25%', '25%', '50%', '50%', '25%']
                }}
                transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
                sx={{
                  width: 100,
                  height: 100,
                  position: 'absolute',
                  border: theme => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`
                }}
              />

              <Box
                component={motion.div}
                animate={{
                  scale: [1, 1.2, 1.2, 1, 1],
                  rotate: [0, 270, 270, 0, 0],
                  opacity: [1, 0.25, 0.25, 0.25, 1],
                  borderRadius: ['25%', '25%', '50%', '50%', '25%']
                }}
                transition={{
                  ease: 'linear',
                  duration: 3.2,
                  repeat: Infinity
                }}
                sx={{
                  width: 120,
                  height: 120,
                  position: 'absolute',
                  border: theme => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`
                }}
              />
            </>
          </Box>
          <Typography variant='h5'>Đang xử lý dữ liệu</Typography>
          <Box mt={2}>
            <Typography variant='body2'>
              Vui lòng đợi trong giây lát, vui lòng không chuyển trang trong khi hệ thống đang xử lý dữ liệu.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
