/* eslint-disable react/no-unknown-property */
import { Box, Center, Plane, Text3D } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { MathUtils, Vector3 } from 'three'

import type {
  PongSimulation,
  PongSimulationFrameEvent,
} from '../../parsers/parseSimulation'
import type { HeaderEvent } from '../../types/simulation'
import { Ball } from '../Ball/Ball'
import type { PlayerID } from '../Player/Player'
import { Player } from '../Player/Player'
import type { BrainsData } from '../Pong/Pong'

type BallState = {
  position: Vector3
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
  [k in PlayerID]: { position: Vector3; endurance: number }
} & {
  currentFrame: number
  ball: BallState
  paddleHit: 'paddle_l' | 'paddle_r' | null
}

const initialFrameState: FrameState = {
  currentFrame: 0,
  ball: { position: new Vector3() },
  paddle_l: { position: new Vector3(1, 0, 0.5), endurance: 1.0 },
  paddle_r: { position: new Vector3(-1, 0, 0.5), endurance: 1.0 },
  paddleHit: null,
}

// const fieldHeight = 20
export const FIELD_SIZE = 50

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
  // const [currentScore, setcurrentScore] = useState<string>(false)
  // const { mixer } = useAnimations([])

  const fieldWidth = simulationData.header.game.width * FIELD_SIZE
  const fieldHeight = simulationData.header.game.height * FIELD_SIZE
  const getGameCoordinate = (p: { x: number; y: number }): Vector3 => {
    return new Vector3(
      MathUtils.mapLinear(p.x, 0, 1, -fieldWidth / 2, fieldWidth / 2),
      0,
      MathUtils.mapLinear(p.y, 0, 1, -fieldHeight / 2, fieldHeight / 2),
    )
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

  useFrame(() => {
    const currentTurn = simulationData.turns[gameState.current.currentTurnIndex]
    const frameEvents = currentTurn?.frames || []
    const maxFrame = frameEvents.length - 1

    const targetFrame =
      gameState.current.currentFrameIndex + gameState.current.timeScale //Math.min(maxFrame, Math.floor(mixer.time * FPS))
    gameState.current.currentFrameIndex = targetFrame
    const nextFrameEvent = frameEvents[targetFrame]

    if (!currentTurn) return
    if (!nextFrameEvent) return

    gameState.current.frameState.paddleHit = nextFrameEvent.paddleHit

    processFrameEvent(nextFrameEvent)
    // end of turn
    if (maxFrame === targetFrame && !showingGoal) {
      const whoScored = currentTurn.end.result
      switch (whoScored) {
        case 'left':
          gameState.current.score.playerA++
          break
        case 'right':
          gameState.current.score.playerB++
          break

        default:
          // draw, we don't do anything?
          break
      }
      setShowingGoal(true)
    }
  })

  const processFrameEvent = (frameEvent: PongSimulationFrameEvent) => {
    // const ballGroup = ball.current
    // if (!ballGroup) return

    gameState.current.frameState.ball.position.copy(
      getGameCoordinate(frameEvent.ball.position),
    )
    //  left player
    gameState.current.frameState.paddle_l.position.copy(
      getGameCoordinate(frameEvent.paddle_l.position),
    )

    gameState.current.frameState.paddle_l.endurance =
      frameEvent.paddle_l.endurance

    //  right player
    gameState.current.frameState.paddle_r.position.copy(
      getGameCoordinate(frameEvent.paddle_r.position),
    )

    gameState.current.frameState.paddle_r.endurance =
      frameEvent.paddle_r.endurance
  }
  const wallSize = 5
  const wallDepth = 25
  const boxColor = '#1A1A1A'
  // https://github.com/pmndrs/drei#text3d
  const fontPath = '/fonts/Minecraft_Medium.json'

  const material = () => <meshStandardMaterial color={boxColor} />

  const totalFieldWidth = fieldWidth + wallSize * 2
  const totalFieldHeight = fieldHeight

  return (
    <group>
      {showingGoal && (
        <>
          <Center position={[0, 10, 0]}>
            <Text3D
              size={6}
              font={fontPath}
              rotation={[Math.PI / -2, 0, 0]}
              height={5}
              letterSpacing={1.6}
            >
              SCORE!
              <meshStandardMaterial color="white" />
            </Text3D>
          </Center>
        </>
      )}

      {/* top of field */}
      <Box
        castShadow
        receiveShadow
        args={[totalFieldWidth, wallDepth, wallSize]}
        position={[0, 0, -(fieldHeight + wallSize) / 2]}
      >
        {material()}
      </Box>
      {/* left of field */}
      <Box
        args={[wallSize, wallDepth, totalFieldHeight]}
        position={[-(totalFieldWidth - wallSize) / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        {material()}
      </Box>
      <group position={[0, wallDepth * 0.3, 0]}>
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
      </group>

      {/* score */}
      <group visible={!showingGoal} position={[0, 2, 0]}>
        <Center position={[-fieldWidth / 4, -wallDepth / 2, 0]}>
          <Text3D
            letterSpacing={-0.06}
            size={7}
            font={fontPath}
            rotation={[Math.PI / -2, 0, 0]}
            height={2}
          >
            {gameState.current.score.playerA}

            <meshStandardMaterial color="white" />
          </Text3D>
        </Center>
        <Center position={[fieldWidth / 4, -wallDepth / 2, 0]}>
          <Text3D
            letterSpacing={-0.06}
            size={7}
            font={fontPath}
            rotation={[Math.PI / -2, 0, 0]}
            height={2}
          >
            {gameState.current.score.playerB}
            <meshStandardMaterial color="white" />
          </Text3D>
        </Center>
      </group>
      {/* floor */}
      <Plane
        args={[fieldWidth, fieldHeight]}
        rotation={[Math.PI / 2, Math.PI / 1, 0]}
        position={[0, -wallDepth / 2, 0]}
        castShadow
        receiveShadow
      >
        {material()}
      </Plane>
      {/* right of field */}
      <Box
        args={[wallSize, wallDepth, totalFieldHeight]}
        position={[(totalFieldWidth - wallSize) / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        {material()}
      </Box>
      {/* bottom of field */}
      <Box
        args={[totalFieldWidth, wallDepth, wallSize]}
        position={[0, 0, (fieldHeight + wallSize) / 2]}
        castShadow
        receiveShadow
      >
        {material()}
      </Box>
    </group>
  )
}
