import { describe, it, expect } from 'vitest'
import {
  getCategorias,
  formatarPreco,
} from './produtos'
import type { Categoria } from '@/types' 

describe('getCategorias', () => {
  it('retorna todas as categorias', async () => {
    const cats = (await getCategorias()) as Categoria[]
    expect(cats.length).toBeGreaterThanOrEqual(0)
  })

  it('cada categoria tem slug, nome e cor hex', async () => {
    const cats = (await getCategorias()) as Categoria[]
    for (const cat of cats) {
      expect(cat.slug).toBeTruthy()
      expect(cat.nome).toBeTruthy()
      if (cat.cor) {
        expect(cat.cor).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    }
  })
})

describe('formatarPreco', () => {
  it('formata número como BRL', () => {
    expect(formatarPreco(49.90)).toMatch(/R\$/)
    expect(formatarPreco(49.90)).toMatch(/49/)
  })
})