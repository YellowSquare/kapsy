import { CircleAlert } from 'lucide-react'

export default function FormError({ children }) {
  if (!children) return null
  return (
    <p className="form-error" role="alert">
      <CircleAlert size={18} aria-hidden="true" /> {children}
    </p>
  )
}
