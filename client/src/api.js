async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.errors?.join(' ') || body.error || `Erreur ${res.status}`)
  }
  return body
}

export const api = {
  listItems: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return request(`/items${qs ? `?${qs}` : ''}`)
  },
  stats: () => request('/stats'),
  createItem: (data) => request('/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id, data) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE' }),
}
