import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || (!url.includes('amazon') && !url.includes('amzn.to'))) {
      return NextResponse.json({ error: 'Por enquanto, o T-Hex só sabe caçar na Amazon!' }, { status: 400 })
    }

    // Fingimos ser um navegador real para a Amazon não nos bloquear
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
      }
    })

    if (!response.ok) throw new Error('Falha ao acessar a Amazon')

    const html = await response.text()
    
    // O Cheerio carrega o HTML para podermos buscar como se fosse CSS
    const $ = cheerio.load(html)

    // 1. Pega o Título
    const titulo = $('#productTitle').text().trim()

    // 2. Pega a Imagem (a Amazon guarda as imagens em alta resolução em atributos específicos)
    let imagem = $('#landingImage').attr('src')
    if (!imagem) {
      // Alguns livros ou produtos usam outro ID
      imagem = $('#imgBlkFront').attr('src') || '' 
    }

    // 3. Pega o Preço Atual
    let precoStr = $('.a-price .a-offscreen').first().text().trim() || 
                   $('#priceblock_ourprice').text().trim() || 
                   $('#priceblock_dealprice').text().trim()

    let preco = 0
    if (precoStr) {
      const limpo = precoStr.replace(/[^\d,]/g, '').replace(',', '.')
      preco = parseFloat(limpo)
    }

    // 4. Pega o Preço Original (Riscado)
    let precoOriginalStr = $('.a-text-price .a-offscreen').first().text().trim() || 
                           $('.a-text-strike').first().text().trim()
    
    let precoOriginal = null
    if (precoOriginalStr) {
      const limpoOrig = precoOriginalStr.replace(/[^\d,]/g, '').replace(',', '.')
      const valorParsed = parseFloat(limpoOrig)
      // Só salva se o preço original for realmente maior que o preço atual
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