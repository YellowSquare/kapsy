import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from './api'
import ItemForm from './components/ItemForm'
import CollectionForm from './components/CollectionForm'
import Toast from './components/Toast'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [collections, setCollections] = useState(null)
  const [version, setVersion] = useState(0) // incrémenté à chaque modification → les pages rechargent
  const [itemDraft, setItemDraft] = useState(null) // { item?, collectionId?, onDone? }
  const [collectionDraft, setCollectionDraft] = useState(null) // { collection?, onDone? }
  const [toast, setToast] = useState(null)
  const [loadError, setLoadError] = useState(null)

  const changed = useCallback(() => setVersion((v) => v + 1), [])
  const clearToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    api.listCollections()
      .then((list) => { setCollections(list); setLoadError(null) })
      .catch(() => setLoadError('Impossible de charger tes collections. Réessaie dans un instant.'))
  }, [version])

  const openItemForm = useCallback((draft = {}) => setItemDraft(draft), [])
  const openCollectionForm = useCallback((draft = {}) => setCollectionDraft(draft), [])

  // « Ajouter une pièce » sans collection → on commence par en créer une.
  const addPiece = useCallback((collectionId) => {
    if (collections && collections.length === 0) {
      setCollectionDraft({ thenAddPiece: true })
    } else {
      setItemDraft({ collectionId })
    }
  }, [collections])

  async function saveItem(data) {
    const editing = itemDraft.item
    if (editing) await api.updateItem(editing.id, data)
    else await api.createItem(data)
    setItemDraft(null)
    setToast(editing ? 'Modifications enregistrées.' : 'C’est ajouté à ta collection !')
    changed()
  }

  async function deleteItem(item) {
    await api.deleteItem(item.id)
    setItemDraft(null)
    setToast('Pièce supprimée.')
    changed()
  }

  async function toggleStatus(item) {
    const next = item.status === 'possede' ? 'recherche' : 'possede'
    await api.updateItem(item.id, { status: next })
    setToast(next === 'possede' ? 'Une nouvelle pièce dans ta collection !' : 'Ajouté à tes souhaits.')
    changed()
  }

  async function saveCollection(data) {
    const { collection, thenAddPiece, onSaved } = collectionDraft
    const saved = collection
      ? await api.updateCollection(collection.id, data)
      : await api.createCollection(data)
    setCollectionDraft(null)
    setToast(collection ? 'Collection mise à jour.' : 'Ta collection est créée !')
    changed()
    onSaved?.(saved)
    if (thenAddPiece) setItemDraft({ collectionId: saved.id })
  }

  const value = {
    collections, version, loadError, changed, addPiece, openItemForm, openCollectionForm,
    toggleStatus, notify: setToast,
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      {itemDraft && (
        <ItemForm
          item={itemDraft.item}
          collections={collections ?? []}
          defaultCollectionId={itemDraft.collectionId}
          onSave={saveItem}
          onDelete={deleteItem}
          onClose={() => setItemDraft(null)}
        />
      )}
      {collectionDraft && (
        <CollectionForm
          collection={collectionDraft.collection}
          intro={collectionDraft.thenAddPiece ? 'Pour ranger ta première pièce, commence par créer une collection.' : null}
          onSave={saveCollection}
          onClose={() => setCollectionDraft(null)}
        />
      )}
      <Toast message={toast} onDone={clearToast} />
    </Ctx.Provider>
  )
}
