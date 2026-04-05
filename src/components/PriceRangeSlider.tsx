'use client'

import { Slider } from '@/components/ui/slider'
import { formatarPreco } from '@/lib/produtos'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  cor?: string
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  cor = '#F97316', // Fallback para o laranja padrão
}: PriceRangeSliderProps) {
  return (
    // Mudamos para flex-col e gap-3 para ter um controle exato do espaço
    <div className="flex flex-col gap-3">
      <Slider
        min={min}
        max={max}
        step={10}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        style={{ 
          '--cat-color': cor,
        } as React.CSSProperties}
        // Removemos o 'my-4' que estava empurrando a barra para baixo!
        className="mt-3 mb-2 [&_[data-slot=slider-range]]:bg-[var(--cat-color)] [&_[data-slot=slider-thumb]]:border-[var(--cat-color)] [&_[data-slot=slider-thumb]]:ring-[var(--cat-color)]"
      />
      
      <div className="flex justify-between items-center bg-[#0F0F13] border border-[#2A2A35] rounded-lg px-3 py-2">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-black text-[#A1A1AA] tracking-tighter">Mínimo</span>
          <span className="text-xs font-bold text-white">{formatarPreco(value[0])}</span>
        </div>
        <div className="h-4 w-[1px] bg-[#2A2A35]" />
        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase font-black text-[#A1A1AA] tracking-tighter">Máximo</span>
          <span className="text-xs font-bold text-white">{formatarPreco(value[1])}</span>
        </div>
      </div>
    </div>
  )
}