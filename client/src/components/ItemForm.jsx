import { useEffect, useRef, useState } from 'react'
import { CircleAlert, Trash2, X } from 'lucide-react'
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
      setError(`Impossible d’enregistrer cette pièce. ${err.message}`)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Supprimer « ${item.name} » de ta collection ? Cette action est définitive.`)) return
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
          <h2>{item ? 'Modifier la pièce' : 'Ajouter une pièce'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer"><X size={20} aria-hidden="true" /></button>
        </header>

        <div className="form-grid">
          <label className="span-2">
            Nom *
            <input value={form.name} onChange={set('name')} required autoFocus placeholder="ex. Robot rouge" />
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
            <input value={form.series} onChange={set('series')} placeholder="ex. Série Espace" />
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
            Prix d’achat (€)
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

        {error && (
          <p className="form-error" role="alert"><CircleAlert size={18} aria-hidden="true" /> {error}</p>
        )}

        <footer className="modal-footer">
          {item && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              <Trash2 size={16} aria-hidden="true" /> Supprimer
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}
