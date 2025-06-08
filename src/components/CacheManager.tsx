'use client'

import { useState } from 'react'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'

import { useShare } from '@/hooks/useShare'
import CacheManager, { CACHE_KEYS } from '@/utils/cache'

export default function CacheManagerComponent() {
  const { clearCache, refreshCache } = useShare()
  const [open, setOpen] = useState(false)
  const [cacheInfo, setCacheInfo] = useState<any[]>([])

  const handleGetCacheInfo = () => {
    const info = Object.entries(CACHE_KEYS).map(([key, value]) => {
      const metadata = CacheManager.getMetadata(value)

      return {
        name: key,
        key: value,
        ...metadata,
        hasData: CacheManager.isValid(value)
      }
    })

    setCacheInfo(info)
    setOpen(true)
  }

  const handleClearCache = async () => {
    clearCache()
    setCacheInfo([])
    setOpen(false)
  }

  const handleRefreshCache = async () => {
    await refreshCache()

    // Đợi 1 giây để cache được cập nhật
    setTimeout(() => {
      handleGetCacheInfo()
    }, 1000)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN')
  }

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

    return `${minutes}p ${seconds}s`
  }

  return (
    <>
      <Card>
        <CardHeader title='Quản lý Cache' subheader='Quản lý cache dữ liệu trong ứng dụng' />
        <CardContent>
          <Box display='flex' gap={2} flexWrap='wrap'>
            <Button variant='outlined' onClick={handleGetCacheInfo}>
              Xem thông tin Cache
            </Button>
            <Button variant='contained' color='warning' onClick={handleRefreshCache}>
              Refresh Cache
            </Button>
            <Button variant='contained' color='error' onClick={handleClearCache}>
              Xóa tất cả Cache
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Thông tin Cache</DialogTitle>
        <DialogContent>
          {cacheInfo.length === 0 ? (
            <Alert severity='info'>Không có cache nào</Alert>
          ) : (
            <Box display='flex' flexDirection='column' gap={2}>
              {cacheInfo.map((cache, index) => (
                <Card key={index} variant='outlined'>
                  <CardContent>
                    <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                      <Typography variant='h6'>{cache.name}</Typography>
                      <Chip
                        label={cache.hasData ? 'Có dữ liệu' : 'Không có dữ liệu'}
                        color={cache.hasData ? 'success' : 'default'}
                        size='small'
                      />
                    </Box>

                    {cache.hasData && (
                      <Box>
                        <Typography variant='body2' color='textSecondary'>
                          <strong>Key:</strong> {cache.key}
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          <strong>Tạo lúc:</strong> {cache.timestamp ? formatTime(cache.timestamp) : 'N/A'}
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          <strong>Thời gian sống:</strong> {cache.expiry ? formatDuration(cache.expiry) : 'N/A'}
                        </Typography>
                        <Box mt={1}>
                          <Chip
                            label={cache.isExpired ? 'Đã hết hạn' : 'Còn hiệu lực'}
                            color={cache.isExpired ? 'error' : 'success'}
                            size='small'
                          />
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
          <Button onClick={handleRefreshCache} variant='contained' color='primary'>
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
