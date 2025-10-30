import {auth, signOut} from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import {User} from "@/lib/models/User"
import {Notification} from "@/lib/models/Notification"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Dashboard() {
    const session = await auth();

    if(!session){
        redirect("auth/signin")
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    const unreadNotifications = await Notification.countDocuments({
        userId: session.user.id,
        read: false
    })

    const handleSignOut = async () => {
        "use server"
        await signOut({
            redirectTo: "/auth/signin"
        });
    }

    return (
        <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Travel Buddy</h1>
            <nav className="flex gap-4 items-center">
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Link href="/trips">
                <Button variant="ghost">Trips</Button>
              </Link>
              <Link href="/matches">
                <Button variant="ghost">Matches</Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost">Messages</Button>
              </Link>
              <Link href="/notifications" className="relative">
                <Button variant="ghost">
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </Link>
              <form action={handleSignOut}>
                <Button type="submit" variant="ghost" className="text-destructive hover:bg-destructive/10">
                  Sign Out
                </Button>
              </form>
            </nav>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Welcome Card */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user?.name}!</CardTitle>
                  <CardDescription>
                    {user?.destinations?.length === 0
                      ? "Complete your profile to get started finding travel buddies"
                      : "Here are your recommended travel companions"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.destinations?.length === 0 ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        To get personalized recommendations, please complete your profile with your travel preferences.
                      </p>
                      <Link href="/profile">
                        <Button>Complete Profile</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Based on your preferences, we found some great matches for you!
                      </p>
                      <Link href="/matches">
                        <Button>View Matches</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
  
            {/* Profile Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm break-all">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Completion</p>
                    <p className="font-medium">{user?.destinations?.length === 0 ? "Incomplete" : "Complete"}</p>
                  </div>
                  <Link href="/profile" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
  
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Create a Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Plan your next adventure and find companions</p>
                <Link href="/trips/create">
                  <Button variant="outline" className="w-full bg-transparent">
                    Create Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
  
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Browse Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Explore trips created by other travelers</p>
                <Link href="/trips">
                  <Button variant="outline" className="w-full bg-transparent">
                    Browse Trips
                  </Button>
                </Link>
              </CardContent>
            </Card>
  
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Find Buddies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Discover compatible travel companions</p>
                <Link href="/matches">
                  <Button variant="outline" className="w-full bg-transparent">
                    Find Buddies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
}