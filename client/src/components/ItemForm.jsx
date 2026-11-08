import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import FormError from './FormError'
import PhotoField from './PhotoField'
import DuplicatePanel, { NoDuplicate } from './DuplicatePanel'
import { api } from '../api'
import { preparePhoto } from '../lib/photo'
import { CONDITION_LABELS, STATUS_LABELS } from '../labels'

const EMPTY = {
  name: '', collectionId: '', status: 'possede', series: '', number: '', year: '',
  condition: '', price: '', quantity: 1, imageUrl: '', notes: '',
}
const FIELDS = Object.keys(EMPTY)

export default function ItemForm({ item, collections, defaultCollectionId, onSave, onSame, onDelete, onClose }) {
  const [form, setForm] = useState(() => {
    if (item) return Object.fromEntries(FIELDS.map((k) => [k, item[k] ?? EMPTY[k]]))
    return { ...EMPTY, collectionId: defaultCollectionId || collections[0]?.id || '' }
  })
  const [photo, setPhoto] = useState(null) // { blob, previewUrl, signature }
  const [photoBusy, setPhotoBusy] = useState(null)
  const [check, setCheck] = useState(null) // null | { matches: [] }
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const panelRef = useRef(null)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => () => photo && URL.revokeObjectURL(photo.previewUrl), [photo])
  useEffect(() => {
    if (check?.matches.length) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [check])

  async function handlePhoto(file) {
    setError(null)
    setCheck(null)
    setPhotoBusy('Préparation de la photo…')
    try {
      const prepared = await preparePhoto(file)
      setPhoto(prepared)
      setPhotoBusy('Comparaison avec ta collection…')
      const matches = await api.findSimilar(prepared.signature, item?.id)
      setCheck({ matches })
    } catch (err) {
      setError(`Impossible d’utiliser cette photo. ${err.message}`)
    } finally {
      setPhotoBusy(null)
    }
  }

  function removePhoto() {
    setPhoto(null)
    setCheck(null)
    setForm((f) => ({ ...f, imageUrl: '' }))
  }

  async function uploadIfNeeded() {
    if (!photo) return {}
    const { url } = await api.uploadPhoto(photo.blob)
    return { imageUrl: url, imageSig: photo.signature }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const image = await uploadIfNeeded()
      const data = { ...form, quantity: Number(form.quantity) || 1, ...image }
      if (!data.imageUrl) data.imageSig = null
      await onSave(data)
    } catch (err) {
      setError(`Impossible d’enregistrer cette pièce. ${err.message}`)
      setSaving(false)
    }
  }

  async function handleSame(match) {
    setSaving(true)
    setError(null)
    try {
      // La pièce existante récupère la photo si elle n'en avait pas.
      const image = match.imageUrl ? {} : await uploadIfNeeded()
      await onSame(match, image)
    } catch (err) {
      setError(`Impossible de mettre à jour « ${match.name} ». ${err.message}`)
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

  const preview = photo?.previewUrl || form.imageUrl || null
  const matches = check?.matches ?? []

  return (
    <Modal title={item ? 'Modifier la pièce' : 'Ajouter une pièce'} onClose={onClose} onSubmit={handleSubmit}>
      <PhotoField src={preview} busy={photoBusy} onFile={handlePhoto} onRemove={removePhoto} />

      <div ref={panelRef} aria-live="polite">
        {check && (matches.length > 0 ? (
          <DuplicatePanel
            matches={matches}
            collections={collections}
            busy={saving}
            onSame={handleSame}
            onDismiss={() => setCheck({ matches: [], dismissed: true })}
          />
        ) : !check.dismissed && <NoDuplicate />)}
      </div>

      <div className="form-grid">
        <label className="span-2">
          Nom *
          <input value={form.name} onChange={set('name')} required autoFocus={!!item} placeholder="ex. Robot rouge" />
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
          Notes
          <textarea rows="3" value={form.notes} onChange={set('notes')} />
        </label>
        {!photo && (
          <details className="span-2 url-field" open={!!form.imageUrl && !form.imageUrl.startsWith('/uploads/')}>
            <summary>Ou utiliser une adresse d’image</summary>
            <label>
              <span className="sr-only">Adresse de l’image</span>
              <input type="url" value={form.imageUrl.startsWith('/uploads/') ? '' : form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
            </label>
          </details>
        )}
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
        <button type="submit" className="btn btn-primary" disabled={saving || !!photoBusy}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </footer>
    </Modal>
  )
}
