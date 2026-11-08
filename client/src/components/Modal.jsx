import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Dialogue natif : focus piégé, Échap, retour du focus au déclencheur (§8.8).
export default function Modal({ title, onClose, children, onSubmit }) {
  const ref = useRef(null)
  useEffect(() => {
    const trigger = document.activeElement
    ref.current?.showModal()
    return () => trigger?.focus?.()
  }, [])
  return (
    <dialog ref={ref} className="modal" onClose={onClose} aria-labelledby="modal-title">
      <form onSubmit={onSubmit} noValidate={false}>
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {children}
      </form>
    </dialog>
  )
}
