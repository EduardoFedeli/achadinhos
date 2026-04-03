import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Sobre — Achadinhos',
  description: 'Saiba mais sobre o Achadinhos e como funciona.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-page-bg pb-24">
      <Header />

      {/* Hero */}
      <section className="px-5 py-10 text-center">
        <h1 className="text-3xl font-black text-white">Sobre o Achadinhos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Curadoria honesta de produtos que valem cada centavo
        </p>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-5 pb-10">
        <div className="rounded-2xl bg-card-bg border border-card-border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">O que é o Achadinhos?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Achadinhos é um site de curadoria de produtos afiliados. Garimpamos os melhores
              produtos da Amazon e Shopee — com foco em qualidade, custo-benefício e avaliações
              reais de compradores.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">Como funciona?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada produto listado tem um link de afiliado. Quando você clica e compra, recebemos
              uma pequena comissão — sem custo extra pra você. Esse modelo nos permite manter o
              site gratuito e sem anúncios invasivos.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">Nossos perfis</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Cada categoria tem um perfil temático nas redes sociais com dicas e achados exclusivos.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '@bichinz_ — Pets', href: '#' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-card-border px-4 py-2 text-xs font-semibold text-brand hover:bg-brand/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
