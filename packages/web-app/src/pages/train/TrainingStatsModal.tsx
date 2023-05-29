import {
  Button,
  css,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import type { FC, ReactElement } from 'react'
import { cloneElement, useMemo, useState } from 'react'
import { PlusIcon } from 'src/assets/icons'
import { RoundedBox } from 'src/components/common/RoundedBox'
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
    `,
)

type Props = {
  rewardConfig: RewardConfig
  evaluation: EvaluationOutput
  children?: ReactElement
}

export const TrainingStatsModal: FC<Props> = ({
  evaluation,
  rewardConfig,
  children,
}) => {
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

  const childWithProps = children
    ? cloneElement(children, { onClick: handleOpen })
    : null

  const name = evaluationId === 'AllRounder' ? 'All Rounder' : evaluationId

  return (
    <>
      {childWithProps ? (
        childWithProps
      ) : (
        <Button fullWidth size="small" variant="outlined" onClick={handleOpen}>
          Evaluation Stats
        </Button>
      )}
      <ResponsiveDialog open={open} onClose={handleClose} scroll="body">
        <DialogContent sx={{ py: 4, px: 6 }}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {`Training Stats vs a ${name} Opponent stats`}
          </Typography>
          <RoundedBox>
            <TrainingParamsViewer rewardConfig={rewardConfig} />
          </RoundedBox>

          <Stack direction="row" spacing={3} sx={{ my: 3 }}>
            <ScoreContainer>
              <RoundedBox>
                AI Agent Score
                <Typography variant="subtitle1">
                  {score['left'] ?? 0}
                </Typography>
              </RoundedBox>
            </ScoreContainer>
            <ScoreContainer>
              <RoundedBox>
                Opponent Score{' '}
                <Typography variant="subtitle1">
                  {score['right'] ?? 0}
                </Typography>
              </RoundedBox>
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
          <DialogActions sx={{ p: 4 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              startIcon={<PlusIcon />}
            >
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </ResponsiveDialog>
    </>
  )
}
