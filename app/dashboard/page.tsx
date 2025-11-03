import {auth, signOut} from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import {User} from "@/lib/models/User"
import {Notification} from "@/lib/models/Notification"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Users, MessageCircle, Bell, ChevronRight, Plane, Map, Settings, LogOut, TrendingUp, Star, Globe } from "lucide-react"


export default async function Dashboard() {
    const session = await auth();

    if(!session){
        redirect("auth/signin")
    }

    await connectToDatabase()

    const user = await User.findOne({ email: session.user.email })
    const unreadNotifications = await Notification.countDocuments({
        userId: user?._id,
        read: false
    })

        // calculate random number once before render
        const matchingBuddiesCount = 12;

    const handleSignOut = async () => {
        "use server"
        await signOut({
            redirectTo: "/auth/signin"
        });
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header with Glassmorphism */}
            <header className="backdrop-blur-md bg-slate-900/40 border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Travel Buddy</h1>
                        </div>
                        <div className="flex gap-1 items-center">
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-slate-700/50 hover:text-white transition">
                                    <span className="text-sm">Profile</span>
                                </Button>
                            </Link>
                            <Link href="/trips">
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-slate-700/50 hover:text-white transition">
                                    <span className="text-sm">Trips</span>
                                </Button>
                            </Link>
                            <Link href="/messages">
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-slate-700/50 hover:text-white transition">
                                    <MessageCircle className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/notifications" className="relative">
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-slate-700/50 hover:text-white transition">
                                    <Bell className="w-4 h-4" />
                                </Button>
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </Link>
                            <Link href="/settings">
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-slate-700/50 hover:text-white transition">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </Link>
                            <form action={handleSignOut}>
                                <Button type="submit" variant="ghost" size="sm" className="text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="space-y-2 mb-8">
                        <h2 className="text-5xl font-bold text-white">Welcome back, <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.name}!</span></h2>
                        <p className="text-gray-400 text-lg">
                            {user?.destinations?.length === 0
                                ? "Let's set up your profile and find your perfect travel companion"
                                : `You have ${user?.destinations?.length} destination${user?.destinations?.length !== 1 ? 's' : ''} and ${unreadNotifications} notifications`}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="group p-6 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-400/40 transition backdrop-blur-sm hover:bg-blue-500/15">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-2">Destinations</p>
                                    <p className="text-4xl font-bold text-white">{user?.destinations?.length || 0}</p>
                                </div>
                                <MapPin className="w-12 h-12 text-blue-400/40 group-hover:text-blue-400 transition" />
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-400/40 transition backdrop-blur-sm hover:bg-purple-500/15">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-2">Matches</p>
                                    <p className="text-4xl font-bold text-white">0</p>
                                </div>
                                <Users className="w-12 h-12 text-purple-400/40 group-hover:text-purple-400 transition" />
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl bg-linear-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 hover:border-pink-400/40 transition backdrop-blur-sm hover:bg-pink-500/15">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-2">Favorites</p>
                                    <p className="text-4xl font-bold text-white">0</p>
                                </div>
                                <Star className="w-12 h-12 text-pink-400/40 group-hover:text-pink-400 transition" />
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-400/40 transition backdrop-blur-sm hover:bg-amber-500/15">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-2">Rating</p>
                                    <p className="text-4xl font-bold text-white">5.0</p>
                                </div>
                                <Star className="w-12 h-12 text-amber-400/40 group-hover:text-amber-400 transition" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left (2 cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero CTA Card */}
                        {user?.destinations?.length === 0 ? (
                            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-purple-600 p-8 border border-blue-500/30">
                                <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                                
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="max-w-2xl">
                                        <h3 className="text-4xl font-bold text-white mb-3">Complete Your Profile</h3>
                                        <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                                            Add your travel preferences, interests, and destinations to get personalized recommendations and connect with like-minded travelers.
                                        </p>
                                        <Link href="/profile">
                                            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 rounded-xl transition transform hover:scale-105">
                                                Complete Profile
                                                <ChevronRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <Plane className="w-32 h-32 text-white/20 hidden lg:block" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-teal-600 p-8 border border-emerald-500/30">
                                <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-3xl font-bold text-white">Ready to Explore?</h3>
                                        <Globe className="w-10 h-10 text-emerald-200" />
                                    </div>
                                    <p className="text-emerald-100 mb-6 text-lg">
                                        We found <span className="font-bold">{matchingBuddiesCount} matching travel buddies</span> for your upcoming trips!
                                    </p>
                                    <div className="flex gap-4 flex-wrap">
                                        <Link href="/matches">
                                            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-6 rounded-xl transition transform hover:scale-105">
                                                View Matches
                                                <ChevronRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </Link>
                                        <Link href="/trips/create">
                                            <Button className="bg-emerald-700/30 border border-emerald-300/50 text-white hover:bg-emerald-700/50 font-semibold px-8 py-6 rounded-xl transition">
                                                Create Trip
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                Quick Actions
                            </h4>
                            <div className="space-y-3">
                                <Link href="/trips/create" className="block group">
                                    <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                                                    <MapPin className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">Create a Trip</p>
                                                    <p className="text-sm text-gray-400">Plan your next adventure</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-500 group-hover:text-blue-400 transition" />
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/trips" className="block group">
                                    <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/80 transition backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                                                    <Map className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">Browse Trips</p>
                                                    <p className="text-sm text-gray-400">Explore trips from other travelers</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-500 group-hover:text-purple-400 transition" />
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/matches" className="block group">
                                    <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-pink-500/50 hover:bg-slate-800/80 transition backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                                                    <Users className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">Find Buddies</p>
                                                    <p className="text-sm text-gray-400">Connect with like-minded travelers</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-500 group-hover:text-pink-400 transition" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Featured Trips */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-4">Featured Trips</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((trip) => (
                                    <div key={trip} className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-slate-600 transition h-48">
                                        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition" />
                                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                            <div>
                                                <h5 className="text-lg font-bold text-white mb-1">Trip to Bali</h5>
                                                <p className="text-sm text-gray-400">Dec 20 - Jan 5</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-400 border-2 border-slate-900" />
                                                    ))}
                                                </div>
                                                <ChevronRight className="text-gray-500 group-hover:text-blue-400 transition" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right (1 col) */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="rounded-2xl overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 backdrop-blur-sm">
                            <div className="h-32 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600" />
                            <div className="p-6 -mt-8 relative">
                                <div className="w-20 h-20 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 border-4 border-slate-900 mb-4" />
                                <h3 className="font-bold text-white text-lg mb-4">{user?.name}</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Email</p>
                                        <p className="text-sm text-gray-300 break-all">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${user?.destinations?.length === 0 ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                                            <p className="text-sm text-gray-300 font-medium">
                                                {user?.destinations?.length === 0 ? 'Setup Pending' : 'Active & Ready'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/profile" className="w-full block">
                                    <Button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition">
                                        Edit Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="p-6 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm">
                            <div className="flex gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        <strong className="text-amber-300">Pro Tip:</strong> Complete your travel preferences for better matches and recommendations from other adventurers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="p-6 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm space-y-4">
                            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Your Stats</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Profile Completion</span>
                                    <span className="text-white font-semibold">{user?.destinations?.length ? '75%' : '40%'}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{width: `${user?.destinations?.length ? 75 : 40}%`}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}