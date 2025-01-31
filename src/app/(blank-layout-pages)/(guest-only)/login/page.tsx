// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@/views/Login'

// Server Action Imports

export const metadata: Metadata = {
  title: 'Đăng nhập | VLUStudyPlus',
  description: 'Đăng nhập vào hệ thống VLUStudyPlus để sử dụng các tính năng của hệ thống.'
}

const LoginPage = () => {
  // Vars

  return <Login />
}

export default LoginPage
