/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unknown-property */
import { extend } from '@react-three/fiber'
import { Suspense } from 'react'
// @ts-ignore
import { RenderPixelatedPass, UnrealBloomPass } from 'three-stdlib'

import type { PongSimulation } from '../../parsers/parseSimulation'
import type { BrainsData } from '../Pong/Pong'
import { Replay } from '../Replay/Replay'
import { Rig } from '../Rig/Rig'

extend({ RenderPixelatedPass })

type Props = { simulationData: PongSimulation; brainsData: BrainsData }
extend({ UnrealBloomPass })

export const ThreeD = ({ simulationData, brainsData }: Props) => {
  return (
    <Suspense fallback={null}>
      <Rig>
        <Replay simulationData={simulationData} brainsData={brainsData} />
      </Rig>
    </Suspense>
  )
}
