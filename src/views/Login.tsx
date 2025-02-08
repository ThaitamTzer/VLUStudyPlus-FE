'use client'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { Montserrat } from 'next/font/google'
import Image from 'next/image'

import Typography from '@mui/material/Typography'

// Third-party Imports
import { motion } from 'framer-motion'
import classnames from 'classnames'
import { useMediaQuery, useTheme } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Font Imports
const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese']
})

const Login = () => {
  const backgroundVLU = '/images/bg_login_v1.jpg'
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const { settings } = useSettings()

  return (
    <div className='flex bs-full justify-center relative bg-gray-900'>
      {/* Left Side - Background Image */}
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative max-md:hidden overflow-hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        {/* Background Overlay */}
        <div className='relative w-full h-full'>
          <div className='absolute inset-0 z-[2] blur-sm bg-[#fefefe]/5' />
          <div className='absolute inset-0 z-20 flex items-center justify-center p-6'>
            <div className='text-center text-white max-w-2xl space-y-4 p-6 bg-gradient-to-b from-slate-400 to-white/20 backdrop-blur-md rounded-xl shadow-lg'>
              <Typography variant='h3' className='!font-bold text-white'>
                Chào mừng đến với <span className='text-blue-800'>VLUStudy</span>
                <span className='text-primary'>Plus</span>
                👋🏻
              </Typography>
              <Typography variant='h6' className='!font-medium text-white'>
                PHẦN MỀM QUẢN LÝ, THEO DÕI VÀ XỬ LÝ QUÁ TRÌNH HỌC TẬP
              </Typography>
              <Typography variant='subtitle1' className='text-white'>
                Trường Đại học Văn Lang
              </Typography>
            </div>
          </div>
          <Image
            src={backgroundVLU}
            alt='background-login'
            fill
            priority
            quality={100}
            className='object-cover object-center'
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px] bg-white/10 rounded-lg shadow-xl border border-white/20'
        style={{
          backgroundImage: `url(/images/background/overlay_4.jpg)`
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='absolute z-[2] block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </motion.div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[480px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          {/* Welcome Message */}
          <div className='flex flex-col gap-1 text-center'>
            {hidden ? (
              <Typography className={montserrat.className} variant='h4'>
                {`Chào mừng đến với ${themeConfig.templateName}! 👋🏻`}
              </Typography>
            ) : null}
            <Typography className='text-gray-800'>Vui lòng đăng nhập bằng tài khoản Văn Lang</Typography>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex flex-col items-center gap-3 border border-gray-300 bg-white/20 hover:bg-white/30 transition-all rounded-md p-4 cursor-pointer shadow-lg'
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/microsoft`)}
          >
            <div className='w-1/4'>
              <Image
                src='/images/logo-van-lang.png'
                alt='Van Lang University'
                width={300}
                height={100}
                objectFit='contain'
                className='w-full h-full'
              />
            </div>
            <div className='content w-full text-center'>
              <p className='text-xl font-bold text-red-600'>Tiếp tục với tài khoản Văn Lang</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className='absolute block-end-5 inline-start-6 text-center text-gray-400'>
        <Typography variant='body2'>© {new Date().getFullYear()} VanLangUniversity. All rights reserved.</Typography>
      </div>
    </div>
  )
}

export default Login
