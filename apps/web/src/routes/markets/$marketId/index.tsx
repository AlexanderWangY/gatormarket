import { ChartLine } from '@/components/chartExample'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/markets/$marketId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto pt-12 gap-12 lg:px-0 px-4">
      <div>
        <h1 className="text-2xl">Market 1</h1>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-2/3 h-full flex flex-col gap-2">
          <h2>Prediction Chart:</h2>
          <ChartLine />
        </div>
      </div>
    </div>
  )
}
