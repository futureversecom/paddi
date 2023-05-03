import type { MutableRefObject } from 'react'
import { useRef } from 'react'
import { useRequestAnimationFrame } from 'src/hooks/useRequestAnimationFrame'

import type { GameState } from '../Replay/Replay'

type ModelProps = {
  gameState: MutableRefObject<GameState>
}

export const Ball = ({ gameState }: ModelProps) => {
  const moveGroupRef = useRef<HTMLDivElement>(null)

  useRequestAnimationFrame(() => {
    if (!moveGroupRef.current) return

    // update the position of the ball
    const currentBallState = gameState.current.frameState.ball
    moveGroupRef.current.style.transform = `translate(${currentBallState.position.x}px,${currentBallState.position.y}px)`
    moveGroupRef.current.style.background = `white`
  })

  const paddleStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '10px',
    height: `10px`,
  }
  return <div style={paddleStyle} ref={moveGroupRef} />
}
