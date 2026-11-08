import { useCallback, useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { api } from './api'
import { CATEGORY_LABELS } from './labels'
import Stats from './components/Stats'
import ItemCard from './components/ItemCard'
import ItemForm from './components/ItemForm'
import Toast from './components/Toast'

const TABS = [['', 'Tout'], ...Object.entries(CATEGORY_LABELS)]

export default function App() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null = fermé, {} = nouvelle pièce, item = édition
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const clearToast = useCallback(() => setToast(null), [])

  const refresh = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.listItems({ category, status, q }), api.stats()])
      setItems(list)
      setStats(s)
      setError(null)
    } catch {
      setError('Impossible de charger ta collection. Réessaie dans un instant.')
    } finally {
      setLoading(false)
    }
  }, [category, status, q])

  useEffect(() => {
    const t = setTimeout(refresh, q ? 200 : 0)
    return () => clearTimeout(t)
  }, [refresh, q])

  async function handleSave(data) {
    const isNew = !editing?.id
    if (isNew) await api.createItem(data)
    else await api.updateItem(editing.id, data)
    setEditing(null)
    setToast(isNew ? 'C’est ajouté à ta collection !' : 'Modifications enregistrées.')
    refresh()
  }

  async function handleDelete(item) {
    await api.deleteItem(item.id)
    setEditing(null)
    setToast('Pièce supprimée.')
    refresh()
  }

  async function handleToggleStatus(item) {
    const next = item.status === 'possede' ? 'recherche' : 'possede'
    await api.updateItem(item.id, { status: next })
    setToast(next === 'possede' ? 'Une nouvelle pièce dans ta collection !' : 'Ajouté à tes souhaits.')
    refresh()
  }

  const filtered = category || status || q

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="logo">
          <img src="/logo.png" alt="Kapsy" width="329" height="120" />
        </h1>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          <Plus size={18} strokeWidth={2.5} aria-hidden="true" /> Ajouter une pièce
        </button>
      </header>

      <p className="tagline">Ta passion en un seul endroit.</p>

      <Stats stats={stats} />

      <nav className="tabs" aria-label="Catégories">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            className="filter"
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="filters">
        <label className="search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Rechercher</span>
          <input
            type="search"
            placeholder="Nom, série, numéro…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="sr-only" htmlFor="status-filter">Statut</label>
        <select id="status-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="possede">Possédés</option>
          <option value="recherche">Souhaités</option>
        </select>
      </div>

      {error && <p className="banner-error" role="alert">{error}</p>}

      {loading ? (
        <section className="grid" aria-busy="true" aria-label="Chargement">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="card skeleton" />)}
        </section>
      ) : items.length === 0 ? (
        <div className="empty">
          {filtered ? (
            <p>Aucune pièce ne correspond à ta recherche.</p>
          ) : (
            <>
              <img src="/symbole.png" alt="" />
              <h2>Chaque collection commence par une pièce.</h2>
              <p>Commence par ajouter ta première pièce.</p>
              <button className="btn btn-primary" onClick={() => setEditing({})}>
                <Plus size={18} strokeWidth={2.5} aria-hidden="true" /> Ajouter une pièce
              </button>
            </>
          )}
        </div>
      ) : (
        <section className="grid" aria-label="Pièces">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onEdit={setEditing} onToggleStatus={handleToggleStatus} />
          ))}
        </section>
      )}

      {editing && (
        <ItemForm
          item={editing.id ? editing : null}
          defaultCategory={category}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}

      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}
