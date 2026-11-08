import { CATEGORY_LABELS, CONDITION_LABELS, formatPrice } from '../labels'

export default function ItemCard({ item, onEdit, onToggleStatus }) {
  const wanted = item.status === 'recherche'
  return (
    <article className={`card card-${item.category}${wanted ? ' card-wanted' : ''}`}>
      <button className="card-body" onClick={() => onEdit(item)} aria-label={`Modifier ${item.name}`}>
        <div className="card-image">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" loading="lazy" />
          ) : (
            <span className="card-initial" aria-hidden="true">{item.name[0]?.toUpperCase()}</span>
          )}
          {item.quantity > 1 && <span className="card-qty">×{item.quantity}</span>}
        </div>
        <div className="card-text">
          <span className={`chip chip-${item.category}`}>{CATEGORY_LABELS[item.category]}</span>
          <h3>{item.name}</h3>
          {(item.series || item.number) && (
            <p className="card-meta">
              {item.series}
              {item.series && item.number && ' · '}
              {item.number && `n° ${item.number}`}
            </p>
          )}
          <p className="card-meta">
            {item.condition && CONDITION_LABELS[item.condition]}
            {item.condition && item.price != null && ' · '}
            {item.price != null && formatPrice(item.price)}
          </p>
        </div>
      </button>
      <button className="card-toggle" onClick={() => onToggleStatus(item)}>
        {wanted ? '✓ Je l’ai trouvé' : 'Mettre en recherche'}
      </button>
    </article>
  )
}
