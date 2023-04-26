/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unknown-property */
import { Box, useGLTF } from '@react-three/drei'
import { useFrame, useGraph } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'

import type { PaddleFrameEvent } from '../../types/simulation'
import type { BrainData } from '../Pong/Pong'
import type { GameState } from '../Replay/Replay'
import { FIELD_SIZE } from '../Replay/Replay'

export type PlayerID = keyof Pick<PaddleFrameEvent, 'paddle_l' | 'paddle_r'>

export function useSkinnedMeshClone(path: string) {
  const gltf = useGLTF(path)

  // @ts-ignore , the types are off
  const { scene, materials, animations } = gltf

  const clonedScene = useMemo(() => clone(scene), [scene])
  const { nodes } = useGraph(clonedScene)

  // return { scene, materials, animations, nodes };
  return { scene: clonedScene, materials, animations, nodes }
}

type Props = {
  gameState: MutableRefObject<GameState>
  id: PlayerID
  brainData: BrainData
}

export const Player = ({ gameState, id, brainData }: Props) => {
  const moveGroupRef = useRef<Group>(null)
  const innerBoxRef = useRef<Mesh>(null)
  const [isHit, setIsHit] = useState<boolean>(false)

  const size = gameState.current.config.game[id].width * FIELD_SIZE

  useEffect(() => {
    // TODO: implement a nice effect
    setTimeout(() => {
      setIsHit(false)
    }, 100)
  }, [isHit])

  useFrame(() => {
    // update the position of this player
    const currentPlayerState = gameState.current.frameState[id]
    moveGroupRef.current?.position.copy(currentPlayerState.position)

    //check if we are hit by a ball
    setIsHit(gameState.current.frameState.paddleHit === id)

    // set endurance
    innerBoxRef.current?.scale.setZ(currentPlayerState.endurance)
  })

  return (
    <group ref={moveGroupRef}>
      <Box
        castShadow
        receiveShadow
        args={[2, 2, size + 2]}
        position={[0, 0.5, 0]}
      >
        <meshStandardMaterial
          transparent
          opacity={0.1}
          color={isHit ? 'yellow' : 'white'}
        />
      </Box>
      <Box
        ref={innerBoxRef}
        castShadow
        receiveShadow
        args={[1, 1, size]}
        position={[0, 0.5, 0]}
      >
        <meshStandardMaterial color={brainData.color} />
      </Box>
    </group>
  )
}
