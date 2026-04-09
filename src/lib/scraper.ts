import * as cheerio from 'cheerio'

export interface ScraperResult {
  nome: string
  preco: number
  preco_original: number | null
  imagem: string
}

const HEADERS_NAVEGADOR = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
}

// O Disfarce: Simulamos ser o bot de preview do Facebook/WhatsApp
const HEADERS_SOCIAL_BOT = {
  'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Accept': 'text/html',
}

function extrairPrecoAmazon($: cheerio.CheerioAPI): { preco: number; preco_original: number | null } {
  let preco = 0
  let preco_original: number | null = null

  const whole = $('.priceToPay .a-price-whole').first().text().trim().replace(/[^\d]/g, '')
  const frac = $('.priceToPay .a-price-fraction').first().text().trim().replace(/[^\d]/g, '') || '00'
  if (whole) preco = parseFloat(`${whole}.${frac}`)

  if (!preco) {
    const apexStr = $('#corePrice_desktop .a-offscreen, #corePrice_feature_div .a-offscreen').first().text().trim()
    if (apexStr) preco = parseFloat(apexStr.replace(/[^\d,]/g, '').replace(',', '.'))
  }

  const origStr = $('span.a-price.a-text-price[data-a-strike="true"] span.a-offscreen').first().text().trim() || $('#listPrice').text().trim()
  if (origStr) {
    const parsed = parseFloat(origStr.replace(/[^\d,]/g, '').replace(',', '.'))
    if (!isNaN(parsed) && parsed > preco) preco_original = parsed
  }

  return { preco, preco_original }
}

export async function rasparProduto(url: string): Promise<ScraperResult> {
  let urlFinal = url;
  let idMlb: string | null = null;

  // 1. BYPASS DE REDES DE AFILIADOS
  if (url.includes('linksynergy.com') && url.includes('murl=')) {
    try {
      const urlObj = new URL(url);
      const murl = urlObj.searchParams.get('murl');
      if (murl) urlFinal = decodeURIComponent(murl);
    } catch (e) {}
  }

  // 2. MERCADO LIVRE (Vitrine Social + API)
  if (urlFinal.includes('meli.la') || urlFinal.includes('mercadolivre.com')) {
    try {
      const response = await fetch(urlFinal, { redirect: 'follow', headers: HEADERS_NAVEGADOR });
      let mlbMatch = response.url.match(/MLB[-_]?(\d+)/i);
      
      if (!mlbMatch && response.url.includes('/social/')) {
        const htmlSocial = await response.text();
        mlbMatch = htmlSocial.match(/MLB(?:[-_]|%2D)?(\d+)/i);
      }
      if (mlbMatch) idMlb = `MLB${mlbMatch[1]}`;
    } catch (error) {}

    if (idMlb) {
      try {
        const apiRes = await fetch(`https://api.mercadolibre.com/items/${idMlb}`);
        if (apiRes.ok) {
          const data = await apiRes.json();
          return {
            nome: data.title,
            preco: data.price,
            preco_original: data.original_price || null,
            imagem: data.pictures?.length > 0 ? data.pictures[0].secure_url : data.thumbnail
          };
        }
      } catch (e) {}
    }
  }

  // 3. RESOLUÇÃO DE ENCURTADORES
  if (urlFinal.includes('s.shopee') || urlFinal.includes('divulgador.magalu') || urlFinal.includes('amzn.to')) {
     try {
       const preFetch = await fetch(urlFinal, { redirect: 'follow', headers: HEADERS_NAVEGADOR });
       urlFinal = preFetch.url;
     } catch (e) {}
  }

  // 4. EXTRAÇÃO VIA HTML
  let res = await fetch(urlFinal, { headers: HEADERS_NAVEGADOR });
  
  // O PULO DO GATO: Se o site deu 403 (Forbidden) para o nosso bot, nós recarregamos vestindo o disfarce do Facebook
  if (res.status === 403) {
    console.log('[SCRAPER] 403 Detectado. Vestindo disfarce de Social Bot...');
    res = await fetch(urlFinal, { headers: HEADERS_SOCIAL_BOT });
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  
  let nome = '';
  let imagem = '';
  let preco = 0;
  let preco_original: number | null = null;

  if (urlFinal.includes('amazon') || urlFinal.includes('amzn')) {
    nome = $('#productTitle').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || $('meta[property="og:image"]').attr('content') || '';
    const precos = extrairPrecoAmazon($);
    preco = precos.preco;
    preco_original = precos.preco_original;
    
  } else if (urlFinal.includes('magazineluiza.com') || urlFinal.includes('magalu')) {
    // MAGALU (ATUALIZADO COM PREÇO ORIGINAL)
    nome = $('h1[data-testid="heading-product-title"]').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('meta[property="og:image"]').attr('content') || '';
    
    // Preço atual
    const precoStr = $('[data-testid="price-value"]').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    
    // Preço original: tenta o data-testid oficial, se falhar, pega o primeiro texto tachado <s> do HTML
    let precoOrigStr = $('[data-testid="price-original"]').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    if (!precoOrigStr) {
      precoOrigStr = $('s').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    }
    
    if (precoStr) preco = parseFloat(precoStr);
    
    if (precoOrigStr) {
      const pOrig = parseFloat(precoOrigStr);
      if (pOrig > preco) preco_original = pOrig;
    }

  } else if (urlFinal.includes('netshoes.com')) {
    nome = $('title').text().split('|')[0].trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('meta[property="og:image"]').attr('content') || '';
    const precoStr = $('.default-price span strong').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    if (precoStr) preco = parseFloat(precoStr);
    
  } else if (urlFinal.includes('shopee.')) {
    nome = $('title').text().replace(' | Shopee Brasil', '').trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('meta[property="og:image"]').attr('content') || '';
    const priceMeta = $('meta[name="twitter:data1"]').attr('content');
    if (priceMeta) preco = parseFloat(priceMeta.replace(/[^\d,]/g, '').replace(',', '.'));
  }

  // 5. FALLBACK EXTREMAMENTE AGRESSIVO PARA NOME E IMAGEM
  if (!nome) {
    nome = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || $('title').text().trim() || '';
  }
  if (!imagem) {
    imagem = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || $('link[rel="image_src"]').attr('href') || '';
  }

  if (!nome && !imagem) {
    console.warn(`[SCRAPER HÍBRIDO] Falha crítica em: ${urlFinal}.`);
  }

  // Retorna o que conseguiu. Se o preço for 0, o form vai deixar o campo em branco para preenchimento manual.
  return { 
    nome: nome || '', 
    preco: preco || 0, 
    preco_original: preco_original || null, 
    imagem: imagem || '' 
  };
}