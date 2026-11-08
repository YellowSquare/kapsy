import { Check, Copy, Heart, X } from 'lucide-react'
import StatusBadge from './StatusBadge'

// « Tu l'as peut-être déjà » : propositions issues de la comparaison de photos.
export default function DuplicatePanel({ matches, collections, busy, onSame, onDismiss }) {
  const byId = Object.fromEntries(collections.map((c) => [c.id, c]))
  const top = matches[0]
  const title = top.item.status === 'recherche'
    ? 'Elle ressemble à une pièce de tes souhaits !'
    : top.level === 'strong' ? 'On dirait que tu l’as déjà !' : 'Tu l’as peut-être déjà.'

  return (
    <section className="dup-panel" aria-labelledby="dup-title" role="group">
      <h3 id="dup-title">{title}</h3>
      <p className="dup-hint">Vérifie : la comparaison de photos donne une piste, pas une certitude.</p>
      <ul className="dup-list">
        {matches.map(({ item, level }) => {
          const wanted = item.status === 'recherche'
          return (
            <li key={item.id} className="dup-item">
              <img src={item.imageUrl} alt="" />
              <div className="dup-text">
                <strong>{item.name}</strong>
                <span className="dup-meta">
                  {byId[item.collectionId]?.name}
                  {item.quantity > 1 && ` · ×${item.quantity}`}
                </span>
                <span className="dup-badges">
                  <StatusBadge status={item.status} />
                  <span className={`badge badge-match badge-match-${level}`}>
                    {level === 'strong' ? 'Très ressemblant' : 'Ressemblant'}
                  </span>
                </span>
              </div>
              <button type="button" className="btn btn-accent" disabled={busy} onClick={() => onSame(item)}>
                {wanted ? (
                  <><Heart size={16} aria-hidden="true" /> Je l’ai trouvée !</>
                ) : (
                  <><Copy size={16} aria-hidden="true" /> C’est la même : +1 exemplaire</>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      <button type="button" className="btn btn-secondary dup-dismiss" onClick={onDismiss}>
        <X size={16} aria-hidden="true" /> Non, c’est une autre pièce
      </button>
    </section>
  )
}

export function NoDuplicate() {
  return (
    <p className="dup-none" role="status">
      <Check size={16} aria-hidden="true" /> Aucune pièce ressemblante dans ta collection.
    </p>
  )
}
