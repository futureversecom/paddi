import { Chip, CircularProgress, Stack } from '@mui/material'
import type { FC } from 'react'
import { TrainingState } from 'src/graphql/generated'
type Props = {
  state: TrainingState
  completedUnits?: number | null
  totalUnits: number
  cancelTraining: () => void
}

const states = [
  TrainingState.Pending,
  TrainingState.InProgress,
  TrainingState.Completed,
]

const capitalizeFirstLetter = (input: string): string =>
  input.toLowerCase().replace(/^./, firstChar => firstChar.toUpperCase())

export const TrainingStateIndicator: FC<Props> = ({
  state: currentState,
  completedUnits,
  totalUnits,
  cancelTraining,
}) => {
  return (
    <Stack direction="row" spacing={2}>
      {states.map(state => {
        const isCurrentStatus = state === currentState
        const label =
          state === TrainingState.InProgress
            ? `Training (${completedUnits ?? 0}/${totalUnits})`
            : capitalizeFirstLetter(state)
        const isCancelableStatus = state === TrainingState.Pending
        const isCompleted = isCurrentStatus && state === TrainingState.Completed
        return (
          <Chip
            key={state}
            {...(isCancelableStatus && {
              onDelete: cancelTraining,
            })}
            label={
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <span>{label}</span>
                {isCurrentStatus && state !== TrainingState.Completed && (
                  <CircularProgress size={16} thickness={5} />
                )}
              </Stack>
            }
            disabled={!isCurrentStatus}
            {...(isCompleted && {
              color: 'success',
              sx: { color: '#fff' },
            })}
          />
        )
      })}
    </Stack>
  )
}
