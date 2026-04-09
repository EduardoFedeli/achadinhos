/**
 * scraper.ts — Motor central de extração de preços
 * Pode ser importado pela API /scraper, pelo Radar e futuramente por Cron Jobs ou Bot do Telegram.
 */
import * as cheerio from 'cheerio'

export interface ScraperResult {
  nome: string
  preco: number
  preco_original: number | null
  imagem: string
}

const HEADERS_NAVEGADOR = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
}

export async function fetchComoNavegador(url: string) {
  return fetch(url, {
    redirect: 'follow',
    headers: HEADERS_NAVEGADOR,
  })
}

/** Detecta páginas de CAPTCHA / bloqueio de bot */
function detectarBloqueio(html: string, url: string): boolean {
  if (url.includes('amazon')) {
    return (
      html.includes('validateCaptcha') ||
      html.includes('Robot Check') ||
      html.includes('api-services-support.amazon') ||
      (html.toLowerCase().includes('captcha') && !html.includes('productTitle'))
    )
  }
  return false
}

/** Resolve links curtos do Mercado Livre (meli.la, vitrine, social) para o produto direto */
async function resolverMLBypass(url: string): Promise<string> {
  try {
    const preFetch = await fetchComoNavegador(url)
    const resolvedUrl = preFetch.url

    const mlbViaRedirect = resolvedUrl.match(/MLB-?(\d+)/i)
    if (mlbViaRedirect) {
      const direct = `https://produto.mercadolivre.com.br/MLB-${mlbViaRedirect[1]}`
      console.log(`[SCRAPER] ML bypass via redirect -> ${direct}`)
      return direct
    }

    // Parse do HTML da página intermediária
    const interHtml = await preFetch.text()
    const $ = cheerio.load(interHtml)

    const ogUrl = $('meta[property="og:url"]').attr('content') || ''
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || ''
    let mlbFromAnchor = ''
    $('a[href*="MLB"]').each((_, el) => {
      if (!mlbFromAnchor) mlbFromAnchor = $(el).attr('href') || ''
    })

    const candidateUrl = ogUrl || canonicalUrl || mlbFromAnchor || resolvedUrl
    const mlbViaHtml = candidateUrl.match(/MLB-?(\d+)/i)

    if (mlbViaHtml) {
      const direct = `https://produto.mercadolivre.com.br/MLB-${mlbViaHtml[1]}`
      console.log(`[SCRAPER] ML bypass via HTML parse -> ${direct}`)
      return direct
    }

    if (candidateUrl.includes('mercadolivre')) {
      console.log(`[SCRAPER] ML bypass via candidateUrl -> ${candidateUrl}`)
      return candidateUrl
    }
  } catch (e) {
    console.log('[SCRAPER] Falha no bypass ML:', e)
  }

  console.log('[SCRAPER] ML bypass: sem resultado, usando URL original.')
  return url
}

/** Resolve links curtos da Amazon (amzn.to) */
async function resolverAmazonShortLink(url: string): Promise<string> {
  try {
    const preRes = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: HEADERS_NAVEGADOR })
    if (preRes.url && preRes.url.includes('amazon')) {
      console.log(`[SCRAPER] Amazon short link -> ${preRes.url}`)
      return preRes.url
    }
  } catch (e) {
    console.log('[SCRAPER] Falha ao resolver short link Amazon:', e)
  }
  return url
}

/** Extrai preços da Amazon no layout moderno e antigo */
function extrairPrecoAmazon($: cheerio.CheerioAPI): { preco: number; preco_original: number | null } {
  let preco = 0
  let preco_original: number | null = null

  // Layout moderno: priceToPay
  const whole = $('.priceToPay .a-price-whole').first().text().trim().replace(/[^\d]/g, '')
  const frac = $('.priceToPay .a-price-fraction').first().text().trim().replace(/[^\d]/g, '') || '00'
  if (whole) preco = parseFloat(`${whole}.${frac}`)

  // Layout apex / corePrice
  if (!preco) {
    const apexStr = $('#corePrice_desktop .a-offscreen, #corePrice_feature_div .a-offscreen').first().text().trim()
    if (apexStr) preco = parseFloat(apexStr.replace(/[^\d,]/g, '').replace(',', '.'))
  }

  // Fallback genérico
  if (!preco) {
    const genericStr = $('.a-price .a-offscreen').first().text().trim()
    if (genericStr) preco = parseFloat(genericStr.replace(/[^\d,]/g, '').replace(',', '.'))
  }

  // Preço original (tachado)
  const origStr =
    $('span.a-price.a-text-price[data-a-strike="true"] span.a-offscreen').first().text().trim() ||
    $('.basisPrice .a-offscreen').first().text().trim() ||
    $('#listPrice').text().trim()
  if (origStr) {
    const parsed = parseFloat(origStr.replace(/[^\d,]/g, '').replace(',', '.'))
    if (!isNaN(parsed) && parsed > preco) preco_original = parsed
  }

  return { preco, preco_original }
}

/** Extrai preços do Mercado Livre via JSON-LD e DOM */
function extrairPrecoML($: cheerio.CheerioAPI): { preco: number; preco_original: number | null } {
  let preco = 0
  let preco_original: number | null = null

  // Estratégia 1: JSON-LD estruturado (mais confiável)
  $('script[type="application/ld+json"]').each((_, el) => {
    if (preco) return
    try {
      const data = JSON.parse($(el).html() || '{}')
      if (data.offers?.price) {
        preco = parseFloat(data.offers.price)
      } else if (Array.isArray(data)) {
        const node = data.find((i: any) => i['@type'] === 'Product' && i.offers)
        if (node?.offers?.price) preco = parseFloat(node.offers.price)
      }
    } catch {}
  })

  // Estratégia 2: DOM visual (andes-money-amount)
  if (!preco) {
    const frac = $('.ui-pdp-price__second-line .andes-money-amount__fraction').not('s *').first().text().trim()
    const cents = $('.ui-pdp-price__second-line .andes-money-amount__cents').not('s *').first().text().trim() || '00'
    if (frac) preco = parseFloat(`${frac.replace(/\./g, '')}.${cents}`)
  }

  // Preço original (tachado)
  const origFrac = $('s .andes-money-amount__fraction, s.andes-money-amount__fraction').first().text().trim()
  const origCents = $('s .andes-money-amount__cents, s.andes-money-amount__cents').first().text().trim() || '00'
  if (origFrac) {
    const parsed = parseFloat(`${origFrac.replace(/\./g, '')}.${origCents}`)
    if (!isNaN(parsed) && parsed > preco) preco_original = parsed
  }

  return { preco, preco_original }
}

/**
 * Função principal: recebe qualquer URL de produto e retorna os dados extraídos.
 * Lança exceção em caso de bloqueio, falha de rede ou preço não encontrado.
 */
export async function rasparProduto(url: string): Promise<ScraperResult> {
  let finalUrl = url

  // Resolver links curtos/bypass por marketplace
  if (url.includes('meli.la') || url.includes('mercadolivre.com.br/social/') || url.includes('mercadolivre.com.br/vitrine/')) {
    finalUrl = await resolverMLBypass(url)
  } else if (url.includes('amzn.to') || url.includes('amzn.eu')) {
    finalUrl = await resolverAmazonShortLink(url)
  }

  const response = await fetchComoNavegador(finalUrl)
  if (!response.ok) throw new Error(`HTTP ${response.status} ao acessar a loja`)

  const html = await response.text()
  finalUrl = response.url // URL final após todos os redirects

  if (detectarBloqueio(html, finalUrl)) {
    throw new Error('Bloqueio detectado (CAPTCHA/Robot Check)')
  }

  const $ = cheerio.load(html)
  let nome = ''
  let imagem = ''
  let preco = 0
  let preco_original: number | null = null

  if (finalUrl.includes('amazon') || finalUrl.includes('amzn')) {
    nome = $('#productTitle').text().trim() || $('meta[property="og:title"]').attr('content') || ''
    imagem = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || $('meta[property="og:image"]').attr('content') || ''
    const precos = extrairPrecoAmazon($)
    preco = precos.preco
    preco_original = precos.preco_original
  } else if (finalUrl.includes('mercadolivre') || finalUrl.includes('meli')) {
    nome = $('h1.ui-pdp-title').text().trim() || $('meta[property="og:title"]').attr('content') || ''
    imagem = $('meta[property="og:image"]').attr('content') || $('.ui-pdp-gallery__figure img').first().attr('src') || ''
    const precos = extrairPrecoML($)
    preco = precos.preco
    preco_original = precos.preco_original
  } else {
    nome = $('meta[property="og:title"]').attr('content') || $('title').text().trim() || ''
    imagem = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || ''
  }

  return { nome, preco, preco_original, imagem }
}
