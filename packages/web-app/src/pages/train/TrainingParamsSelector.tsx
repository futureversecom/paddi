import {
  Box,
  Button,
  css,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  styled,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import { SelectWithRange } from 'src/components/common/SelectWithRange'
import { reportEvent } from 'src/utils/ga'
import { humanCamel } from 'src/utils/humanCamel'

import { StepButton } from './StepButton'

export type TrainingParams = {
  wins: number
  lose: number
  paddleHit: number
  nearMiss: number
  endurancePenalty: number
  survival: number
}
export type TrainingParamKeys = keyof TrainingParams

export const toolTipsMap: Record<string, string> = {
  wins: 'The amount of rewards given to the agent for winning rounds. This will reinforce the agent behaviour towards winning.',
  lose: 'The amount of rewards deducted from the agent for losing rounds. This will reinforce the agent behaviour to avoid losing.',
  paddleHit:
    'The amount of rewards given to the agent for hitting the ball. This will reinforce the agents behaviour towards accuracy. This input will use up endurance, using up endurance will incur a penalty.',
  nearMiss:
    'A rewards multiplier for the agent achieving a near miss. This parameter will be influenced by “near miss Exponent” and “Near miss min. distance”',
  endurancePenalty:
    'The amount of rewards given to the agent for maintaining its stamina. This will reinforce the agent behaviour to be more conservative of energy.',
  survival:
    'The amount of rewards given to the agent for sustained rounds without winning or losing. This will reinforce the agent behaviour towards survivability.',
}

type PresetTrainingParam = {
  label: string
  params: TrainingParams
}

export const PRESET_PARAMS: [PresetTrainingParam, ...PresetTrainingParam[]] = [
  {
    label: 'Movement/Positioning',
    params: {
      wins: 1,
      lose: 2,
      paddleHit: 10,
      nearMiss: 4,
      endurancePenalty: 2,
      survival: 3,
    },
  },
  {
    label: 'Defending',
    params: {
      wins: 2,
      lose: 10,
      paddleHit: 10,
      nearMiss: 0,
      endurancePenalty: 5,
      survival: 10,
    },
  },
  {
    label: 'Attacking',
    params: {
      wins: 10,
      lose: 3,
      paddleHit: 10,
      nearMiss: 2,
      endurancePenalty: 0,
      survival: 2,
    },
  },
  {
    label: 'All Rounder',
    params: {
      wins: 10,
      lose: 10,
      paddleHit: 5,
      nearMiss: 1,
      endurancePenalty: 5,
      survival: 5,
    },
  },
]

const Parent = styled('div')(
  () => css`
    position: relative;
  `,
)

type Props = {
  trainingParams: TrainingParams
  setTrainingParams: React.Dispatch<React.SetStateAction<TrainingParams>>
  presetParam: string | null
  setPresetParam: React.Dispatch<React.SetStateAction<string | null>>
}

export const TrainingParamsSelector: FC<Props> = ({
  trainingParams,
  setTrainingParams,
  presetParam,
  setPresetParam,
}) => {
  const [hasConfigured, setHasConfigured] = useState(false)
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Open Select Training Params',
    })
    setOpen(true)
  }
  const handleClose = () => setOpen(false)
  const handleConfirm = () => {
    setHasConfigured(true)
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Confirm training input',
    })
    setOpen(false)
  }

  const updateTrainingParam = (key: keyof TrainingParams, value: number) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: `Update Training Param: ${key} ${value}`,
    })
    setPresetParam(null)
    setTrainingParams(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePresetParamChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Select Preset Training Param',
    })
    const selectValue = (event.target as HTMLInputElement).value
    const selectParams = PRESET_PARAMS.find(
      ({ label }) => label === selectValue,
    )?.params
    setPresetParam(selectValue)
    if (selectParams) {
      setTrainingParams(selectParams)
    }
  }

  return (
    <Parent>
      <StepButton onClick={handleOpen} $selected={hasConfigured}>
        <Typography mb={2}>Step 2</Typography>
        <span>Training Parameters</span>
      </StepButton>

      <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ px: 4 }}>
        <DialogContent>
          <Box component={'div'} sx={{ my: 2 }}>
            Reinforcement rates alone do not ensure performance improvements. A
            holistic approach is necessary for optimal training parameter
            selection. Your agent will optimize to accumulate the amount of
            rewards for each training session.
          </Box>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <RadioGroup
              row
              value={presetParam}
              onChange={handlePresetParamChange}
            >
              <Grid container columnSpacing={3}>
                {PRESET_PARAMS.map(({ label }) => {
                  return (
                    <Grid item xs={6} key={label}>
                      <FormControlLabel
                        value={label}
                        control={<Radio />}
                        label={label}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </RadioGroup>
          </FormControl>
          <Grid container spacing={3}>
            {Object.keys(trainingParams).map(key => (
              <Grid key={key} item xs={6}>
                <SelectWithRange
                  tooltip={toolTipsMap[key]}
                  label={humanCamel(key)}
                  invertDisplayValue={
                    key === 'lose' || key === 'endurancePenalty'
                  }
                  min={0}
                  max={10}
                  value={trainingParams[key as TrainingParamKeys]}
                  onChange={e =>
                    updateTrainingParam(
                      key as TrainingParamKeys,
                      +e.target.value,
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={handleConfirm}
            fullWidth
            sx={{ mt: 4, mb: 1 }}
          >
            CONFIRM TRAINING INPUTS
          </Button>
        </DialogContent>
      </Dialog>
    </Parent>
  )
}
