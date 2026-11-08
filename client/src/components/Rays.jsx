// Petits rayons moutarde du logo : ponctuation occasionnelle (§5.4).
export default function Rays({ className = '' }) {
  return (
    <svg className={`rays ${className}`} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M8 4 L11 15" />
        <path d="M28 8 L21 18" />
        <path d="M36 26 L24 28" />
      </g>
    </svg>
  )
}
