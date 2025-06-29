import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useSocket } from './hooks/useSocket'

const Home = lazy(() => import('./pages/Home'))
const Lobby = lazy(() => import('./pages/Lobby'))
const Game = lazy(() => import('./pages/Game'))

function App() {
  useSocket('ws://localhost:8080/ws')

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-center p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">Início</Link>
          <Link to="/lobby" className="text-blue-500 hover:underline">Lobby</Link>
          <Link to="/game" className="text-blue-500 hover:underline">Jogo</Link>
        </nav>

         <Suspense fallback={<p>Carregando...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
