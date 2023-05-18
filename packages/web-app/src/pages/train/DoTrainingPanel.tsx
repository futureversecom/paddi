import { Box, Button, Grid, Stack } from '@mui/material'
import { BigNumber, constants } from 'ethers'
import { record } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { absurd } from 'fp-ts/lib/function'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SelectWithRange } from 'src/components/common/SelectWithRange'
import { client } from 'src/graphql/client'
import type {
  ParentMemoryNodeConfig,
  ScenarioInput,
  TrainingParams as GraphQLTrainingParams,
} from 'src/graphql/generated'
import {
  usePredictTrainingCostQuery,
  useTrainingCancelMutation,
  useTrainingRequestMutation,
} from 'src/graphql/generated'
import { useRequestCompute } from 'src/hooks/contracts/useComputeRequestManagerContract'
import { reportEvent } from 'src/utils/ga'

import { ApproveASTO } from './ApproveASTO'
import { BrainSelector } from './BrainSelector'
import { OpponentSelector } from './OpponentSelector'
import type { TrainingParams } from './TrainingParamsSelector'
import { PRESET_PARAMS, TrainingParamsSelector } from './TrainingParamsSelector'

const getGraphQlTrainingParams = (
  trainingParams: TrainingParams,
  trainingRounds: number,
): GraphQLTrainingParams => {
  return {
    winRound: trainingParams.wins,
    loseRound: trainingParams.lose,
    paddleHit: trainingParams.paddleHit,
    nearMissMultiplier: trainingParams.nearMiss,
    // Hardcoded
    nearMissExponent: 4,
    // Hardcoded
    nearMissMinDistance: 5,
    survivalRewardMultiplier: trainingParams.survival,
    endurancePenaltyMultiplier: trainingParams.endurancePenalty,
    trainingRounds,
  }
}

const normalizeTrainingParams = (params: GraphQLTrainingParams) => {
  const { trainingRounds, ...paramsToNormalize } = params

  const normalizedParams = pipe(
    paramsToNormalize,
    record.map(value => value / 10),
  )

  return { ...normalizedParams, trainingRounds }
}

type props = {
  address: `0x${string}`
}

export const DoTrainingPanel: React.FC<props> = ({ address }) => {
  const navigate = useNavigate()
  const [brainId, setBrainId] = useState<number>()
  const [parentMemoryNodeConfig, setParentMemoryNodeConfig] =
    useState<ParentMemoryNodeConfig>()
  const [scenario, setScenario] = useState<ScenarioInput>()
  const [presetParam, setPresetParam] = useState<string | null>(
    PRESET_PARAMS[0].label,
  )
  const [trainingParams, setTrainingParams] = useState<TrainingParams>(
    PRESET_PARAMS[0].params,
  )
  const [trainingRounds, _setTrainingRounds] = useState(1)
  const setTrainingRounds = (round: number) => {
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: `Select training unit ${round}`,
    })
    _setTrainingRounds(round)
  }

  const { data: predictTrainingCostResult } = usePredictTrainingCostQuery(
    client,
    {
      trainingParams: getGraphQlTrainingParams(trainingParams, trainingRounds),
    },
  )
  const predictedTrainingCost = BigNumber.from(
    predictTrainingCostResult?.predictTrainingCost.astoCost || constants.Zero,
  )

  const queryClient = useQueryClient()
  const { mutateAsync: trainingRequest } = useTrainingRequestMutation(client, {
    onSuccess: () => queryClient.invalidateQueries(['myTrainings']),
  })
  const { mutateAsync: computeRequest } = useRequestCompute()
  const { mutateAsync: cancelTraining } = useTrainingCancelMutation(client)

  const [isStartTrainingProcess, setIsStartTrainingProcess] = useState(false)
  const startTraining = () => {
    if (
      brainId == undefined ||
      parentMemoryNodeConfig == undefined ||
      scenario == undefined
    ) {
      return
    }
    reportEvent('button_click', {
      page_title: 'Training',
      button_name: 'Start Training',
    })
    const sendComputeRequest = async () => {
      const result = await trainingRequest({
        input: {
          brainId,
          trainingParams: normalizeTrainingParams(
            getGraphQlTrainingParams(trainingParams, trainingRounds),
          ),
          parentMemoryNodeConfig,
          scenario,
        },
      })

      if (result.trainingRequest.__typename === 'TrainingRequestFailure') {
        return Promise.reject()
      }
      if (result.trainingRequest.__typename === 'TrainingRequestSuccess') {
        try {
          await computeRequest({
            units: trainingRounds,
            computeHash: result.trainingRequest.training.hash,
          })
        } catch (error) {
          // cancel
          cancelTraining({ hash: result.trainingRequest.training.hash })
          throw error
        }
        navigate('history')
        return
      }

      return absurd(result.trainingRequest)
    }
    setIsStartTrainingProcess(true)
    return toast
      .promise(sendComputeRequest, {
        pending: "Transaction's pending..",
        success: 'Transaction successful!',
        error: 'Transaction rejected!',
      })
      .finally(() => setIsStartTrainingProcess(false))
  }

  return (
    <>
      <Grid container spacing={2} alignItems="start">
        <Grid item xs={4}>
          <BrainSelector
            address={address}
            parentMemoryNodeConfig={parentMemoryNodeConfig}
            brainId={brainId}
            setBrain={({ id, parentMemoryNodeConfig }) => {
              setBrainId(id)
              setParentMemoryNodeConfig(parentMemoryNodeConfig)
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <TrainingParamsSelector
            trainingParams={trainingParams}
            setTrainingParams={setTrainingParams}
            presetParam={presetParam}
            setPresetParam={setPresetParam}
          />
        </Grid>
        <Grid item xs={4}>
          <OpponentSelector scenario={scenario} setScenario={setScenario} />
        </Grid>
      </Grid>

      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={10}
        marginTop={6}
      >
        <Box component={'div'} sx={{ width: 380 }}>
          <SelectWithRange
            tooltip="The amount of units the trainer wants to train. 1 training unit is 1000 rounds."
            label={'Training Units'}
            min={1}
            max={10}
            value={trainingRounds}
            onChange={e => setTrainingRounds(+e.target.value)}
            itemTextInterpolate={n => `${n} units (${n * 10} ASTO)`}
          />
        </Box>
        <ApproveASTO address={address} trainingCost={predictedTrainingCost}>
          <Button
            variant="contained"
            sx={{ minWidth: 380 }}
            disabled={
              isStartTrainingProcess ||
              brainId == undefined ||
              parentMemoryNodeConfig == undefined ||
              scenario == undefined
            }
            onClick={startTraining}
          >
            Begin Training
          </Button>
        </ApproveASTO>
      </Stack>
    </>
  )
}
