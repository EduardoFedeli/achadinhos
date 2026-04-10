import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  // 👇 AQUI ESTÁ A CORREÇÃO: A URL base do seu projeto
  metadataBase: new URL('https://achadinhos-rho.vercel.app'), 
  title: 'T-Hex Indica — As melhores ofertas escolhidas a dedo',
  description: 'A curadoria mais implacável da internet. Produtos selecionados com descontos reais.',
  openGraph: {
    title: 'T-Hex Indica 🦖',
    description: 'A curadoria mais implacável de ofertas da internet.',
    url: 'https://achadinhos-rho.vercel.app/',
    siteName: 'T-Hex Indica',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark antialiased`}>
      {/* Adicionado o bg-gradient direto no body para fluidez máxima */}
      <body className="bg-[#0F0F13] bg-gradient-to-b from-[#1A1A24] via-[#0F0F13] to-[#0F0F13] min-h-screen text-white font-sans flex flex-col relative">
        
        {/* ── BACKGROUND GLOBAL REFINADO ── */}
        <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="fixed left-0 right-0 top-0 z-0 m-auto h-[400px] w-[600px] rounded-full bg-[#22C55E] opacity-[0.03] blur-[120px] pointer-events-none" />
        
        {/* z-10 garante que o site fica por cima da malha, e flex-1 empurra o footer pro final */}
        <div className="relative z-10 flex flex-col flex-1">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}