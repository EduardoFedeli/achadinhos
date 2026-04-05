import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import CategoriaContent from './CategoriaContent'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria: slug } = await params
  const cat = getCategorias().find(c => c.slug === slug)
  if (!cat) return {}
  return {
    title: `${cat.nome} — T-Hex Indica`,
    description: cat.descricao,
  }
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params
  const todasCategorias = getCategorias()
  const catBase = todasCategorias.find(c => c.slug === slug)
  
  if (!catBase) notFound()

  // Conecta no Banco e busca SÓ os produtos que têm o slug desta categoria
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: produtosRaw } = await supabase
    .from('produtos')
    .select('*')
    .contains('categoriaSlugs', [slug])
    .order('createdAt', { ascending: false })

  // Nós "injetamos" os produtos reais do banco dentro do objeto da categoria 
  // para o seu CategoriaContent achar que nada mudou
  const catAtualizada = {
    ...catBase,
    produtos: produtosRaw || []
  }

  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex-1 px-4 md:px-8 mt-6">
        <CategoriaContent cat={catAtualizada} todasCategorias={todasCategorias} />
      </main>
    </div>
  )
}