import './App.css'

import Pong2D from './components/Pong2D/Pong2D'

function App() {
  return (
    <Pong2D
      path="events.jsonl"
      brainsData={{
        paddle_l: { color: 'green' },
        paddle_r: { color: 'purple' },
      }}
    />
  )
}

export default App
