import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// MUDANÇA AQUI: de 'export function middleware' para 'export function proxy'
export function proxy(request: NextRequest) {
  // 1. Identifica se a rota é administrativa
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage) {
    // 2. Verifica a existência do cookie de autenticação
    const authCookie = request.cookies.get('admin_session')

    // Se não houver cookie, redireciona para o login
    if (!authCookie || authCookie.value !== process.env.ADMIN_PASSWORD) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configura quais caminhos a proteção deve observar
export const config = {
  matcher: [
    '/admin/:path*', 
    '/api/admin/:path*'
  ],
}