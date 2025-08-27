import { api } from '@/lib/ky'
import { createFileRoute } from '@tanstack/react-router'

interface MyWallet {
  total_balance: number,
  balance: number,
  locked_balance: number,
}

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: async () => {
    const result = await api.get<MyWallet>('wallets/me').json()
    console.log(result)

    return { wallet: result }
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const { wallet } = Route.useLoaderData()
  const today = new Date()

  return (
    <div className="flex flex-col max-w-5xl mx-auto pt-12 gap-12 lg:px-0 px-4">
      <div>
        <h1 className="text-2xl">Welcome, {session.user.name}</h1>
        <p className="text-neutral-500 text-lg">
          {today.toLocaleDateString('en-US')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Balance:</h2>
        <div className="flex flex-col gap-2">
          <p className="text-6xl font-semibold">
            <span className='font-normal text-4xl mr-1'>$</span>{(Math.round(wallet.total_balance + (wallet.balance - wallet.locked_balance)) / 100).toFixed(2)}
          </p>
          {/* 
          <div className="flex flex-row items-center text-green-500 gap-2">
            <TablerArrowUpRight className="h-8 w-8" />
            <p className="text-2xl">+12%</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}
