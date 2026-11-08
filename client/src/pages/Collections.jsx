import { FolderPlus } from 'lucide-react'
import { useApp } from '../AppContext'
import CollectionCard from '../components/CollectionCard'

export default function Collections() {
  const { collections, openCollectionForm } = useApp()
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Mes collections</h1>
          {collections && <p className="lead">{collections.length} collection{collections.length > 1 ? 's' : ''}</p>}
        </div>
        <button className="btn btn-secondary" onClick={() => openCollectionForm({})}>
          <FolderPlus size={18} aria-hidden="true" /> Nouvelle collection
        </button>
      </div>
      {!collections ? (
        <div className="col-grid" aria-busy="true">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="col-card skeleton" />)}
        </div>
      ) : collections.length === 0 ? (
        <div className="empty">
          <img src="/symbole.png" alt="" />
          <h2>Ta première collection t’attend.</h2>
          <p>Regroupe tes pièces par thème, série ou licence.</p>
          <button className="btn btn-primary" onClick={() => openCollectionForm({})}>
            <FolderPlus size={18} aria-hidden="true" /> Créer ma collection
          </button>
        </div>
      ) : (
        <ul className="col-grid">
          {collections.map((c) => <li key={c.id}><CollectionCard collection={c} /></li>)}
        </ul>
      )}
    </>
  )
}
