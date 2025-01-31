import { Typography, CardHeader as Header } from '@mui/material'

type CardHeaderProp = {
  title: string
  subtitle?: string
}

export const CardHeader = ({ title, subtitle }: CardHeaderProp) => {
  return (
    <Header
      title={
        <Typography variant='h3' fontWeight={600}>
          {title}
        </Typography>
      }
      subheader={subtitle}
    />
  )
}
