import { Typography } from '@mui/material'
import type { FC } from 'react'
import type { ScenarioInput } from 'src/graphql/generated'

import { preTrainedModel } from './preTrainedModel'
import { StepButton } from './StepButton'

type opponentButtonProps = {
  scenario?: ScenarioInput
  onClick: () => void
}

const OpponentContent = ({ scenario }: { scenario: ScenarioInput }) => {
  if (scenario.wall) {
    return <span>Wall Scenario</span>
  }
  const model = preTrainedModel.find(
    p => p.agentType === scenario?.agent?.agentType,
  )
  if (model) {
    return <span>Agent: {model.agentName}</span>
  }
  return null
}

export const OpponentButton: FC<opponentButtonProps> = ({
  scenario,
  onClick,
}) => {
  return (
    <StepButton onClick={onClick} $selected={scenario !== undefined}>
      <Typography mb={2}>Step 3</Typography>
      {scenario !== undefined ? (
        <OpponentContent scenario={scenario} />
      ) : (
        <span>Select Opponent</span>
      )}
    </StepButton>
  )
}
