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

export const COLOR_LABELS = {
  teal: 'Turquoise',
  coral: 'Corail',
  mustard: 'Moutarde',
}

export const SORT_LABELS = {
  recent: 'Ajouts récents',
  name: 'Nom (A → Z)',
  number: 'Numéro',
}

export const formatPrice = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n ?? 0)

export const pieces = (n) => `${n} ${n > 1 ? 'pièces' : 'pièce'}`
