import './App.css'

import Pong from './components/Pong/Pong'

function App() {
  return (
    <Pong
      path="events.jsonl"
      brainsData={{
        paddle_l: { color: 'green', name: 'Player' },
        paddle_r: { color: 'purple', name: 'Opponent' },
      }}
    />
  )
  // return <Pong path="replay.json" />
}

export default App
