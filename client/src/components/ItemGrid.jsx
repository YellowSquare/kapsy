import { useApp } from '../AppContext'
import ItemCard from './ItemCard'

export default function ItemGrid({ items, showCollection = true, empty, label = 'Pièces' }) {
  const { collections, openItemForm, toggleStatus } = useApp()
  if (!items) {
    return (
      <div className="grid" aria-busy="true" aria-label="Chargement">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="card skeleton" />)}
      </div>
    )
  }
  if (items.length === 0) return <div className="empty">{empty}</div>
  const byId = Object.fromEntries((collections ?? []).map((c) => [c.id, c]))
  return (
    <ul className="grid" aria-label={label}>
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard
            item={item}
            collection={showCollection ? byId[item.collectionId] : null}
            onEdit={(i) => openItemForm({ item: i })}
            onToggleStatus={toggleStatus}
          />
        </li>
      ))}
    </ul>
  )
}
