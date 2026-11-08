import { CATEGORY_LABELS, formatPrice } from '../labels'

export default function Stats({ stats }) {
  if (!stats) return null
  return (
    <section className="stats" aria-label="Résumé de ta collection">
      <div className="stat">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">{stats.total > 1 ? 'pièces possédées' : 'pièce possédée'}</span>
      </div>
      <div className="stat">
        <span className="stat-value">{stats.wishlist}</span>
        <span className="stat-label">{stats.wishlist > 1 ? 'souhaits' : 'souhait'}</span>
      </div>
      <div className="stat">
        <span className="stat-value">{formatPrice(stats.value)}</span>
        <span className="stat-label">valeur d'achat</span>
      </div>
      <ul className="stat stat-breakdown" aria-label="Pièces possédées par catégorie">
        {Object.entries(stats.byCategory).map(([cat, n]) => (
          <li key={cat} className={`chip chip-${cat}`}>
            {CATEGORY_LABELS[cat]} <b>{n.possede}</b>
          </li>
        ))}
      </ul>
    </section>
  )
}
