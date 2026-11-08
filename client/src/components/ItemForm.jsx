import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import FormError from './FormError'
import { CONDITION_LABELS, STATUS_LABELS } from '../labels'

const EMPTY = {
  name: '', collectionId: '', status: 'possede', series: '', number: '', year: '',
  condition: '', price: '', quantity: 1, imageUrl: '', notes: '',
}
const FIELDS = Object.keys(EMPTY)

export default function ItemForm({ item, collections, defaultCollectionId, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() => {
    if (item) {
      return Object.fromEntries(FIELDS.map((k) => [k, item[k] ?? EMPTY[k]]))
    }
    return { ...EMPTY, collectionId: defaultCollectionId || collections[0]?.id || '' }
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave({ ...form, quantity: Number(form.quantity) || 1 })
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
    <Modal title={item ? 'Modifier la pièce' : 'Ajouter une pièce'} onClose={onClose} onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="span-2">
          Nom *
          <input value={form.name} onChange={set('name')} required autoFocus placeholder="ex. Robot rouge" />
        </label>
        <label>
          Collection *
          <select value={form.collectionId} onChange={set('collectionId')} required>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          Numéro / référence
          <input value={form.number} onChange={set('number')} placeholder="ex. 01" />
        </label>
        <label>
          Année
          <input value={form.year} onChange={set('year')} inputMode="numeric" maxLength={4} placeholder="ex. 1998" />
        </label>
        <label>
          État
          <select value={form.condition} onChange={set('condition')}>
            <option value="">Non précisé</option>
            {Object.entries(CONDITION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>
          Prix d’achat (€)
          <input type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={set('price')} />
        </label>
        <label>
          Quantité
          <input type="number" min="1" step="1" inputMode="numeric" value={form.quantity} onChange={set('quantity')} />
        </label>
        <label className="span-2">
          Image (URL)
          <input type="url" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
        </label>
        <label className="span-2">
          Notes
          <textarea rows="3" value={form.notes} onChange={set('notes')} />
        </label>
      </div>
      <FormError>{error}</FormError>
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
    </Modal>
  )
}
