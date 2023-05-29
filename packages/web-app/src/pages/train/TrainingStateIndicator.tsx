import { Chip } from '@mui/material'
import type { FC } from 'react'
import { TrainingState } from 'src/graphql/generated'
type Props = {
  state: TrainingState
  completedUnits?: number | null
  totalUnits: number
  cancelTraining: () => void
}

export const TrainingStateIndicator: FC<Props> = ({
  state,
  completedUnits,
  totalUnits,
  cancelTraining,
}) => {
  switch (state) {
    case TrainingState.Pending:
      return <Chip label="Pending..." onDelete={cancelTraining} />
    case TrainingState.InProgress:
      return (
        <Chip
          label={`Training In-progress ${completedUnits ?? 0}/${totalUnits}`}
        />
      )
    case TrainingState.Completed:
      return (
        <Chip
          color="secondary"
          label={`Completed ${completedUnits ?? 0}/${totalUnits}`}
        />
      )
    case TrainingState.Canceled:
      return <Chip color="error" label="Cancelled" />
    default:
      throw new Error('TrainingStateIndicator: Uncaptured Training state')
  }
}
