/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas, extend } from '@react-three/fiber'
import { degToRad } from 'three/src/math/MathUtils'
import { UnrealBloomPass } from 'three-stdlib'

import { useFetchJSONL } from '../../hooks/useFetchJSONL'
import { parseSimulationV001 } from '../../parsers/parseSimulation'
import type { SimulationEvents } from '../../types/simulation'
import type { PlayerID } from '../Player/Player'
import { ThreeD } from '../ThreeD/ThreeD'

extend({ UnrealBloomPass })
// import { useFetch } from 'usehooks-ts'

export type BrainData = { color: string | number; name: string | undefined }
export type BrainsData = { [key in PlayerID]: BrainData }

type Props = {
  path: string
  brainsData: BrainsData
}

const Pong = ({ path, brainsData }: Props) => {
  const data = useFetchJSONL<SimulationEvents>(path)
  if (!data) return <p>LOADING</p>
  const parsedData = parseSimulationV001(data)

  return (
    <Canvas shadows gl={{ antialias: false }}>
      <ambientLight intensity={0.4} color={'0xffffff'} />
      <hemisphereLight intensity={1} color="#ffffff" groundColor="red" />
      <directionalLight
        castShadow
        intensity={0.82}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        position={[0, 50, 0]}
      />
      <pointLight color={'0xffffff'} position={[0, 40, 0]} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        // Up Down
        maxPolarAngle={degToRad(45)}
        // minPolarAngle={degToRad(-25)}
        //left right
        maxAzimuthAngle={degToRad(45)}
        minAzimuthAngle={degToRad(-45)}
        enableRotate
      />
      <OrthographicCamera makeDefault position={[0, 60, 10]} zoom={5} />
      <ThreeD simulationData={parsedData} brainsData={brainsData} />
    </Canvas>
  )
}

export default Pong
