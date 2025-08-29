import type { MarketSnapshot } from '@/api/markets'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './ui/chart'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

interface Props {
  data: MarketSnapshot[]
}

const chartConfig = {
  yes_price_cents: {
    label: 'YES',
    color: '#22c55e', // green-500)',
  },
  no_price_cents: {
    label: 'NO',
    color: 'red',
  },
} satisfies ChartConfig

function SnapshotChart({ data }: Props) {
  const percentData = data.map((item) => ({
    created_at: item.created_at,
    yes_percent: item.yes_price_cents,
    no_percent: item.no_price_cents,
  }))

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-video">
      <LineChart
        data={percentData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="created_at"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(dateStr) => {
            const date = new Date(dateStr)
            const now = new Date()
            const isToday =
              date.getDate() === now.getDate() &&
              date.getMonth() === now.getMonth() &&
              date.getFullYear() === now.getFullYear()

            return isToday
              ? date.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
          }}
        />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent title="Helo" />}
        />
        <Line
          dataKey="yes_percent"
          name="Yes"
          type="step"
          stroke="var(--color-yes_price_cents)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="no_percent"
          name="No"
          type="step"
          stroke="var(--color-no_price_cents)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default SnapshotChart
