import { css, styled } from '@mui/material'
import type { FC } from 'react'
import type { ScenarioInput } from 'src/graphql/generated'
import { secondaryFontFamily } from 'src/styles/theme'

import { preTrainedModel } from './preTrainedModel'

const Container = styled('button')(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 260px;
    flex-direction: column;
    align-items: center;
    border-color: ${theme.palette.text.primary};
    border-style: solid;
    border-width: 4px;
    font-size: 24px;
    font-family: ${secondaryFontFamily};
    cursor: pointer;
    background: none;
    color: ${theme.palette.text.primary};
    &.disabled {
      cursor: default;
      color: grey;
      border-color: grey;
    }
  `,
)

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
    <Container onClick={onClick}>
      {scenario !== undefined ? (
        <OpponentContent scenario={scenario} />
      ) : (
        <span>
          Select <br /> Opponent
        </span>
      )}
    </Container>
  )
}
