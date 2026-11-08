import { useRef } from 'react'
import { Camera, ImagePlus, Trash2 } from 'lucide-react'

// Photo d'une pièce : prise de vue (mobile) ou choix d'un fichier.
export default function PhotoField({ src, busy, onFile, onRemove }) {
  const cameraRef = useRef(null)
  const fileRef = useRef(null)
  const pick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de reprendre la même photo
    if (file) onFile(file)
  }

  return (
    <div className="photo-field">
      <div className={`photo-preview${src ? '' : ' photo-empty'}`}>
        {src ? <img src={src} alt="Photo de la pièce" /> : <Camera size={36} strokeWidth={1.75} aria-hidden="true" />}
        {busy && <span className="photo-busy">{busy}</span>}
      </div>
      <div className="photo-actions">
        <button type="button" className="btn btn-primary" onClick={() => cameraRef.current.click()}>
          <Camera size={18} aria-hidden="true" /> {src ? 'Reprendre une photo' : 'Prendre une photo'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => fileRef.current.click()}>
          <ImagePlus size={18} aria-hidden="true" /> Choisir une image
        </button>
        {src && (
          <button type="button" className="btn btn-tertiary btn-tertiary-danger" onClick={onRemove}>
            <Trash2 size={16} aria-hidden="true" /> Retirer
          </button>
        )}
        <p className="help">Kapsy compare ta photo à ta collection pour repérer les doubles. Astuce : photographie la pièce seule, sur un fond uni qui contraste avec elle.</p>
      </div>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
    </div>
  )
}
