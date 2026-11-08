import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FolderPlus, Plus } from 'lucide-react'
import { api } from '../api'
import { useApp } from '../AppContext'
import { useItems } from '../useItems'
import { formatPrice } from '../labels'
import CollectionCard from '../components/CollectionCard'
import ItemGrid from '../components/ItemGrid'

const greeting = () => (new Date().getHours() >= 18 ? 'Bonsoir' : 'Bonjour')

export default function Home() {
  const { collections, version, addPiece, openCollectionForm } = useApp()
  const [stats, setStats] = useState(null)
  const { items: recent } = useItems({ sort: 'recent', limit: 8 })

  useEffect(() => {
    api.stats().then(setStats).catch(() => {})
  }, [version])

  if (collections && collections.length === 0) {
    return (
      <section className="hero">
        <img src="/symbole.png" alt="" />
        <h1>Ta passion en un seul endroit.</h1>
        <p>Organise, suis et fais grandir tes collections.</p>
        <button className="btn btn-primary" onClick={() => openCollectionForm({})}>
          <FolderPlus size={18} aria-hidden="true" /> Créer ma collection
        </button>
      </section>
    )
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{greeting()} !</h1>
          <p className="lead">Voici où en sont tes collections.</p>
        </div>
      </div>

      {stats && (
        <section className="stats" aria-label="Résumé">
          <Stat value={stats.collections} label={stats.collections > 1 ? 'collections' : 'collection'} />
          <Stat value={stats.owned} label={stats.owned > 1 ? 'pièces possédées' : 'pièce possédée'} />
          <Stat value={stats.wishlist} label={stats.wishlist > 1 ? 'souhaits' : 'souhait'} />
          <Stat value={formatPrice(stats.value)} label="valeur d’achat" />
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Mes collections</h2>
          <Link to="/collections" className="btn btn-tertiary">Tout voir</Link>
        </div>
        <ul className="col-grid">
          {(collections ?? []).slice(0, 6).map((c) => <li key={c.id}><CollectionCard collection={c} /></li>)}
          <li>
            <button className="col-new" onClick={() => openCollectionForm({})}>
              <FolderPlus size={28} aria-hidden="true" />
              Nouvelle collection
            </button>
          </li>
        </ul>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Ajouts récents</h2>
        </div>
        <ItemGrid
          items={recent}
          label="Ajouts récents"
          empty={
            <>
              <h2>Chaque collection commence par une pièce.</h2>
              <p>Commence par ajouter ta première pièce.</p>
              <button className="btn btn-primary" onClick={() => addPiece()}>
                <Plus size={18} strokeWidth={2.5} aria-hidden="true" /> Ajouter une pièce
              </button>
            </>
          }
        />
      </section>
    </>
  )
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
