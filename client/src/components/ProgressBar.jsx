// §8.5 : affichée uniquement si le total visé est connu, avec la valeur en texte.
export default function ProgressBar({ owned, target }) {
  if (!target) return null
  const pct = Math.min(100, Math.round((owned / target) * 100))
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(owned, target)}
        aria-label="Progression de la collection"
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{pct} % complétée</span>
    </div>
  )
}
