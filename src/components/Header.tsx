export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 py-3 shadow-sm border-b border-gray-100">
      <span className="text-2xl font-black tracking-tight">
        <span className="text-brand">acha</span>
        <span className="text-brand-yellow">dinhos</span>
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Buscar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-lg"
        >
          🔍
        </button>
        <button
          type="button"
          aria-label="Notificações"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-lg"
        >
          🔔
        </button>
      </div>
    </header>
  )
}
