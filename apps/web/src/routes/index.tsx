import LimitedNavbar from '@/components/LimitedNavbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const router = useRouter()

  const trendingCourses = [
    { name: 'MAC2311 - Calc I' },
    { name: 'CHM2045 - Gen Chem I' },
    { name: 'ECO2013 - Macro Econ' },
    { name: 'PHY2053 - Physics I' },
  ]

  return (
    <>
      <LimitedNavbar />
      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 md:px-0 px-6 md:py-28 py-24 max-w-6xl mx-auto">
        {/* Left side: Text content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          <Badge className="bg-green-600/10 dark:bg-green-600/20 hover:bg-green-600/10 text-green-500 border-green-600/60 shadow-none rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2" />
            GatorMarket is now live!
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Predict and bet on exam score averages at UF
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Join fellow gators on UF&apos;s first exam prediction market. Put
            your perception skills to the test, build your portfolio, and climb
            the leaderboard.
          </p>
          <Button
            onClick={() => router.navigate({ to: '/account' })}
            size="lg"
            className="hover:cursor-pointer"
          >
            Get Started
          </Button>
        </div>

        {/* Right side: Image placeholder */}
        <div className="w-full max-w-6xl flex flex-row justify-center">
          <img
            src="/homescreen-animation.gif"
            alt="Gator Market Illustration"
            className="object-cover h-112"
          />
        </div>
      </main>
      {/* Trending Markets Section */}
      {/* <section className="max-w-6xl mx-auto pb-16">
        <h2 className="text-lg font-semibold mb-4">📈 Trending Markets</h2>
        <div className="flex gap-4 overflow-x-auto">
          {trendingCourses.map((course) => (
            <Card
              key={course.name}
              className="min-w-[140px] rounded-xl shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-4 text-center text-sm font-medium">
                {course.name}
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}
    </>
  )
}
