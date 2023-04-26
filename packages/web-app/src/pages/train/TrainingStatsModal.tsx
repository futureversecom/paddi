import {
  Button,
  css,
  Dialog,
  DialogContent,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import type {
  EvaluationOutput,
  HistogramStats,
  RewardConfig,
} from 'src/graphql/generated/index'

import { TrainingParamsViewer } from './TrainingParamsViewer'
import { TrainingStatChart } from './TrainingStatChart'

const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '90%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '787px',
    },
  },
}))

const ScoreContainer = styled('div')(
  () =>
    css`
      flex: 1;
      padding: 10px 16px;
      border: 1px solid #4b4b4b;
    `,
)

type Props = { rewardConfig: RewardConfig; evaluation: EvaluationOutput }

export const TrainingStatsModal: FC<Props> = ({ evaluation, rewardConfig }) => {
  const { stats, evaluationId } = evaluation
  // const graphStats = stats.slice(0, -1)
  // const [scoreStats] = stats.slice(-1)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
  }

  const graphStats = stats.filter(({ name }) => name !== 'ResultsDistribution')

  const score = useMemo(() => {
    const _score: Record<string, number | undefined> = {}
    const resultsDistribution = stats.find(
      ({ name }) => name === 'ResultsDistribution',
    ) as HistogramStats | undefined
    resultsDistribution?.categories.forEach((category, i) => {
      _score[category] = resultsDistribution.data[i]
    })
    return _score
  }, [stats])

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Training Stats
      </Button>
      <ResponsiveDialog open={open} onClose={handleClose}>
        <DialogContent sx={{ py: 4, px: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {`Training Stats vs a ${evaluationId} Opponent`}
          </Typography>
          <TrainingParamsViewer rewardConfig={rewardConfig} />

          <Stack direction="row" spacing={2} sx={{ my: 4 }}>
            <ScoreContainer>
              Agent Score
              <Typography variant="subtitle1">{score['left'] ?? 0}</Typography>
            </ScoreContainer>
            <ScoreContainer>
              Opponent Score{' '}
              <Typography variant="subtitle1">{score['right'] ?? 0}</Typography>
            </ScoreContainer>
          </Stack>
          <Stack spacing={4}>
            {graphStats
              // Only show HistogramStats for now
              .filter(
                (stat): stat is HistogramStats =>
                  stat.__typename === 'HistogramStats',
              )
              .map(stat => (
                <TrainingStatChart key={stat.name} stat={stat} />
              ))}
          </Stack>
        </DialogContent>
      </ResponsiveDialog>
    </>
  )
}
