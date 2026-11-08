import { NavLink, Route, Routes, Link } from 'react-router'
import { CirclePlus, Heart, House, Layers3, Plus } from 'lucide-react'
import { useApp } from './AppContext'
import Home from './pages/Home'
import Collections from './pages/Collections'
import CollectionPage from './pages/CollectionPage'
import Wishlist from './pages/Wishlist'

const NAV = [
  { to: '/', label: 'Accueil', icon: House, end: true },
  { to: '/collections', label: 'Collections', icon: Layers3 },
  { to: '/souhaits', label: 'Souhaits', icon: Heart },
]

export default function App() {
  const { addPiece, loadError } = useApp()

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="logo" aria-label="Kapsy — accueil">
            <img src="/logo-inverse.png" alt="Kapsy" width="323" height="120" />
          </Link>
          <nav className="nav-desktop" aria-label="Navigation principale">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link">
                <Icon size={18} aria-hidden="true" /> {label}
              </NavLink>
            ))}
          </nav>
          <button className="btn btn-accent nav-add" onClick={() => addPiece()}>
            <Plus size={18} strokeWidth={2.5} aria-hidden="true" /> Ajouter une pièce
          </button>
        </div>
      </header>

      <main className="app">
        {loadError && <p className="banner-error" role="alert">{loadError}</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionPage />} />
          <Route path="/souhaits" element={<Wishlist />} />
          <Route path="*" element={
            <div className="empty">
              <h2>Cette page n’existe pas.</h2>
              <Link to="/" className="btn btn-secondary">Retour à l’accueil</Link>
            </div>
          } />
        </Routes>
      </main>

      <nav className="nav-mobile" aria-label="Navigation principale">
        {NAV.slice(0, 2).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="tab-link">
            <Icon size={22} aria-hidden="true" /> <span>{label}</span>
          </NavLink>
        ))}
        <button className="tab-link tab-add" onClick={() => addPiece()}>
          <CirclePlus size={22} aria-hidden="true" /> <span>Ajouter</span>
        </button>
        {NAV.slice(2).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="tab-link">
            <Icon size={22} aria-hidden="true" /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
