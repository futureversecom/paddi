import type {
  BallCollisionEvent,
  FooterEvent,
  HeaderEvent,
  PaddleFrameEvent,
  PaddleFrameState,
  SimulationEvents,
  TurnEndEvent,
  TurnStartEvent,
  Vec2D,
} from '../types/simulation'
import { interpolate } from '../utils/math'

export type PongFrameEventType =
  | { type: PaddleFrameEvent['event_type'] }
  | {
      type: BallCollisionEvent['event_type']
      collisionType: BallCollisionEvent['collision_type']
      position: Vec2D
    }

export type PongSimulationFrameEvent = {
  frameIndex: number
  ball: { position: Vec2D }
  paddle_l: PaddleFrameState
  paddle_r: PaddleFrameState
  paddleHit: 'paddle_l' | 'paddle_r' | null
}

export type PongTurn = {
  start: TurnStartEvent
  end: TurnEndEvent
  frames: PongSimulationFrameEvent[]
}

export type PongSimulation = {
  header: HeaderEvent
  footer: FooterEvent
  turns: PongTurn[]
}

const ballStartPos: Vec2D = { x: 0.5, y: 0.5 }

type FrameStateAccumulator = {
  paddle_l: PaddleFrameState
  paddle_r: PaddleFrameState
}

type LastBallCollisionPos = { frame_index: number; position: Vec2D }
type FrameAccumulator = {
  completeFrames: PongSimulationFrameEvent[]
  paddleFrames: Record<number, FrameStateAccumulator>
  lastBallCollision: LastBallCollisionPos
}
type CurrentTurn = { start: TurnStartEvent; frameAcc: FrameAccumulator }
type TurnAccumulator = {
  current: CurrentTurn | null
  turns: PongTurn[]
}

export const parseSimulationV001 = (
  simulation: SimulationEvents,
): PongSimulation => {
  //  For simplicity we are doing a FPS based integration but look at
  //  https://threejs.org/docs/#manual/en/introduction/Animation-system for timebased

  const header = simulation[0]
  const footer = simulation[simulation.length - 1]

  if (
    header?.event_type !== 'HeaderEvent' ||
    footer?.event_type !== 'FooterEvent'
  )
    throw Error('missing header or footer in simulation data')

  // split data into turns
  const turns = simulation.reduce<TurnAccumulator>(
    (acc, event) => {
      switch (event.event_type) {
        case 'TurnStartEvent': {
          if (acc.current) {
            throw new Error('TurnStartEvent without ending the pervious turn')
          }

          return {
            current: {
              start: event,
              frameAcc: {
                completeFrames: [],
                paddleFrames: {},
                lastBallCollision: { frame_index: 0, position: ballStartPos },
              },
            },
            turns: acc.turns,
          }
        }

        case 'TurnEndEvent': {
          if (!acc.current) {
            throw new Error('TurnEndEvent without starting a turn')
          }

          return {
            current: null,
            turns: [
              ...acc.turns,
              {
                start: acc.current.start,
                frames: acc.current.frameAcc.completeFrames,
                end: event,
              },
            ],
          }
        }

        case 'PaddleFrameEvent': {
          if (!acc.current) {
            throw new Error('PaddleFrameEvent without starting a turn')
          }

          const simulationEvent: FrameStateAccumulator = {
            paddle_l: event.paddle_l,
            paddle_r: event.paddle_r,
          }

          return {
            current: {
              start: acc.current.start,
              frameAcc: {
                ...acc.current.frameAcc,
                paddleFrames: {
                  ...acc.current.frameAcc.paddleFrames,
                  [event.frame_index]: simulationEvent,
                },
              },
            },
            turns: acc.turns,
          }
        }

        case 'BallCollisionEvent': {
          if (!acc.current) {
            throw new Error('BallCollisionEvent without starting a turn')
          }

          // interpolate events between the last ball collision and this one
          const frameAcc = acc.current.frameAcc
          const lastBallCollision = frameAcc.lastBallCollision ?? {
            frame_index: 0,
            position: ballStartPos,
          }
          const totalFrames = event.frame_index - lastBallCollision.frame_index
          const interpolated = Array.from(
            { length: totalFrames + 1 },
            (_, i): PongSimulationFrameEvent => {
              const pct = i / totalFrames
              const interpolatedPoint = interpolate(
                lastBallCollision.position,
                event.position,
                pct,
              )
              const frameIndex = lastBallCollision.frame_index + i
              const paddleFrame = frameAcc.paddleFrames[frameIndex]

              if (!paddleFrame) {
                // Paddle frames appear before ball collision events
                throw new Error(
                  `Missing paddle frame for frame index ${frameIndex} on turn ${acc.current?.start.turn_index}`,
                )
              }

              const paddleCollisionTypes = ['paddle_l', 'paddle_r'] as const
              const paddleHit =
                frameIndex === event.frame_index
                  ? paddleCollisionTypes.filter(
                      e => e == event.collision_type,
                    )[0] ?? null
                  : null

              return {
                frameIndex,
                ball: { position: interpolatedPoint },
                paddleHit: paddleHit,
                paddle_l: paddleFrame.paddle_l,
                paddle_r: paddleFrame.paddle_r,
              }
            },
          )

          return {
            current: {
              start: acc.current.start,
              frameAcc: {
                completeFrames: [
                  ...acc.current.frameAcc.completeFrames,
                  ...interpolated,
                ],
                lastBallCollision: event,
                paddleFrames: frameAcc.paddleFrames,
              },
            },
            turns: acc.turns,
          }
        }

        default:
          return acc
      }
    },
    { current: null, turns: [] },
  )

  return {
    header: {
      ...header,
      game: {
        ...header.game,
        height: 1,
        // normalise
        width: header.game.width / header.game.height,
        paddle_l: {
          ...header.game.paddle_l,
          // normalise
          width: header.game.paddle_l.width / header.game.height,
        },
        paddle_r: {
          ...header.game.paddle_r,
          // normalise
          width: header.game.paddle_r.width / header.game.height,
        },
      },
    },
    footer,
    turns: turns.turns,
  }
}
