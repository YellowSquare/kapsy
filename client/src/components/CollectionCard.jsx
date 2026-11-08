import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { pieces } from '../labels'

export function CollectionVisual({ collection, large = false }) {
  const covers = collection.covers ?? []
  return (
    <div className={`col-visual col-${collection.color}${large ? ' col-visual-lg' : ''}`} aria-hidden="true">
      {covers.length > 0 ? (
        <div className={`mosaic mosaic-${Math.min(covers.length, 4)}`}>
          {covers.slice(0, 4).map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
        </div>
      ) : (
        // Motif « cartes superposées » du pictogramme
        <div className="stack">
          <span /><span /><span>{collection.name[0]?.toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}

export default function CollectionCard({ collection }) {
  const count = collection.target
    ? `${collection.owned} / ${pieces(collection.target)}`
    : pieces(collection.owned)
  return (
    <article className="col-card">
      <Link to={`/collections/${collection.id}`} className="col-link">
        <CollectionVisual collection={collection} />
        <div className="col-text">
          <h3>{collection.name}</h3>
          <p className="col-count">
            {count}
            {collection.wishlist > 0 && (
              <span className="col-wish"><Heart size={14} aria-hidden="true" /> {collection.wishlist} souhait{collection.wishlist > 1 ? 's' : ''}</span>
            )}
          </p>
          <ProgressBar owned={collection.owned} target={collection.target} />
        </div>
      </Link>
    </article>
  )
}
