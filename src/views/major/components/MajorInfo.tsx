import { Grid, Card, CardContent, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import type { FieldErrors, Control } from 'react-hook-form'

import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'

interface MajorInfoProps {
  control: Control<any>
  errors: FieldErrors<any>
}

export default function MajorInfo({ control, errors }: MajorInfoProps) {
  return (
    <Grid item xs={12}>
      <Card variant='outlined'>
        <CardContent>
          <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Iconify icon='material-symbols:school' style={{ marginRight: 8, fontSize: 24 }} />
            Thông tin ngành
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='majorId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled
                    label='Mã ngành'
                    {...(errors.majorId && { error: true, helperText: errors.majorId.message as string })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='majorName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    disabled
                    fullWidth
                    label='Tên ngành'
                    {...(errors.majorName && { error: true, helperText: errors.majorName.message as string })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
