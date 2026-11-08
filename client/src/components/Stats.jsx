import { CATEGORY_LABELS, formatPrice } from '../labels'

export default function Stats({ stats }) {
  if (!stats) return null
  return (
    <section className="stats" aria-label="Statistiques">
      <div className="stat">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">objets possédés</span>
      </div>
      <div className="stat">
        <span className="stat-value">{stats.wishlist}</span>
        <span className="stat-label">recherchés</span>
      </div>
      <div className="stat">
        <span className="stat-value">{formatPrice(stats.value)}</span>
        <span className="stat-label">valeur d'achat</span>
      </div>
      <div className="stat stat-breakdown">
        {Object.entries(stats.byCategory).map(([cat, n]) => (
          <span key={cat} className={`chip chip-${cat}`}>
            {CATEGORY_LABELS[cat]} <b>{n.possede}</b>
          </span>
        ))}
      </div>
    </section>
  )
}
