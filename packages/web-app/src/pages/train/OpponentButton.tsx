import { Typography } from '@mui/material'
import type { FC } from 'react'
import type { ScenarioInput } from 'src/graphql/generated'

import { preTrainedModel } from './preTrainedModel'
import { StepCard } from './StepCard'

type opponentButtonProps = {
  scenario?: ScenarioInput
  onClick: () => void
}

const OpponentContent = ({ scenario }: { scenario: ScenarioInput }) => {
  if (scenario.wall) {
    return <Typography variant="body4">Agent: Wall</Typography>
  }
  const model = preTrainedModel.find(
    p => p.agentType === scenario?.agent?.agentType,
  )

  if (model) {
    const name =
      model.agentName === 'AllRounder' ? 'All Rounder' : model.agentName

    return <Typography variant="body4">Agent: {name}</Typography>
  }
  return null
}

export const OpponentButton: FC<opponentButtonProps> = ({
  scenario,
  onClick,
}) => {
  return (
    <StepCard index={3} complete={scenario !== undefined} onClick={onClick}>
      {scenario !== undefined ? (
        <OpponentContent scenario={scenario} />
      ) : (
        <Typography variant="body4">Training Opponent</Typography>
      )}
    </StepCard>
  )
}
