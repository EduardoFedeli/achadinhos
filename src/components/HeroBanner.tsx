import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-8 pt-7"
      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFD23F 100%)' }}
    >
      {/* Círculos decorativos */}
      <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-white/10" />
      <div className="absolute bottom-[-30px] right-8 h-24 w-24 rounded-full bg-white/[0.06]" />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/85">
        ✨ Curadoria semanal
      </p>
      <h1 className="mb-1.5 text-[26px] font-black leading-tight tracking-tight text-white">
        Os melhores<br />achados pra você
      </h1>
      <p className="mb-5 text-sm text-white/90">
        Produtos selecionados da Amazon e Shopee
      </p>
      <Link
        href="#destaques"
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-extrabold text-brand shadow-md"
      >
        Ver tudo →
      </Link>
    </section>
  )
}
