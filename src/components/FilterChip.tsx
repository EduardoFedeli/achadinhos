interface FilterChipProps {
  label: string
  ativo: boolean
  cor?: string
  onClick: () => void
}

export default function FilterChip({ label, ativo, cor, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
      style={
        ativo
          ? {
              backgroundColor: cor ?? '#F97316',
              borderColor: cor ?? '#F97316',
              color: '#ffffff',
            }
          : {
              backgroundColor: 'transparent',
              borderColor: '#2A2A3E',
              color: '#9CA3AF',
            }
      }
    >
      {label}
    </button>
  )
}
