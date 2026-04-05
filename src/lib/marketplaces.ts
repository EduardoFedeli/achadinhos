export const MARKETPLACES = [
  { id: 'amazon', label: 'Amazon', cor: '#F97316' },
  { id: 'shopee', label: 'Shopee', cor: '#EE4D2D' },
  { id: 'mercadolivre', label: 'Mercado Livre', cor: '#FFE600' },
  { id: 'magalu', label: 'Magalu', cor: '#0086FF' },
  // Adicione ou remova aqui
] as const;

export type LojaId = typeof MARKETPLACES[number]['id'];