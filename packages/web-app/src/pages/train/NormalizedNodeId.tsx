import React from 'react'
import { useMemoryTreesOfBrain } from 'src/hooks/contracts/useMemoryTreeContract'

type Props = {
  brainId: number
  nodeId: number
}

export const NormalizedNodeId: React.FC<Props> = ({ brainId, nodeId }) => {
  const { data } = useMemoryTreesOfBrain(brainId)
  if (!data) return null

  return <span>{data.normalizeId[nodeId]}</span>
}
