import {
  css,
  Dialog,
  DialogContent,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import type { AgentType, ScenarioInput } from 'src/graphql/generated'
import { reportEvent } from 'src/utils/ga'

import { Opponent } from './Opponent'
import { OpponentButton } from './OpponentButton'
import { preTrainedModel } from './preTrainedModel'

const OpponentDialog = styled(Dialog)(
  () => css`
    & .MuiPaper-root {
      max-width: min-content;
    }
  `,
)

type Props = {
  scenario?: ScenarioInput
  setScenario: (scenario: ScenarioInput) => void
}

export const OpponentSelector: FC<Props> = ({ scenario, setScenario }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Open Select Opponent',
    })
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleSelectOpponent = (agentType: AgentType) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: `Select Opponent ${agentType}`,
    })
    setScenario({
      agent: {
        agentType: agentType,
      },
    })
    handleClose()
  }
  const handleSelectWall = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: `Select Opponent Wall`,
    })
    setScenario({
      wall: {},
    })
    handleClose()
  }

  return (
    <>
      <OpponentButton onClick={handleOpen} scenario={scenario} />

      <OpponentDialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant="h6">Select Training Opponents</Typography>
          <Typography component="p" sx={{ my: 2 }}>
            Each training opponent has been optimise with certain
            characteristics. Select training opponent wisely to maximise
            training effectiveness
          </Typography>
          <Stack direction="row" gap={2} sx={{ my: 4 }}>
            <Opponent name="Wall" onClick={handleSelectWall}></Opponent>
            {preTrainedModel?.map(scenario => {
              return (
                <Opponent
                  key={scenario.agentName}
                  name={scenario.agentName}
                  onClick={() => handleSelectOpponent(scenario.agentType)}
                />
              )
            })}
          </Stack>
        </DialogContent>
      </OpponentDialog>
    </>
  )
}
