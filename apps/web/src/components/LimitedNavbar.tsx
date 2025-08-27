import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu'
import { Link } from '@tanstack/react-router'
import { navigationMenuTriggerStyle } from './ui/navigation-menu'
import TablerTrendingUp from '~icons/tabler/trending-up'
import TablerWallet from '~icons/tabler/wallet'
import TablerChartBar from '~icons/tabler/chart-bar'
import { ModeToggle } from './mode-toggle'
import { authClient } from '@/lib/auth-client'
import AvatarProfile from './AvatarProfile'
import { Button } from './ui/button'
function LimitedNavbar() {
  const { data: session } = authClient.useSession()

  return (
    <>
      <NavigationMenu className="max-w-6xl lg:px-0 px-4 mx-auto flex-row justify-between items-center hidden md:flex">
        <div className="flex flex-row items-center gap-6">
          <Link to="/">
            <img className="h-8" src="/gatormarket_logo.svg" />
          </Link>
          <NavigationMenuList className="flex flex-row py-6 gap-4">
            {/* Explore Markets */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
                active={true}
              >
                <Link to="/markets">
                  <TablerTrendingUp className="h-5 w-5 mr-2" /> Explore Markets
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Portfolio */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/account">
                  <TablerWallet className="h-5 w-5 mr-2" /> Portfolio
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Leaderboard */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/leaderboard">
                  <TablerChartBar className="h-5 w-5 mr-2" /> Leaderboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Search bar */}
          </NavigationMenuList>
        </div>

        <div className="flex flex-row gap-2 justify-between items-center">
          <ModeToggle />
          {session ? (
            <AvatarProfile
              imageUrl={session.user.image}
              name={session.user.name}
            />
          ) : (
            <div className="flex flex-row gap-2">
              <Button variant="outline" className="cursor-pointer">
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                variant="default"
                className="bg-orange-600 hover:bg-orange-500 cursor-pointer"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </NavigationMenu>

      {/* Mobile top menu */}
      <div className="w-screen md:hidden flex px-4 flex-row py-3 justify-between">
        <div className="flex flex-row items-center">
          {' '}
          <Link to="/">
            <img className="h-8" src="/gatormarket_logo.svg" />
          </Link>
        </div>
        <div className="flex flex-row gap-2 justify-between items-center">
          <ModeToggle />
          {session ? (
            <AvatarProfile
              imageUrl={session.user.image}
              name={session.user.name}
            />
          ) : (
            <div className="flex flex-row gap-2">
              <Button variant="outline" className="cursor-pointer">
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                variant="default"
                className="bg-orange-600 hover:bg-orange-500 cursor-pointer"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default LimitedNavbar
