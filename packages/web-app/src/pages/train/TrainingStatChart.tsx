import { Tooltip, Typography } from '@mui/material'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  // Tooltip,
} from 'chart.js'
import type { FC } from 'react'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import type { HistogramStats } from 'src/graphql/generated/index'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend)

const statData: Record<string, { title: string; tooltip: string }> = {
  SurvivalTimeDistribution: {
    title: 'Paddle survival per turn',
    tooltip:
      'Shows the duration (in seconds) for each rally or turn. The longer the rallies, the more the chart is skewed to the right. More training could improve the paddle’s ability to hit the ball resulting in longer rallies.',
  },
  MissedDistanceDistribution: {
    title: 'Paddle distance from ball when it missed',
    tooltip:
      'Shows the distance of the paddle from the ball when the opponent scores (ie, your paddle misses). Ideally, the chart is left skewed or leaning. Indicating the paddle just narrowly missed the ball.',
  },
  EnduranceTimeDistribution: {
    title: 'Endurance leftover per turn',
    tooltip:
      'Endurance allows the paddle to move. When its out it can’t move to the ball as quickly. This chart shows how well did it save up its endurance for each rally.',
  },
}

const getOptions = (stat: HistogramStats) => {
  return {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: stat.yAxis,
        },
      },
      x: {
        title: {
          display: true,
          text: stat.xAxis,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }
}

const getData = (stat: HistogramStats) => {
  return {
    labels: stat.categories,
    datasets: [
      {
        data: stat.data,
        backgroundColor: 'white',
      },
    ],
  }
}

type Props = { stat: HistogramStats }

export const TrainingStatChart: FC<Props> = ({ stat }) => {
  const { options, data } = useMemo(
    () => ({
      options: getOptions(stat),
      data: getData(stat),
    }),
    [stat],
  )

  return (
    <div>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        <span>{statData[stat.name]?.title ?? stat.name}</span>
        <span>&nbsp;</span>
        <Tooltip title={statData[stat.name]?.tooltip ?? stat.name}>
          <span className="material-symbols-outlined">help</span>
        </Tooltip>
      </Typography>
      <Bar key={stat.name} options={options} data={data} />
    </div>
  )
}
