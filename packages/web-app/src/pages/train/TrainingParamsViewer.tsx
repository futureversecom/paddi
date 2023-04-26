import { Box, Grid, Typography } from '@mui/material'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { RewardConfig } from 'src/graphql/generated'
import { humanCamel } from 'src/utils/humanCamel'

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

export const TrainingParamsViewer: FC<Props> = ({ rewardConfig }) => {
  const trainingParams = useMemo(
    () => rewardConfigToTrainingParams(rewardConfig),
    [rewardConfig],
  )

  return (
    <>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Training Input parameters
      </Typography>
      <Grid container>
        {Object.keys(trainingParams).map(key => {
          const num = trainingParams[key as TrainingParamKeys]
          return (
            <Grid key={key} item xs={6}>
              <Typography>
                {`${humanCamel(key)}: `}
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
