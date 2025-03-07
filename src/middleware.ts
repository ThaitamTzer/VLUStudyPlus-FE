import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { UserType } from './types/userType'
import permissions from '@/libs/permission.json'
import { aclConfig } from './configs/configACL'

// Hàm kiểm tra quyền của user
function checkPermission(userPermissionIDs: number[], requiredAction: string, requiredSubject: string) {
  return userPermissionIDs.some(id => {
    const permission = permissions.find(p => p.id === id)

    return (
      permission &&
      ((permission.action === requiredAction && permission.subject === requiredSubject) ||
        (permission.action === 'manage' && permission.subject === 'all'))
    )
  })
}

export function middleware(req: NextRequest) {
  const userDataCookie = req.cookies.get('userData')?.value
  const url = req.nextUrl.pathname
  const acl = aclConfig[url]

  // Nếu trang không có trong ACL, cho phép truy cập
  if (!acl) return NextResponse.next()

  if (!userDataCookie) {
    console.warn('❌ Không tìm thấy userData trong cookie.')

    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  let userData: UserType | null = null

  try {
    userData = JSON.parse(userDataCookie)
  } catch (error) {
    console.error('❌ Lỗi parse userData từ cookie:', error)

    return NextResponse.redirect(new URL('/404', req.url))
  }

  if (!userData || !userData.role || !userData.role.permissionID) {
    console.warn('❌ userData không hợp lệ hoặc thiếu permissionID.')

    return NextResponse.redirect(new URL('/404', req.url))
  }

  console.log('✅ userData hợp lệ:', userData)

  // Kiểm tra quyền truy cập
  const hasPermission = checkPermission(userData.role.permissionID, acl.action, acl.subject)

  if (!hasPermission) {
    console.warn('🚫 Người dùng không có quyền truy cập vào:', url)

    return NextResponse.redirect(new URL('/404', req.url))
  }

  return NextResponse.next()
}

// Matcher tự động lấy danh sách route cần kiểm tra
export const config = {
  matcher: Object.keys(aclConfig)
}
