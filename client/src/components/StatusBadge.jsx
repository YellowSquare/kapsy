import { Check, Heart } from 'lucide-react'
import { STATUS_LABELS } from '../labels'

export default function StatusBadge({ status }) {
  const Icon = status === 'recherche' ? Heart : Check
  return (
    <span className={`badge badge-${status}`}>
      <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
