import React from 'react'

interface EmailTemplateProps {
  content: string
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ content }) => {
  return (
    <div className='min-h-screen bg-white p-2 sm:p-5 text-center'>
      <div className='mx-auto w-full max-w-[700px] rounded-lg bg-white p-4 sm:p-8'>
        {/* Header */}
        <div className='text-center'>
          <img
            src='https://res.cloudinary.com/dtvhqvucg/image/upload/v1741883048/xtv54nw1j7qewtodd4go.png'
            alt='VLUSTUDYPLUS'
            className='mx-auto w-[150px] sm:w-[200px]'
          />
          <h2 className='mt-2 text-lg sm:text-xl text-[#2452B4]'>Thư thông báo</h2>
        </div>

        {/* Content */}
        <div className='mt-4 rounded-lg bg-gray-50 p-4 sm:p-8 text-left text-base sm:text-xl font-medium leading-relaxed'>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <p className='mt-4 text-xs sm:text-sm text-red-500'>
            *Đây là email thông báo tự động, vui lòng không phản hồi email này.
          </p>
        </div>

        {/* Footer */}
        <div className='mt-4 border-t-2 border-gray-200 p-4 sm:p-8'>
          <p className='text-sm sm:text-base font-bold text-red-600'>KHOA CÔNG NGHỆ THÔNG TIN</p>
          <p className='mt-2 text-xs sm:text-sm'>
            Phòng 5.18 – Tầng 5 - Tòa A | 028.7109 9240 |{' '}
            <a href='mailto:k.cntt@vlu.edu.vn' className='text-blue-600 hover:underline'>
              k.cntt@vlu.edu.vn
            </a>
          </p>
          <p className='mt-2 text-sm sm:text-base font-bold'>TRƯỜNG ĐẠI HỌC VĂN LANG</p>
          <p className='mt-2 text-xs sm:text-sm'>
            <span className='font-bold'>TRỤ SỞ CHÍNH:</span> 69/68 Đặng Thùy Trâm, P. 13, Q. Bình Thạnh, TP. HCM
          </p>
          <div className='mt-4 text-center w-full h-auto object-cover'>
            <img
              src='https://res.cloudinary.com/dtvhqvucg/image/upload/v1741883136/zpdmw1x1vcdehqcxpaks.png'
              alt='VAN LANG UNIVERSITY'
              className='w-full h-auto object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailTemplate
