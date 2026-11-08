import { useEffect, useState } from 'react'
import { api } from './api'
import { useApp } from './AppContext'

// Charge une liste de pièces et la recharge après chaque modification.
export function useItems(params) {
  const { version } = useApp()
  const [state, setState] = useState({ items: null, error: null })
  const key = JSON.stringify(params)

  useEffect(() => {
    let alive = true
    const t = setTimeout(() => {
      api.listItems(JSON.parse(key))
        .then((items) => alive && setState({ items, error: null }))
        .catch(() => alive && setState((s) => ({ ...s, error: 'Impossible de charger les pièces. Réessaie.' })))
    }, JSON.parse(key).q ? 200 : 0)
    return () => { alive = false; clearTimeout(t) }
  }, [key, version])

  return state
}
