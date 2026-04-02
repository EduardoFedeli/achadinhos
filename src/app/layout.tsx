import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Achadinhos — Os melhores achados da internet',
  description:
    'Produtos selecionados da Amazon e Shopee organizados por categoria. Pets, Games, Tech, Fitness, Moda e Casa.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-page-bg">{children}</body>
    </html>
  )
}
