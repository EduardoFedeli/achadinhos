import Link from 'next/link'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-[#2A2A35] bg-[#0F0F13] mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Marca */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tighter text-white">T-HEX</span>
          <span className="text-lg font-black tracking-tighter text-[#22C55E]">INDICA</span>
          <span className="ml-1 text-[10px] text-[#A1A1AA] font-medium uppercase tracking-widest self-end mb-0.5">
            © {ano}
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5 flex-wrap justify-center">
          <Link href="/explorar" className="text-[11px] text-[#A1A1AA] hover:text-white font-medium uppercase tracking-wider transition-colors">
            Explorar
          </Link>
          <Link href="/mais-vendidos" className="text-[11px] text-[#A1A1AA] hover:text-white font-medium uppercase tracking-wider transition-colors">
            Mais Vendidos
          </Link>
          <Link href="/novidades" className="text-[11px] text-[#A1A1AA] hover:text-white font-medium uppercase tracking-wider transition-colors">
            Novidades
          </Link>
          <Link href="/sobre" className="text-[11px] text-[#A1A1AA] hover:text-white font-medium uppercase tracking-wider transition-colors">
            Sobre
          </Link>
          <Link 
            href="https://t.me/+KJS4AekuWeYzMDZh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[11px] text-[#0088CC] hover:text-[#0088CC]/80 font-black uppercase tracking-wider transition-colors"
          >
            Grupo Telegram
          </Link>
        </nav>

        {/* Disclaimer */}
        <p className="text-[10px] text-[#A1A1AA]/60 text-center sm:text-right max-w-[260px] leading-relaxed">
          Links de afiliado. Ao comprar, podemos receber uma comissão sem custo adicional para você.
        </p>
      </div>
    </footer>
  )
}