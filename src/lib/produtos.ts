import { createClient } from '@supabase/supabase-js'
import type { Categoria, Produto } from '../types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Formata preço em Real (R$)
export function formatarPreco(preco: number): string {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Agora busca as categorias DIRETO do Supabase!
export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await supabase.from('categorias').select('*').order('nome')
  return data || []
}