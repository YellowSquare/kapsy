async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(body.errors?.join(' ') || body.error || `Erreur ${res.status}`)
    err.status = res.status
    throw err
  }
  return body
}

const qs = (params) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
  return s ? `?${s}` : ''
}
const json = (method, data) => ({ method, body: JSON.stringify(data) })

export const api = {
  stats: () => request('/stats'),
  listCollections: () => request('/collections'),
  getCollection: (id) => request(`/collections/${id}`),
  createCollection: (data) => request('/collections', json('POST', data)),
  updateCollection: (id, data) => request(`/collections/${id}`, json('PUT', data)),
  deleteCollection: (id) => request(`/collections/${id}`, { method: 'DELETE' }),
  listItems: (params = {}) => request(`/items${qs(params)}`),
  createItem: (data) => request('/items', json('POST', data)),
  updateItem: (id, data) => request(`/items/${id}`, json('PUT', data)),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE' }),
}
