'use client'

// Third-party Imports
import { usePathname } from 'next/navigation'

import classnames from 'classnames'

import { Typography } from '@mui/material'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const pathname = usePathname()

  return (
    <div
      className={classnames(
        verticalLayoutClasses.footerContent,
        'flex items-center justify-between flex-wrap gap-4 relative z-0'
      )}
      style={{
        justifyContent: pathname !== '/homepage' ? 'flex-start' : 'center'
      }}
    >
      <Typography
        variant='body2'
        sx={{
          color: pathname !== '/homepage' ? 'text.secondary' : '#fff'
        }}
      >
        © {new Date().getFullYear()} - Bản Quyền Thuộc Phòng Đào Tạo, Trường Đại Học Văn Lang.
      </Typography>
    </div>
  )
}

export default FooterContent
