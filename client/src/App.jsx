import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import { CATEGORY_LABELS } from './labels'
import Stats from './components/Stats'
import ItemCard from './components/ItemCard'
import ItemForm from './components/ItemForm'

const TABS = [['', 'Tout'], ...Object.entries(CATEGORY_LABELS)]

export default function App() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null = fermé, {} = nouvel objet, item = édition
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.listItems({ category, status, q }), api.stats()])
      setItems(list)
      setStats(s)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [category, status, q])

  useEffect(() => {
    const t = setTimeout(refresh, q ? 200 : 0)
    return () => clearTimeout(t)
  }, [refresh, q])

  async function handleSave(data) {
    if (editing?.id) await api.updateItem(editing.id, data)
    else await api.createItem(data)
    setEditing(null)
    refresh()
  }

  async function handleDelete(item) {
    await api.deleteItem(item.id)
    setEditing(null)
    refresh()
  }

  async function handleToggleStatus(item) {
    await api.updateItem(item.id, { status: item.status === 'possede' ? 'recherche' : 'possede' })
    refresh()
  }

  const filtered = category || status || q

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="logo">Kapsy</h1>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ Ajouter</button>
      </header>

      <Stats stats={stats} />

      <nav className="tabs" aria-label="Catégories">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            className={`tab${category === value ? ' tab-active' : ''}`}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="filters">
        <input
          type="search"
          placeholder="Rechercher un nom, une série, un numéro…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Rechercher"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Statut">
          <option value="">Tous les statuts</option>
          <option value="possede">Dans ma collection</option>
          <option value="recherche">Recherchés</option>
        </select>
      </div>

      {error && <p className="banner-error" role="alert">{error}</p>}

      {!loading && items.length === 0 ? (
        <div className="empty">
          {filtered ? (
            <p>Aucun objet ne correspond à ces filtres.</p>
          ) : (
            <>
              <p>Votre collection est vide pour l’instant.</p>
              <button className="btn btn-primary" onClick={() => setEditing({})}>Ajouter mon premier objet</button>
            </>
          )}
        </div>
      ) : (
        <section className="grid">
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
    </div>
  )
}
