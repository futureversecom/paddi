import { Box, Grid, Typography } from '@mui/material'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { RewardConfig } from 'src/graphql/generated'

import type {
  TrainingParamKeys,
  TrainingParams,
} from './TrainingParamsSelector'

type Props = { rewardConfig: RewardConfig }

const rewardConfigToTrainingParams = (
  rewardConfig: RewardConfig,
): TrainingParams => {
  return {
    wins: rewardConfig.winRound * 10,
    lose: rewardConfig.loseRound * 10,
    paddleHit: rewardConfig.paddleHit * 10,
    nearMiss: rewardConfig.nearMissMultiplier * 10,
    endurancePenalty: rewardConfig.endurancePenaltyMultiplier * 10,
    survival: rewardConfig.survivalRewardMultiplier * 10,
  }
}

export const getMappedTrainingKey = (key: TrainingParamKeys) => {
  type MapType = { [key in TrainingParamKeys]: string }
  const map: MapType = {
    wins: 'Win',
    lose: 'Loss',
    paddleHit: 'Paddle Hit',
    nearMiss: 'Near Miss',
    endurancePenalty: 'Endurance Depletion',
    survival: 'Survival',
  }

  return map[key] || key
}

export const TrainingParamsViewer: FC<Props> = ({ rewardConfig }) => {
  const trainingParams = useMemo(
    () => rewardConfigToTrainingParams(rewardConfig),
    [rewardConfig],
  )

  return (
    <>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Learning Parameters
      </Typography>
      <Grid container>
        {Object.keys(trainingParams).map(key => {
          const num = trainingParams[key as TrainingParamKeys]
          return (
            <Grid key={key} item xs={6}>
              <Typography>
                {`${getMappedTrainingKey(key as TrainingParamKeys)}: `}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {key === 'lose' || key === 'endurancePenalty' ? -num : num}
                </Box>
              </Typography>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
