import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || (!url.includes('amazon') && !url.includes('amzn.to'))) {
      return NextResponse.json({ error: 'Por enquanto, o T-Hex só sabe caçar na Amazon!' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
      }
    })

    if (!response.ok) throw new Error('Falha ao acessar a Amazon')

    const html = await response.text()
    const $ = cheerio.load(html)

    const titulo = $('#productTitle').text().trim()

    let imagem = $('#landingImage').attr('src')
    if (!imagem) {
      imagem = $('#imgBlkFront').attr('src') || '' 
    }

    // 3. Preço Atual
    let precoStr = $('.a-price .a-offscreen').first().text().trim() || 
                   $('#priceblock_ourprice').text().trim() || 
                   $('#priceblock_dealprice').text().trim()

    let preco = 0
    if (precoStr) {
      const limpo = precoStr.replace(/[^\d,]/g, '').replace(',', '.')
      preco = parseFloat(limpo)
    }

    // 4. Preço Original (Riscado) - CAÇADOR MODO HARD
    let precoOriginalStr = $('.a-price.a-text-price span.a-offscreen').first().text().trim() || 
                           $('.basisPrice .a-offscreen').first().text().trim() ||
                           $('.a-text-strike').first().text().trim() ||
                           $('#priceBlock_listprice_column .a-color-secondary').first().text().trim()
    
    // A Amazon às vezes buga e retorna "R$ 59,90R$ 59,90". Essa regex extrai só o primeiro valor limpo.
    if (precoOriginalStr.length > 15) {
      const match = precoOriginalStr.match(/R\$\s*\d+[\.,]\d{2}/)
      if (match) precoOriginalStr = match[0]
    }

    let precoOriginal = null
    if (precoOriginalStr) {
      const limpoOrig = precoOriginalStr.replace(/[^\d,]/g, '').replace(',', '.')
      const valorParsed = parseFloat(limpoOrig)
      // Só aceita o preço original se ele for genuinamente maior que o preço atual (evita falsos positivos)
      if (valorParsed > preco) {
        precoOriginal = valorParsed
      }
    }

    return NextResponse.json({ 
      nome: titulo, 
      preco: preco, 
      preco_original: precoOriginal,
      imagem: imagem 
    })

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao caçar os dados. Verifique o link.' }, { status: 500 })
  }
}