import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LABELS, CONDITION_LABELS, STATUS_LABELS } from '../labels'

const EMPTY = {
  name: '', category: 'pez', status: 'possede', series: '', number: '',
  condition: '', price: '', quantity: 1, imageUrl: '', notes: '',
}

export default function ItemForm({ item, defaultCategory, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() =>
    item ? { ...EMPTY, ...item, price: item.price ?? '', condition: item.condition ?? '' }
         : { ...EMPTY, category: defaultCategory || 'pez' },
  )
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = form
      await onSave({ ...data, quantity: Number(data.quantity) || 1 })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Supprimer « ${item.name} » ?`)) return
    try {
      await onDelete(item)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <header className="modal-header">
          <h2>{item ? 'Modifier l’objet' : 'Ajouter un objet'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </header>

        <div className="form-grid">
          <label className="span-2">
            Nom *
            <input value={form.name} onChange={set('name')} required autoFocus placeholder="ex. Mickey Mouse" />
          </label>
          <label>
            Catégorie
            <select value={form.category} onChange={set('category')}>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            Statut
            <select value={form.status} onChange={set('status')}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            Série / licence
            <input value={form.series} onChange={set('series')} placeholder="ex. Disney" />
          </label>
          <label>
            Numéro
            <input value={form.number} onChange={set('number')} placeholder="ex. 01" />
          </label>
          <label>
            État
            <select value={form.condition} onChange={set('condition')}>
              <option value="">—</option>
              {Object.entries(CONDITION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            Prix d'achat (€)
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} />
          </label>
          <label>
            Quantité
            <input type="number" min="1" step="1" value={form.quantity} onChange={set('quantity')} />
          </label>
          <label>
            Image (URL)
            <input type="url" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
          </label>
          <label className="span-2">
            Notes
            <textarea rows="3" value={form.notes} onChange={set('notes')} />
          </label>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <footer className="modal-footer">
          {item && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}
