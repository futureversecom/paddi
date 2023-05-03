import { useEffect, useRef, useState } from 'react'
import type { PlayerID } from 'replay-component/src/components/Player/Player'
import type { BrainsData } from 'replay-component/src/components/Pong/Pong'
import type {
  PongSimulation,
  PongSimulationFrameEvent,
} from 'replay-component/src/parsers/parseSimulation'
import type { HeaderEvent } from 'replay-component/src/types/simulation'
import { mapRange } from 'replay-component/src/utils/math'
import { useRequestAnimationFrame } from 'src/hooks/useRequestAnimationFrame'

import { Ball } from '../Ball/Ball'
import { Player } from '../Player/Player'

type Vector2 = { x: number; y: number }
type BallState = {
  position: Vector2
}

export type ScoreType = {
  playerA: number
  playerB: number
}

export type GameState = {
  currentTurnIndex: number
  currentFrameIndex: number
  score: ScoreType
  timeScale: number
  frameState: FrameState
  config: HeaderEvent
}
export type FrameState = {
  [k in PlayerID]: { position: Vector2; endurance: number }
} & {
  currentFrame: number
  ball: BallState
  paddleHit: 'paddle_l' | 'paddle_r' | null
}

const initialFrameState: FrameState = {
  currentFrame: 0,
  ball: { position: { x: 0, y: 0 } },
  paddle_l: { position: { x: 1, y: 0 }, endurance: 1.0 },
  paddle_r: { position: { x: -1, y: 0 }, endurance: 1.0 },
  paddleHit: null,
}

export const FIELD_SIZE = 450

type Props = { simulationData: PongSimulation; brainsData: BrainsData }

export const Replay = ({ simulationData, brainsData }: Props) => {
  const gameState = useRef<GameState>({
    currentTurnIndex: 1,
    currentFrameIndex: 0,
    score: { playerA: 0, playerB: 0 },
    timeScale: 1,
    frameState: initialFrameState,
    config: simulationData.header,
  })
  const [showingGoal, setShowingGoal] = useState<boolean>(false)

  useRequestAnimationFrame(() => {
    const currentTurn = simulationData.turns[gameState.current.currentTurnIndex]
    const frameEvents = currentTurn?.frames || []
    const maxFrame = frameEvents.length - 1

    const targetFrame =
      gameState.current.currentFrameIndex + gameState.current.timeScale
    gameState.current.currentFrameIndex = targetFrame
    const nextFrameEvent = frameEvents[targetFrame]

    if (!currentTurn) return
    if (!nextFrameEvent) return

    gameState.current.frameState.paddleHit = nextFrameEvent.paddleHit

    processFrameEvent(nextFrameEvent)
    // end of turn
    if (maxFrame === targetFrame) {
      const whoScored = currentTurn.end.result
      switch (whoScored) {
        case 'left':
          gameState.current.score.playerA++
          break
        case 'right':
          gameState.current.score.playerB++
          break

        default:
          break
      }
      setShowingGoal(true)
    }
  })

  // the game.width and game.height are ratio based!
  const fieldWidth = simulationData.header.game.width * FIELD_SIZE
  const fieldHeight = simulationData.header.game.height * FIELD_SIZE

  const getGameCoordinate = (p: { x: number; y: number }): Vector2 => {
    //convert from a normalised value to a field size
    return {
      x: mapRange(p.x, 0, 1, 0, fieldWidth),
      y: mapRange(p.y, 0, 1, 0, fieldHeight),
    }
  }

  const processFrameEvent = (frameEvent: PongSimulationFrameEvent) => {
    gameState.current.frameState.ball.position = getGameCoordinate(
      frameEvent.ball.position,
    )
    //  left player
    gameState.current.frameState.paddle_l.position = getGameCoordinate(
      frameEvent.paddle_l.position,
    )
    gameState.current.frameState.paddle_l.endurance =
      frameEvent.paddle_l.endurance

    //  right player
    gameState.current.frameState.paddle_r.position = getGameCoordinate(
      frameEvent.paddle_r.position,
    )
    gameState.current.frameState.paddle_r.endurance =
      frameEvent.paddle_r.endurance
  }

  useEffect(() => {
    const timeoutId = showingGoal
      ? setTimeout(() => {
          // start a new turn and reset the frameIndex as this is per turn
          gameState.current.currentTurnIndex++
          gameState.current.currentFrameIndex = 0
          setShowingGoal(false)
        }, 3000)
      : undefined

    return () => clearTimeout(timeoutId)
  }, [showingGoal])

  const fieldStyle: React.CSSProperties = {
    width: `${fieldWidth}px`,
    height: `${fieldHeight}px`,
    border: `2px solid white`,
    position: 'relative',
  }

  return (
    <div style={fieldStyle}>
      <Player
        brainData={brainsData.paddle_l}
        gameState={gameState}
        id={'paddle_l'}
      />
      <Player
        brainData={brainsData.paddle_r}
        gameState={gameState}
        id={'paddle_r'}
      />
      <Ball gameState={gameState} />
    </div>
  )
}
