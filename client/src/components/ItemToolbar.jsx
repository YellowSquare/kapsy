import { ArrowDownUp, Search, SlidersHorizontal } from 'lucide-react'
import { SORT_LABELS } from '../labels'

export default function ItemToolbar({ q, setQ, status, setStatus, sort, setSort, showStatus = true }) {
  return (
    <div className="toolbar">
      <label className="search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Rechercher</span>
        <input type="search" placeholder="Nom, série, numéro…" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      {showStatus && (
        <label className="select-icon">
          <SlidersHorizontal size={18} aria-hidden="true" />
          <span className="sr-only">Filtrer par statut</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="possede">Possédés</option>
            <option value="recherche">Souhaités</option>
          </select>
        </label>
      )}
      <label className="select-icon">
        <ArrowDownUp size={18} aria-hidden="true" />
        <span className="sr-only">Trier</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {Object.entries(SORT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
    </div>
  )
}
