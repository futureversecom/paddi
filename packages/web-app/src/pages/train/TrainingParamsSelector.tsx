import {
  Button,
  Dialog,
  DialogContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useState } from 'react'
import { SquareIcon } from 'src/assets/icons'
import { SelectWithRange } from 'src/components/common/SelectWithRange'
import { reportEvent } from 'src/utils/ga'

import { StepCard } from './StepCard'
import { getMappedTrainingKey } from './TrainingParamsViewer'

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
      endurancePenalty: 2,
      nearMiss: 4,
      survival: 3,
    },
  },
  {
    label: 'Defending',
    params: {
      wins: 2,
      lose: 10,
      paddleHit: 10,
      endurancePenalty: 5,
      nearMiss: 0,
      survival: 10,
    },
  },
  {
    label: 'Attacking',
    params: {
      wins: 10,
      lose: 3,
      paddleHit: 10,
      endurancePenalty: 0,
      nearMiss: 2,
      survival: 2,
    },
  },
  {
    label: 'All Rounder',
    params: {
      wins: 10,
      lose: 10,
      paddleHit: 5,
      endurancePenalty: 5,
      nearMiss: 1,
      survival: 5,
    },
  },
]

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
    <>
      <StepCard index={2} complete={hasConfigured} onClick={handleOpen}>
        <Typography textAlign="center" variant="body4" maxWidth={230}>
          {hasConfigured
            ? 'Training Parameters Selected'
            : 'Training Parameters'}
        </Typography>
      </StepCard>
      <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ px: 4 }}>
        <DialogContent>
          <Typography variant="h6">Select training inputs </Typography>
          <Typography mt={2} variant="body1">
            This is where you train your paddle to move, hit and win a game of
            Paddi.
            <br />
            <br />
            Select one of the AI Agent Training Focus pre-sets to guide your
            paddle towards specific behaviours.
            <br />
            <br />
            Change the Learning Parameters to reward or penalize your paddle as
            it trains.
            <br />
            <br />
            Your AI Agent will try to score the most rewards during each
            training session, but relying solely on reinforcement rates may not
            guarantee an improvement. Results will vary between each ASM Brain.
          </Typography>
          <br />
          <Typography
            mb={6}
            variant="subtitle1"
            color="secondary.main"
            fontStyle="italic"
          >
            Hint: If you&apos;re training for the first time, try selecting the
            Movement/Positioning Training Focus and put more effort into Near
            Miss instead of Paddle Hit.
          </Typography>
          <Typography mb={1} variant="body3" color="primary.dark">
            AI Agent Training Focus
          </Typography>
          <RadioGroup
            row
            value={presetParam}
            onChange={handlePresetParamChange}
          >
            <Grid mb={4} container columnSpacing={3}>
              {PRESET_PARAMS.map(({ label }) => {
                return (
                  <Grid item xs={6} key={label}>
                    <FormControlLabel
                      value={label}
                      control={<Radio color="secondary" />}
                      label={label}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </RadioGroup>
          <Typography mb={3} variant="body3" color="primary.dark">
            Learning Parameters
          </Typography>
          <Grid mb={4} container spacing={3}>
            {Object.keys(trainingParams).map(key => (
              <Grid key={key} item xs={6}>
                <SelectWithRange
                  tooltip={toolTipsMap[key]}
                  label={getMappedTrainingKey(key as TrainingParamKeys)}
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
          <Button fullWidth onClick={handleConfirm} startIcon={<SquareIcon />}>
            CONFIRM TRAINING INPUTS
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
