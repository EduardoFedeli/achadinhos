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
  cor,
}: PriceRangeSliderProps) {
  return (
    <div>
      <Slider
        min={min}
        max={max}
        step={10}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="my-3"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatarPreco(value[0])}</span>
        <span>{formatarPreco(value[1])}</span>
      </div>
    </div>
  )
}
