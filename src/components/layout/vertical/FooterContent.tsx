'use client'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { Typography } from '@mui/material'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <Typography variant='body2'>© {new Date().getFullYear()} VanLangUniversity. All rights reserved.</Typography>
    </div>
  )
}

export default FooterContent
