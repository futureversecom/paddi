import { Dialog, DialogContent, Grid, styled, Typography } from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import type { AgentType, ScenarioInput } from 'src/graphql/generated'
import { reportEvent } from 'src/utils/ga'

import { Opponent } from './Opponent'
import { OpponentButton } from './OpponentButton'
import { preTrainedModel } from './preTrainedModel'

const OpponentDialog = styled(Dialog)`
  & .MuiPaper-root {
    max-width: min-content;
  }
`

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
          <Typography variant="h6">Select training opponent</Typography>
          <Typography mt={2} mb={4} variant="body1">
            Each training opponent has been optimized with certain
            characteristics. Select your training opponent wisely to maximize
            training effectiveness.
          </Typography>
          <Grid container width={640} spacing={2}>
            <Grid item xs={6}>
              <Opponent name="Wall" onClick={handleSelectWall}></Opponent>
            </Grid>
            {preTrainedModel?.map(scenario => {
              return (
                <Grid item xs={6} key={scenario.agentName}>
                  <Opponent
                    name={scenario.agentName}
                    onClick={() => handleSelectOpponent(scenario.agentType)}
                  />
                </Grid>
              )
            })}
          </Grid>
        </DialogContent>
      </OpponentDialog>
    </>
  )
}
