import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { UserType } from './types/userType'
import { defineAbilityFor } from './configs/acl'
import { aclConfig } from './configs/configACL'

export function middleware(req: NextRequest) {
  const userDataCookie = req.cookies.get('userData')?.value
  const url = req.nextUrl.pathname
  const acl = aclConfig[url]

  if (!acl) return NextResponse.next() // Nếu route không có trong ACL, cho phép truy cập

  if (!userDataCookie) {
    console.warn('❌ Không tìm thấy userData trong cookie.')

    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  let userData: UserType | null = null

  try {
    userData = JSON.parse(userDataCookie)
  } catch (error) {
    console.error('❌ Lỗi parse userData từ cookie:', error)

    return NextResponse.redirect(new URL('/not-found', req.url))
  }

  if (!userData) {
    return NextResponse.redirect(new URL('/not-found', req.url))
  }

  console.log('✅ userData hợp lệ:', userData)

  // Tạo đối tượng Ability từ CASL
  const ability = defineAbilityFor(userData)

  // Kiểm tra quyền truy cập
  if (!ability.can(acl.action, acl.subject)) {
    console.warn('🚫 Người dùng không có quyền truy cập vào:', url)

    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return NextResponse.next()
}

// Matcher tự động lấy danh sách route cần kiểm tra
export const config = {
  matcher: Object.keys(aclConfig)
}
