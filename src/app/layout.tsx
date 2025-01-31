// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'VLUStudyPlus',
  description:
    'VLUStudyPlus là phần mềm quản lý, theo dõi và hỗ trợ học tập cho sinh viên trường Đại học Văn Lang. Phần mềm giúp sinh viên quản lý thời gian, theo dõi tiến độ học tập, hỗ trợ việc học tập và nghiên cứu, cũng như giúp sinh viên tìm kiếm thông tin về các khóa học, giáo viên, lịch học, lịch thi, điểm thi, và nhiều thông tin khác.'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars

  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
