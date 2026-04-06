import { headers } from 'next/headers'

// src/lib/auth.ts

export function withAdmin(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      await validateAdminAuth(); // Executa a trava
      return handler(req, ...args); // Se passar, executa sua API
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Proibido' }), { status: 403 });
    }
  };
}



/**
 * Valida se a requisição possui autorização administrativa.
 * Agora devidamente assíncrona para as versões recentes do Next.js.
 */
export async function validateAdminAuth() {
  const headerList = await headers(); // Adicionado o await aqui
  const authHeader = headerList.get('authorization');
  const cookieStore = headerList.get('cookie');

  const isAdmin = 
    authHeader === `Bearer ${process.env.ADMIN_PASSWORD}` || 
    cookieStore?.includes(`admin_session=${process.env.ADMIN_PASSWORD}`);

  if (!isAdmin) {
    throw new Error('Acesso não autorizado');
  }
  
  return true;
}