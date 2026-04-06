import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { withAdmin } from '@/lib/auth'

export const POST = withAdmin(async function(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida.' }, { status: 400 })
    }

    // Faz o fetch com 'follow' para seguir encurtadores como meli.la e amzn.to até o site final
    const response = await fetch(url, {
      redirect: 'follow', 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
      }
    })

    if (!response.ok) throw new Error('Falha ao acessar a loja')

    const html = await response.text()
    const $ = cheerio.load(html)
    const finalUrl = response.url // A URL verdadeira após o redirecionamento

    let titulo = ''
    let imagem = ''
    let preco = 0
    let precoOriginal = null

    // 1. MOTOR ESPECÍFICO: AMAZON
    if (finalUrl.includes('amazon') || finalUrl.includes('amzn')) {
      titulo = $('#productTitle').text().trim() || $('meta[property="og:title"]').attr('content') || ''
      imagem = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || $('meta[property="og:image"]').attr('content') || ''

      let precoStr = $('.a-price .a-offscreen').first().text().trim() || $('#priceblock_ourprice').text().trim() || $('#priceblock_dealprice').text().trim()
      if (precoStr) {
        preco = parseFloat(precoStr.replace(/[^\d,]/g, '').replace(',', '.'))
      }

      let precoOriginalStr = $('span.a-price.a-text-price[data-a-strike="true"] span.a-offscreen').first().text().trim() || 
                             $('.a-price.a-text-price span.a-offscreen').first().text().trim() || $('.basisPrice .a-offscreen').first().text().trim() ||
                             $('.a-text-strike').first().text().trim() || $('#listPrice').text().trim()
      if (precoOriginalStr) {
        const match = precoOriginalStr.match(/R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/)
        let limpoOrig = match && match[1] ? match[1].replace(/\./g, '').replace(',', '.') : precoOriginalStr.replace(/[^\d,]/g, '').replace(',', '.')
        const valorParsed = parseFloat(limpoOrig)
        if (!isNaN(valorParsed) && valorParsed > preco) precoOriginal = valorParsed
      }
    } 
    // 2. MOTOR ESPECÍFICO: MERCADO LIVRE
    else if (finalUrl.includes('mercadolivre') || finalUrl.includes('meli')) {
      titulo = $('h1.ui-pdp-title').text().trim() || $('meta[property="og:title"]').attr('content') || ''
      imagem = $('meta[property="og:image"]').attr('content') || $('.ui-pdp-gallery__figure img').first().attr('src') || ''

      // Tentativa 1: Leitura de Metadados (À prova de variações de tamanho/cor)
      const metaPrice = $('meta[itemprop="price"]').attr('content');
      
      if (metaPrice) {
        preco = parseFloat(metaPrice);
      } else {
        // Tentativa 2: Leitura visual do DOM
        const reaisAtual = $('.ui-pdp-price__second-line .andes-money-amount__fraction').first().text().trim().replace(/\./g, '')
        const centavosAtual = $('.ui-pdp-price__second-line .andes-money-amount__cents').first().text().trim() || '00'
        if (reaisAtual) preco = parseFloat(`${reaisAtual}.${centavosAtual}`)
      }

      // Preço Riscado (Original) - O ML costuma usar a tag <s> (strike)
      const reaisOrig = $('s.andes-money-amount .andes-money-amount__fraction').first().text().trim().replace(/\./g, '') ||
                        $('.ui-pdp-price__original-value .andes-money-amount__fraction').first().text().trim().replace(/\./g, '')
      const centavosOrig = $('s.andes-money-amount .andes-money-amount__cents').first().text().trim() || 
                           $('.ui-pdp-price__original-value .andes-money-amount__cents').first().text().trim() || '00'
      
      if (reaisOrig) {
        const valorParsed = parseFloat(`${reaisOrig}.${centavosOrig}`)
        if (!isNaN(valorParsed) && valorParsed > preco) precoOriginal = valorParsed
      }
    }
    // 3. MOTOR UNIVERSAL (Fallback para qualquer outra loja cadastrada no seu painel)
    else {
      titulo = $('meta[property="og:title"]').attr('content') || $('title').text().trim() || ''
      imagem = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || ''
      // O motor universal só pega imagem e título, pois preço é impossível de prever sem mapeamento.
    }

    return NextResponse.json({ nome: titulo, preco, preco_original: precoOriginal, imagem })

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao caçar os dados. Verifique se o link está correto.' }, { status: 500 })
  }
});