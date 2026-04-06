import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth'

export const POST = withAdmin(async function() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  return NextResponse.json({ ok: true })
});