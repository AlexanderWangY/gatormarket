import { Button } from '@/components/ui/button'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const router = useRouter()

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-lg">Predict and bet on exam scores.</h1>
      <Button
        onClick={() => router.navigate({ to: '/dashboard' })}
        size="lg"
        className="hover:cursor-pointer"
      >
        Get Started
      </Button>
    </div>
  )
}
