import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('chargement…')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('API injoignable'))
  }, [])

  return (
    <main>
      <h1>Kapsy</h1>
      <p>Statut de l'API : <strong>{status}</strong></p>
    </main>
  )
}

export default App
