interface FilterChipProps {
  label: string
  ativo: boolean
  cor?: string
  onClick: () => void
}

export default function FilterChip({ label, ativo, cor, onClick }: FilterChipProps) {
  // Fallback de cor caso não definida
  const accentColor = cor || '#F97316';

  return (
    <button
      type="button"
      onClick={onClick}
      // Usando Tailwind para estrutura, transição e cores base.
      // Inativo (neutro): bg-[#1A1A24], border-[#2A2A35], text-[#A1A1AA] (zinc-400)
      // Ativo (dinâmico): Usamos style binding apenas para o fundo.
      className={`
        rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide 
        transition-all duration-300
        ${ativo 
          ? 'text-white shadow-md' 
          : 'bg-[#1A1A24] border-[#2A2A35] text-[#A1A1AA] hover:border-orange-500/50 hover:text-white hover:bg-[#2A2A35]'
        }
      `}
      style={
        ativo
          ? {
              backgroundColor: accentColor,
              borderColor: accentColor,
            }
          : undefined
      }
    >
      {label}
    </button>
  )
}