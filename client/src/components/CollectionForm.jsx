import { useState } from 'react'
import Modal from './Modal'
import FormError from './FormError'
import { COLOR_LABELS } from '../labels'

export default function CollectionForm({ collection, intro, onSave, onClose }) {
  const [form, setForm] = useState({
    name: collection?.name ?? '',
    color: collection?.color ?? 'teal',
    target: collection?.target ?? '',
    description: collection?.description ?? '',
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(`Impossible d’enregistrer cette collection. ${err.message}`)
      setSaving(false)
    }
  }

  return (
    <Modal title={collection ? 'Modifier la collection' : 'Créer ma collection'} onClose={onClose} onSubmit={handleSubmit}>
      {intro && <p className="modal-intro">{intro}</p>}
      <div className="form-grid">
        <label className="span-2">
          Nom de la collection *
          <input value={form.name} onChange={set('name')} required maxLength={80} autoFocus placeholder="ex. Mes PEZ vintage" />
        </label>
        <label>
          Total visé
          <input type="number" min="1" step="1" inputMode="numeric" value={form.target} onChange={set('target')} aria-describedby="target-help" />
          <span id="target-help" className="help">Facultatif. Sert à afficher ta progression.</span>
        </label>
        <fieldset className="color-field">
          <legend>Couleur de repère</legend>
          <div className="swatches">
            {Object.entries(COLOR_LABELS).map(([value, label]) => (
              <label key={value} className={`swatch col-${value}`}>
                <input type="radio" name="color" value={value} checked={form.color === value} onChange={set('color')} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="span-2">
          Description
          <textarea rows="2" value={form.description} onChange={set('description')} />
        </label>
      </div>
      <FormError>{error}</FormError>
      <footer className="modal-footer">
        <span className="spacer" />
        <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Enregistrement…' : collection ? 'Enregistrer' : 'Créer ma collection'}
        </button>
      </footer>
    </Modal>
  )
}
