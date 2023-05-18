import { Container } from '@mui/material'
import { useLocation } from 'react-router-dom'
import Pong from 'replay-component/src/components/Pong/Pong'

export const Replay = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const path = searchParams.get('replay_path')

  const brainsData = {
    paddle_l: { color: 'green', name: 'Player' },
    paddle_r: { color: 'purple', name: 'Opponent' },
  }

  return (
    <Container maxWidth={false} sx={{ width: 1, height: 'calc(100vh - 56px)' }}>
      <Pong path={path ?? 'events.jsonl'} brainsData={brainsData} />
    </Container>
  )
}
