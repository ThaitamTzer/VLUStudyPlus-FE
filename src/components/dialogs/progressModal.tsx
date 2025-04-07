import { useEffect, useState } from 'react'

import { Box, Dialog, DialogContent, Typography, LinearProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { alpha } from '@mui/material/styles'

import Logo from '@/components/logo'

type ProgressModalProps = {
  open: boolean
  isProcessing: boolean
  isCompleted: boolean
  pauseAt?: number
  processingMessage?: string
  completedMessage?: string
  onClose?: () => void
  autoCloseDelay?: number
  openEnded?: () => void
}

export default function ProgressModal({
  open,
  isProcessing,
  isCompleted,
  pauseAt = 85,
  processingMessage = 'Đang xử lý dữ liệu...',
  completedMessage = 'Hoàn thành!',
  onClose,
  autoCloseDelay = 1500,
  openEnded
}: ProgressModalProps) {
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Giai đoạn 1: Tăng từ 0 đến pauseAt
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (open && isProcessing && !isCompleted) {
      setProgress(0)
      setIsPaused(false)

      timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 3) + 1

          if (next >= pauseAt) {
            clearInterval(timer)
            setIsPaused(true)

            return pauseAt
          }

          return next
        })
      }, 500)
    }

    return () => clearInterval(timer)
  }, [open, isProcessing, isCompleted, pauseAt])

  // Giai đoạn 2: Khi đã completed, tiếp tục tăng đến 100%
  useEffect(() => {
    let completeTimer: NodeJS.Timeout

    if (isCompleted) {
      completeTimer = setInterval(() => {
        setProgress(prev => {
          const increment = Math.floor(Math.random() * 3) + 1
          const next = Math.min(prev + increment, 100)

          if (next === 100) {
            clearInterval(completeTimer)
          }

          return next
        })
      }, 150)
    }

    return () => clearInterval(completeTimer)
  }, [isCompleted])

  // Auto close khi đạt 100%
  useEffect(() => {
    if (progress === 100 && isCompleted) {
      const closeTimeout = setTimeout(() => {
        // Gọi callback mở modal khác nếu có
        openEnded?.()

        // Đóng modal hiện tại nếu có callback
        onClose?.()
      }, autoCloseDelay)

      return () => clearTimeout(closeTimeout)
    }
  }, [progress, isCompleted, onClose, autoCloseDelay, openEnded])

  useEffect(() => {
    if (!open) {
      setProgress(0)
      setIsPaused(false)
    }
  }, [open])

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogContent sx={{ minHeight: '300px' }}>
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
            <motion.div
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
          </Box>

          <Typography variant='h5' gutterBottom>
            {progress === 100 ? completedMessage : processingMessage}
          </Typography>

          <Box mt={2} width='100%'>
            <LinearProgress
              variant='determinate'
              value={progress}
              color={progress === 100 ? 'success' : 'primary'}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 2,
                transition: 'all 0.3s ease'
              }}
            />
            <Typography variant='body2' textAlign='center'>
              {progress}% hoàn thành
              {isPaused && !isCompleted && ' (Dữ liệu vẫn đang được xử lý)'}
            </Typography>
          </Box>

          <Box mt={3}>
            <Typography variant='body2' color='text.secondary' textAlign='center'>
              {progress === 100
                ? 'Quá trình đã hoàn tất thành công! Tiến trình sẽ tự động đóng sau 2 giây.'
                : 'Vui lòng không tắt trình duyệt hoặc làm mới trang trong khi hệ thống đang xử lý'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
