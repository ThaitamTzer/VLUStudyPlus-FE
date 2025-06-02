import { Grid, Card, CardContent, Box, Typography, Chip, Button, Divider, List, CircularProgress } from '@mui/material'

import Iconify from '@/components/iconify'
import ConcentrationItem from './ConcentrationItem'

interface ConcentrationListProps {
  concentrations: any[]
  isLoading: boolean
  onAddConcentration: () => void
  onUpdate: () => void
}

export default function ConcentrationList({
  concentrations,
  isLoading,
  onAddConcentration,
  onUpdate
}: ConcentrationListProps) {
  return (
    <Grid item xs={12}>
      <Card variant='outlined'>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify icon='material-symbols:category' style={{ marginRight: 8, fontSize: 24, color: '#0065F8' }} />
              Danh sách chuyên ngành
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${concentrations?.length || 0} chuyên ngành`}
                color='primary'
                variant='outlined'
                size='small'
              />
              <Button
                variant='contained'
                size='small'
                startIcon={<Iconify icon='material-symbols:add' />}
                onClick={onAddConcentration}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Thêm chuyên ngành
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant='body2' color='text.secondary'>
                Đang tải danh sách chuyên ngành...
              </Typography>
            </Box>
          ) : concentrations && concentrations.length > 0 ? (
            <List dense>
              {concentrations.map((concentration: any, index: number) => (
                <ConcentrationItem
                  key={concentration._id || concentration.id || index}
                  concentration={concentration}
                  onUpdate={onUpdate}
                />
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Iconify icon='material-symbols:inbox' style={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Chưa có chuyên ngành nào được thiết lập
              </Typography>
              <Button
                variant='outlined'
                startIcon={<Iconify icon='material-symbols:add' />}
                onClick={onAddConcentration}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Thêm chuyên ngành đầu tiên
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}
