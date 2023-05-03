/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { BrainsData } from 'replay-component/src/components/Pong/Pong'
import { useFetchJSONL } from 'replay-component/src/hooks/useFetchJSONL'
import { parseSimulationV001 } from 'replay-component/src/parsers/parseSimulation'
import type { SimulationEvents } from 'replay-component/src/types/simulation'

import { Replay } from '../Replay/Replay'

type Props = {
  path: string
  brainsData: BrainsData
}

const Pong2D = ({ path, brainsData }: Props) => {
  const data = useFetchJSONL<SimulationEvents>(path)
  if (!data) return <p>LOADING</p>
  const parsedData = parseSimulationV001(data)

  return (
    <div style={{ margin: '10px' }}>
      <Replay brainsData={brainsData} simulationData={parsedData} />
    </div>
  )
}

export default Pong2D
