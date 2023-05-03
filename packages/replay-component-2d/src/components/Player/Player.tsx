import type { MutableRefObject } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import type { PlayerID } from 'replay-component/src/components/Player/Player'
import type { BrainData } from 'replay-component/src/components/Pong/Pong'
import { useRequestAnimationFrame } from 'src/hooks/useRequestAnimationFrame'

import type { GameState } from '../Replay/Replay'
import { FIELD_SIZE } from '../Replay/Replay'

type Props = {
  gameState: MutableRefObject<GameState>
  id: PlayerID
  brainData: BrainData
}

export const Player = ({ gameState, id, brainData }: Props) => {
  const [isHit, setIsHit] = useState<boolean>(false)
  const moveGroupRef = useRef<HTMLDivElement>(null)
  // the paddle size is also normalised
  const paddleSize = gameState.current.config.game[id].width * FIELD_SIZE

  useEffect(() => {
    // TODO: implement a nice effect
    setTimeout(() => {
      setIsHit(false)
    }, 100)
  }, [isHit])

  useRequestAnimationFrame(() => {
    if (!moveGroupRef.current) return

    // update the position of this player
    const currentPlayerState = gameState.current.frameState[id]
    moveGroupRef.current.style.transform = `translate(${
      currentPlayerState.position.x
    }px,${Math.min(
      FIELD_SIZE - paddleSize,
      Math.max(0, currentPlayerState.position.y),
    )}px)`
    moveGroupRef.current.style.background = `${brainData.color}`

    //check if we are hit by a ball
    setIsHit(gameState.current.frameState.paddleHit === id)
  })

  const paddleStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '10px',
    height: `${paddleSize}px`,
  }
  return <div style={paddleStyle} ref={moveGroupRef} />
}
