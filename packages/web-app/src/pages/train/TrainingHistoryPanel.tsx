import { useMemo } from 'react'
import { client } from 'src/graphql/client'
import { TrainingState, useMyTrainingsQuery } from 'src/graphql/generated'

import { TrainingRecord } from './TrainingRecord'
export const TrainingHistoryPanel = () => {
  const { data, isLoading } = useMyTrainingsQuery(client, undefined, {
    staleTime: 0,
    refetchInterval: 10000, // Refetch every 10 seconds
  })
  const trainings = useMemo(() => {
    return data?.myTrainings.filter(
      training => training.recordState !== TrainingState.Canceled,
    )
  }, [data?.myTrainings])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (trainings?.length === 0) {
    return <p>Currently no training history available.</p>
  }

  return (
    <div>
      {trainings?.map(training => (
        <TrainingRecord key={training.hash} training={training} />
      ))}
    </div>
  )
}
