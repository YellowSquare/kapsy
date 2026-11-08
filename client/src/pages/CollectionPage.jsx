import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ChevronLeft, Copy, Heart, Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '../api'
import { useApp } from '../AppContext'
import { useItems } from '../useItems'
import { pieces } from '../labels'
import { CollectionVisual } from '../components/CollectionCard'
import ProgressBar from '../components/ProgressBar'
import ItemToolbar from '../components/ItemToolbar'
import ItemGrid from '../components/ItemGrid'

export default function CollectionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { version, addPiece, openCollectionForm, changed, notify } = useApp()
  const [collection, setCollection] = useState(undefined) // undefined = chargement, null = introuvable
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('recent')
  const { items, error } = useItems({ collectionId: id, q, status, sort })

  useEffect(() => {
    api.getCollection(id)
      .then(setCollection)
      .catch((err) => setCollection(err.status === 404 ? null : undefined))
  }, [id, version])

  if (collection === null) {
    return (
      <div className="empty">
        <h2>Cette collection n’existe plus.</h2>
        <Link to="/collections" className="btn btn-secondary">Voir mes collections</Link>
      </div>
    )
  }
  if (!collection) return <div className="col-header skeleton" aria-busy="true" />

  async function handleDelete() {
    const total = collection.owned + collection.wishlist
    const msg = total
      ? `Supprimer « ${collection.name} » et ses ${pieces(total)} ? Cette action est définitive.`
      : `Supprimer « ${collection.name} » ?`
    if (!confirm(msg)) return
    await api.deleteCollection(collection.id)
    notify('Collection supprimée.')
    changed()
    navigate('/collections')
  }

  const filtered = q || status

  return (
    <>
      <Link to="/collections" className="back-link">
        <ChevronLeft size={18} aria-hidden="true" /> Mes collections
      </Link>

      <header className="col-header">
        <CollectionVisual collection={collection} large />
        <div className="col-header-text">
          <h1>{collection.name}</h1>
          {collection.description && <p className="lead">{collection.description}</p>}
          <ul className="counters" aria-label="Compteurs">
            <li><b>{collection.target ? `${collection.owned} / ${collection.target}` : collection.owned}</b> {collection.owned > 1 || collection.target > 1 ? 'pièces' : 'pièce'}</li>
            <li><Heart size={14} aria-hidden="true" /> <b>{collection.wishlist}</b> souhait{collection.wishlist > 1 ? 's' : ''}</li>
            {collection.doubles > 0 && (
              <li><Copy size={14} aria-hidden="true" /> <b>{collection.doubles}</b> en double</li>
            )}
          </ul>
          <ProgressBar owned={collection.owned} target={collection.target} color={collection.color} />
          <div className="col-actions">
            <button className="btn btn-primary" onClick={() => addPiece(collection.id)}>
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" /> Ajouter une pièce
            </button>
            <button className="btn btn-secondary" onClick={() => openCollectionForm({ collection })}>
              <Pencil size={16} aria-hidden="true" /> Modifier
            </button>
            <button className="btn btn-tertiary btn-tertiary-danger" onClick={handleDelete}>
              <Trash2 size={16} aria-hidden="true" /> Supprimer
            </button>
          </div>
        </div>
      </header>

      <ItemToolbar q={q} setQ={setQ} status={status} setStatus={setStatus} sort={sort} setSort={setSort} />
      {error && <p className="banner-error" role="alert">{error}</p>}
      <ItemGrid
        items={items}
        showCollection={false}
        label={`Pièces de ${collection.name}`}
        empty={filtered ? (
          <p>Aucune pièce ne correspond à ta recherche.</p>
        ) : (
          <>
            <h2>Chaque collection commence par une pièce.</h2>
            <p>Ajoute la première pièce de « {collection.name} ».</p>
            <button className="btn btn-primary" onClick={() => addPiece(collection.id)}>
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" /> Ajouter une pièce
            </button>
          </>
        )}
      />
    </>
  )
}
