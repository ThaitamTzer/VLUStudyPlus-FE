// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'
import '@mdxeditor/editor/style.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'VLUStudyPlus - Hệ thống xử lý học vụ Đại học Văn Lang',
  description:
    'VLUStudyPlus - Hệ thống xử lý học vụ trực tuyến của trường Đại học Văn Lang. Hỗ trợ sinh viên quản lý học tập, theo dõi tiến độ, đăng ký môn học, xem điểm thi, lịch học và các thông tin học vụ quan trọng khác.',
  keywords:
    'xử lý học vụ, đại học văn lang, vlustudyplus, quản lý học tập, đăng ký môn học, điểm thi, lịch học, sinh viên văn lang'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars

  const direction = 'ltr'

  return (
    <html id='__next' lang='vi' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        {children}
        <noscript>
          <h1>JavaScript is required to use this website</h1>
          <p>Please enable JavaScript in your browser settings and reload the page.</p>
        </noscript>
      </body>
    </html>
  )
}

export default RootLayout
