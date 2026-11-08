import { useEffect } from 'react'
import { CircleCheck } from 'lucide-react'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [message, onDone])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message && (
        <div className="toast">
          <CircleCheck size={18} aria-hidden="true" /> {message}
        </div>
      )}
    </div>
  )
}
