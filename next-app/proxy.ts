import { type NextRequest, NextResponse } from 'next/server'

function decodeJwtPayload(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const tokenCookie = request.cookies.get('sb-access-token')
  const payload = tokenCookie ? decodeJwtPayload(tokenCookie.value) : null

  const isExpired = !payload?.exp || Date.now() / 1000 > payload.exp
  const isAuthed = !isExpired

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isAuthed && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPage && isAuthed) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/products'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
