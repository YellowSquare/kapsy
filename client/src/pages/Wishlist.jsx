import { useState } from 'react'
import { useItems } from '../useItems'
import ItemToolbar from '../components/ItemToolbar'
import ItemGrid from '../components/ItemGrid'

export default function Wishlist() {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('recent')
  const { items, error } = useItems({ status: 'recherche', q, sort })
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Mes souhaits</h1>
          <p className="lead">Les pièces que tu cherches encore. Quand tu en trouves une, touche « Je l’ai ! ».</p>
        </div>
      </div>
      <ItemToolbar q={q} setQ={setQ} sort={sort} setSort={setSort} showStatus={false} />
      {error && <p className="banner-error" role="alert">{error}</p>}
      <ItemGrid
        items={items}
        label="Souhaits"
        empty={q ? <p>Aucune pièce ne correspond à ta recherche.</p> : (
          <>
            <h2>Aucun souhait pour l’instant.</h2>
            <p>Ajoute une pièce avec le statut « Souhaité » pour la retrouver ici.</p>
          </>
        )}
      />
    </>
  )
}
