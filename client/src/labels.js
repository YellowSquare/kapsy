export const CATEGORY_LABELS = {
  pez: 'PEZ',
  pop: 'Pop',
  'mighty-mug': 'Mighty Mugs',
  autre: 'Autres',
}

export const STATUS_LABELS = {
  possede: 'Dans ma collection',
  recherche: 'Recherché',
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
