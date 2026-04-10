interface FilterChipProps {
  label: string
  ativo: boolean
  cor?: string
  onClick: () => void
}

export default function FilterChip({ label, ativo, cor, onClick }: FilterChipProps) {
  const accentColor = cor || '#F97316';
  // Remove a tralha (#) para criar um nome de classe válido
  const colorId = accentColor.replace('#', '');
  const chipClassName = `chip-active-${colorId}`;

  return (
    <>
      {/* Injeta a cor dinamicamente se estiver ativo */}
      {ativo && (
        <style dangerouslySetInnerHTML={{ __html: `
          .${chipClassName} { background-color: ${accentColor}; border-color: ${accentColor}; }
        `}} />
      )}
      
      <button
        type="button"
        onClick={onClick}
        className={`
          rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide 
          transition-all duration-300
          ${ativo 
            ? `text-white shadow-md ${chipClassName}` 
            : 'bg-[#1A1A24] border-[#2A2A35] text-[#A1A1AA] hover:border-orange-500/50 hover:text-white hover:bg-[#2A2A35]'
          }
        `}
      >
        {label}
      </button>
    </>
  )
}