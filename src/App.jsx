import { useState, useEffect } from 'react'
import { BINGO_ITEMS } from './data'
import './App.css'

function App() {
  const [view, setView] = useState('landing') // landing, host, player
  const [drawnIds, setDrawnIds] = useState([])
  const [lastDrawn, setLastDrawn] = useState(null)

  // Player state
  const [myCard, setMyCard] = useState([])
  const [markedIds, setMarkedIds] = useState([])
  const [hasBingo, setHasBingo] = useState(false)

  const drawNext = () => {
    const available = BINGO_ITEMS.filter(item => !drawnIds.includes(item.id))
    if (available.length === 0) return

    const randomItem = available[Math.floor(Math.random() * available.length)]
    setDrawnIds([...drawnIds, randomItem.id])
    setLastDrawn(randomItem)
  }

  const generateCard = () => {
    // Shuffle items
    const shuffled = [...BINGO_ITEMS].sort(() => 0.5 - Math.random())
    setMyCard(shuffled.slice(0, 25))
    setMarkedIds([])
    setHasBingo(false)
  }

  const toggleMark = (id) => {
    if (markedIds.includes(id)) {
      setMarkedIds(markedIds.filter(m => m !== id))
    } else {
      const newMarked = [...markedIds, id]
      setMarkedIds(newMarked)
      checkBingo(newMarked, myCard)
    }
  }

  const checkBingo = (marked, card) => {
    // Check rows, cols, diagonals
    // Grid is 5x5
    const size = 5
    let bingo = false

    // Rows
    for (let i = 0; i < size; i++) {
      if (card.slice(i * size, (i + 1) * size).every(item => marked.includes(item.id))) bingo = true
    }

    // Cols
    for (let i = 0; i < size; i++) {
      let colFull = true
      for (let j = 0; j < size; j++) {
        if (!marked.includes(card[j * size + i].id)) colFull = false
      }
      if (colFull) bingo = true
    }

    // Diagonals
    let d1 = true, d2 = true
    for (let i = 0; i < size; i++) {
      if (!marked.includes(card[i * size + i].id)) d1 = false
      if (!marked.includes(card[i * size + (size - 1 - i)].id)) d2 = false
    }
    if (d1 || d2) bingo = true

    if (bingo) setHasBingo(true)
  }

  if (view === 'landing') {
    return (
      <div className="container landing">
        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Bingo Revelación</h1>
        <div className="button-group">
          <button className="btn-primary" onClick={() => setView('host')}>
            Soy el Padrino 🕶️
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Controlar el juego</div>
          </button>
          <button className="btn-primary" style={{ background: 'white', color: 'var(--color-text)', border: '2px solid var(--color-pink)' }} onClick={() => { generateCard(); setView('player') }}>
            Soy Invitado 👶
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Jugar</div>
          </button>
        </div>
      </div>
    )
  }

  if (view === 'host') {
    return (
      <div className="container host">
        <header>
          <button onClick={() => setView('landing')} style={{ position: 'absolute', top: 20, left: 20 }}>← Volver</button>
          <h2 className="title-gradient">Panel de Control</h2>
        </header>

        <main>
          <div className="current-draw card">
            {lastDrawn ? (
              <div className="draw-animation">
                <div style={{ fontSize: '6rem' }}>{lastDrawn.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{lastDrawn.label}</div>
              </div>
            ) : (
              <div style={{ opacity: 0.5 }}>Presiona "Sacar Próximo" para comenzar</div>
            )}
          </div>

          <button className="btn-primary big-btn" onClick={drawNext} disabled={drawnIds.length === BINGO_ITEMS.length}>
            {drawnIds.length === 0 ? 'Comenzar Juego' : 'Sacar Próximo'}
          </button>

          <div className="history">
            <h3>Historial ({drawnIds.length}/25)</h3>
            <div className="history-grid">
              {drawnIds.map(id => {
                const item = BINGO_ITEMS.find(i => i.id === id)
                return (
                  <div key={id} className="history-item">
                    {item.icon}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (view === 'player') {
    return (
      <div className="container player">
        <header>
          <button onClick={() => setView('landing')} style={{ position: 'absolute', top: 10, left: 10, fontSize: '0.8rem' }}>← Salir</button>
          <h3 className="title-gradient">Mi Cartón</h3>
        </header>

        <div className={`bingo-grid ${hasBingo ? 'bingo-win' : ''}`}>
          {myCard.map(item => {
            const isMarked = markedIds.includes(item.id)
            return (
              <button
                key={item.id}
                className={`bingo-cell ${isMarked ? 'marked' : ''}`}
                onClick={() => toggleMark(item.id)}
              >
                <div className="cell-icon">{item.icon}</div>
                <div className="cell-label">{item.label}</div>
              </button>
            )
          })}
        </div>

        {hasBingo && (
          <div className="bingo-overlay">
            <div className="bingo-message">
              🎉 BINGO! 🎉
              <div style={{ fontSize: '1rem', marginTop: '1rem' }}>¡Gritalo fuerte!</div>
              <button className="btn-primary" onClick={() => setHasBingo(false)} style={{ marginTop: '20px' }}>Seguir Jugando</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default App
