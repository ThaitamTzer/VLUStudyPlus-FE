// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

// ** Types
import type { PageHeaderProps } from './type'

const PageHeader = (props: PageHeaderProps) => {
  // ** Props
  const { title, subtitle } = props

  return (
    <Grid item xs={12}>
      <Typography variant='h3' fontWeight={600}>
        {title}
      </Typography>
      {subtitle || null}
    </Grid>
  )
}

export default PageHeader
