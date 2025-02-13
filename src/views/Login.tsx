'use client'

import Link from 'next/link'

import Typography from '@mui/material/Typography'

// Component Imports
import { Button } from '@mui/material'

import Logo from '@components/layout/shared/Logo'

const Login = () => {
  return (
    <div className='w-full h-full z-0 relative'>
      <div
        className='w-full h-full flex justify-center items-center before:content-["*"] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-t before:from-[#3777FF] before:to-slate-600 before:opacity-50 before:z-[-1] overflow-hidden'
        style={{
          backgroundImage: 'url("/images/background/loginv1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          zIndex: 0
        }}
      >
        <div
          className='container mx-auto space-y-6'
          style={{
            width: 'calc(100% - 10rem)'
          }}
        >
          <Link href={'/'} className='flex justify-center scale-150'>
            <Logo />
          </Link>
          <div className='text-center max-w-[870px] mx-auto'>
            <h2 className='text-[35px] text-[#fefef3] font-bold'>
              PHẦN MỀM QUẢN LÝ, THEO DÕI VÀ XỬ LÝ QUÁ TRÌNH HỌC TẬP CỦA SINH VIÊN KHOA CNTT
            </h2>
          </div>
          <div className='w-fit max-w-[500px] mx-auto'>
            <div className='min-h-[300px] bg-black/40 rounded-md flex flex-col justify-center items-center p-6 space-y-6'>
              <img src='/images/logo-van-lang.png' className='w-[100px] mx-auto' alt='Đại học văn lang' />
              <p className='text-[20px] font-bold text-[#fefef3]'>Đăng nhập với tài khoản Văn Lang</p>
              <Button variant='contained' size='large' className='w-full bg-red-600 text-white'>
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/microsoft`}>Đăng nhập</Link>
              </Button>
            </div>
          </div>
          <div className='text-center'>
            <Typography variant='body2' className='text-white text-[18px]'>
              © {new Date().getFullYear()} - Bản Quyền Thuộc Phòng Đào Tạo, Trường Đại Học Văn Lang.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
