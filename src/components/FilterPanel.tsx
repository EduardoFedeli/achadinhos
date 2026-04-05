'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import FilterChip from '@/components/FilterChip'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import type { FiltrosProduto } from '@/types'

const LOJA_LABEL: Record<string, string> = {
  amazon: 'Amazon', shopee: 'Shopee', magalu: 'Magalu',
  mercadolivre: 'Mercado Livre', americanas: 'Americanas',
  casasbahia: 'Casas Bahia', centauro: 'Centauro', aliexpress: 'AliExpress',
}

export default function FilterPanel({ filtros, onFiltrosChange, tagsDaCategoria, precoMaxTotal, cor, marketplacesDisponiveis }: any) {
  const precoMin = filtros.precoMin ?? 0
  const precoMax = filtros.precoMax ?? precoMaxTotal

  function toggleLoja(loja: string) {
    const current = filtros.lojas ?? []
    const next = current.includes(loja) ? current.filter((l: any) => l !== loja) : [...current, loja]
    onFiltrosChange({ ...filtros, lojas: next.length > 0 ? next : undefined })
  }

  // UX Fix: Blindagem de dados. 
  // Remove valores nulos, undefined ou strings vazias que podem vir do Supabase
  const lojasValidas = (marketplacesDisponiveis || []).filter(Boolean)
  const tagsValidas = (tagsDaCategoria || []).filter(Boolean)

  return (
    <div className="flex flex-col gap-8 bg-[#1A1A24] border border-[#2A2A35] rounded-[32px] p-6 shadow-2xl">
      <div>
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Faixa de preço</p>
        <PriceRangeSlider 
           min={0} max={precoMaxTotal} value={[precoMin, precoMax]} cor={cor}
           onChange={([min, max]: any) => onFiltrosChange({ ...filtros, precoMin: min, precoMax: max })}
        />
      </div>

      {/* MARKETPLACES DISPONÍVEIS NA CATEGORIA */}
      {lojasValidas.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Marketplace</p>
          <div className="flex flex-wrap gap-2">
            {lojasValidas.map((lojaRaw: string) => {
              // Normaliza a string para garantir o match no dicionário (ex: "Amazon" vira "amazon")
              const slugNormalizado = String(lojaRaw).toLowerCase().trim()
              const label = LOJA_LABEL[slugNormalizado] || lojaRaw
              
              return (
                <FilterChip
                  key={lojaRaw}
                  label={label}
                  ativo={(filtros.lojas ?? []).includes(lojaRaw)}
                  cor={cor}
                  onClick={() => toggleLoja(lojaRaw)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* TAGS */}
      {tagsValidas.length > 0 && (
        <div>
           <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Filtrar por</p>
           <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-none">
              {tagsValidas.map((tag: string) => (
                <FilterChip
                  key={tag} 
                  label={tag} 
                  cor={cor}
                  ativo={(filtros.tags ?? []).includes(tag)}
                  onClick={() => {
                    const current = filtros.tags ?? []
                    const next = current.includes(tag) ? current.filter((t: any) => t !== tag) : [...current, tag]
                    onFiltrosChange({ ...filtros, tags: next })
                  }}
                />
              ))}
           </div>
        </div>
      )}

      <Button variant="outline" onClick={() => onFiltrosChange({})} className="rounded-xl border-[#2A2A35] hover:bg-white/5 text-[10px] font-black uppercase transition-colors">
        Limpar Filtros
      </Button>
    </div>
  )
}