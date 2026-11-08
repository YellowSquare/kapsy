export const CATEGORY_LABELS = {
  pez: 'PEZ',
  pop: 'Pop',
  'mighty-mug': 'Mighty Muggs',
  autre: 'Autres',
}

export const STATUS_LABELS = {
  possede: 'Possédé',
  recherche: 'Souhaité',
}

export const CONDITION_LABELS = {
  'neuf-boite': 'Neuf en boîte',
  neuf: 'Neuf sans boîte',
  'tres-bon': 'Très bon état',
  bon: 'Bon état',
  abime: 'Abîmé',
}

export const formatPrice = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n ?? 0)

export const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`
