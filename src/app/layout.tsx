import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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

// O erro geralmente está nesta linha: PRECISA ter o "export default"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark antialiased`}>
      {/* DICA DE UX: Garanta que o body tenha o fundo Dark & Bold 
          para evitar "flash" branco ao carregar.
      */}
      <body className="min-h-screen bg-[#0F0F13] text-white font-sans">
        {children}
      </body>
    </html>
  )
}