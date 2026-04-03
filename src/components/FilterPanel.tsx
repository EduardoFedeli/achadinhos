'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import FilterChip from '@/components/FilterChip'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import type { FiltrosProduto, Loja } from '@/types'
import { SlidersHorizontal } from 'lucide-react'

const LOJAS: Loja[] = ['amazon', 'shopee', 'magalu', 'mercadolivre', 'americanas', 'casasbahia', 'centauro', 'aliexpress']
const LOJA_LABEL: Record<Loja, string> = {
  amazon: 'Amazon', shopee: 'Shopee', magalu: 'Magalu',
  mercadolivre: 'Mercado Livre', americanas: 'Americanas',
  casasbahia: 'Casas Bahia', centauro: 'Centauro', aliexpress: 'AliExpress',
}

interface FilterPanelProps {
  filtros: FiltrosProduto
  onFiltrosChange: (f: FiltrosProduto) => void
  tagsDaCategoria: string[]
  precoMaxTotal: number
  cor: string
  // CORREÇÃO TS: Prop adicionada para receber o array dinâmico do CategoriaContent
  marketplacesDisponiveis: string[] 
}

function FilterBody({ filtros, onFiltrosChange, tagsDaCategoria, precoMaxTotal, cor, marketplacesDisponiveis }: FilterPanelProps) {
  const precoMin = filtros.precoMin ?? 0
  const precoMax = filtros.precoMax ?? precoMaxTotal

  function toggleLoja(loja: Loja) {
    const current = filtros.lojas ?? []
    const next = current.includes(loja)
      ? current.filter(l => l !== loja)
      : [...current, loja]
    onFiltrosChange({ ...filtros, lojas: next.length > 0 ? next : undefined })
  }

  function toggleTag(tag: string) {
    const current = filtros.tags ?? []
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag]
    onFiltrosChange({ ...filtros, tags: next.length > 0 ? next : undefined })
  }

  // UX FIX: Filtra o array master de lojas (LOJAS) para retornar apenas as que vieram da API/banco
  const lojasAtivas = LOJAS.filter(loja => marketplacesDisponiveis.includes(loja))

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-[#A1A1AA]">Faixa de preço</p>
        <PriceRangeSlider
          min={0}
          max={precoMaxTotal}
          value={[precoMin, precoMax]}
          onChange={([min, max]) =>
            onFiltrosChange({
              ...filtros,
              precoMin: min > 0 ? min : undefined,
              precoMax: max < precoMaxTotal ? max : undefined,
            })
          }
          cor={cor}
        />
      </div>

      {/* Condicional para esconder a seção inteira se não houver lojas */}
      {lojasAtivas.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-[#A1A1AA]">Marketplace</p>
          <div className="flex flex-wrap gap-2">
            {lojasAtivas.map(loja => (
              <FilterChip
                key={loja}
                label={LOJA_LABEL[loja]}
                ativo={(filtros.lojas ?? []).includes(loja)}
                cor={cor}
                onClick={() => toggleLoja(loja)}
              />
            ))}
          </div>
        </div>
      )}

      {tagsDaCategoria.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-[#A1A1AA]">Filtrar por</p>
          <div className="flex flex-wrap gap-2">
            {tagsDaCategoria.map(tag => (
              <FilterChip
                key={tag}
                label={tag}
                ativo={(filtros.tags ?? []).includes(tag)}
                cor={cor}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={() => onFiltrosChange({})}
        className="mt-2 w-full h-11 border-[#2A2A35] bg-transparent text-[#A1A1AA] hover:bg-[#2A2A35] hover:text-white transition-all rounded-xl font-bold text-xs"
      >
        Limpar filtros
      </Button>
    </div>
  )
}

export default function FilterPanel(props: FilterPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              style={{ backgroundColor: props.cor || '#F97316' }}
              className="rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] h-12 px-5 font-bold text-white flex items-center gap-2 hover:scale-105 transition-all"
            >
              <SlidersHorizontal size={18} />
              Filtrar
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-[#1A1A24] border-t border-[#2A2A35] rounded-t-3xl max-h-[85vh] overflow-y-auto px-0">
            <SheetHeader className="px-6 pt-6 pb-2 border-b border-[#2A2A35]">
              <SheetTitle className="text-white text-lg font-black text-left">Filtros</SheetTitle>
            </SheetHeader>
            <FilterBody {...props} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block w-[280px] shrink-0">
        <div className="sticky top-24 rounded-3xl bg-[#1A1A24] border border-[#2A2A35] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#2A2A35]">
            <p className="text-sm font-black uppercase tracking-widest text-white">Filtros</p>
          </div>
          <FilterBody {...props} />
        </div>
      </div>
    </>
  )
}