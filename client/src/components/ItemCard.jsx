import { Camera, Check, Heart } from 'lucide-react'
import { CONDITION_LABELS, formatPrice } from '../labels'
import StatusBadge from './StatusBadge'

export default function ItemCard({ item, collection, onEdit, onToggleStatus }) {
  const wanted = item.status === 'recherche'
  const meta = [item.series, item.number && `n° ${item.number}`, item.year].filter(Boolean).join(' · ')
  const meta2 = [item.condition && CONDITION_LABELS[item.condition], item.price != null && formatPrice(item.price)]
    .filter(Boolean).join(' · ')

  return (
    <article className="card">
      <button className="card-body" onClick={() => onEdit(item)}>
        <div className="card-image">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" loading="lazy" />
          ) : (
            <Camera size={32} strokeWidth={1.75} aria-hidden="true" className="card-placeholder" />
          )}
          <span className="card-badges">
            <StatusBadge status={item.status} />
            {item.quantity > 1 && (
              <span className="badge badge-qty">
                ×{item.quantity}<span className="sr-only"> (en double)</span>
              </span>
            )}
          </span>
        </div>
        <div className="card-text">
          {collection && <span className={`chip col-${collection.color}`}>{collection.name}</span>}
          <h3>{item.name}</h3>
          {meta && <p className="card-meta">{meta}</p>}
          {meta2 && <p className="card-meta">{meta2}</p>}
        </div>
        <span className="sr-only">Modifier</span>
      </button>
      <button className="card-toggle" onClick={() => onToggleStatus(item)}>
        {wanted ? (
          <><Check size={16} aria-hidden="true" /> Je l’ai !</>
        ) : (
          <><Heart size={16} aria-hidden="true" /> Repasser en souhait</>
        )}
      </button>
    </article>
  )
}
