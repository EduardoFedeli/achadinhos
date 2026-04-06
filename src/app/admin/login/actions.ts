'use server'

import { cookies } from 'next/headers'

export async function authenticateUser(password: string) {
  // DEBUG TEMPORÁRIO: Isso vai aparecer no seu TERMINAL (VS Code), não no navegador
  console.log("--- DEBUG DE LOGIN ---");
  console.log("Senha digitada: ", password);
  console.log("Senha no .env:  ", process.env.ADMIN_PASSWORD);
  console.log("São iguais?     ", password === process.env.ADMIN_PASSWORD);
  console.log("----------------------");

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    
    cookieStore.set('admin_session', password, {
      path: '/',
      maxAge: 86400, 
      sameSite: 'strict',
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
    })
    
    return { success: true }
  }
  
  return { success: false }
}