import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import type { FC } from 'react'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import type { HistogramStats } from 'src/graphql/generated/index'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const statNameMapping: Record<string, string> = {
  SurvivalTimeDistribution: 'Paddle survival per turn',
  MissedDistanceDistribution: 'Paddle distance from ball when it missed',
  EnduranceTimeDistribution: 'Endurance leftover per turn',
  ResultsDistribution: 'Score',
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
      title: {
        display: true,
        text: statNameMapping[stat.name] ?? stat.name,
        color: 'white',
        font: {
          size: 18,
        },
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

  return <Bar key={stat.name} options={options} data={data} />
}
