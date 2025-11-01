"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Users,
  Wallet,
  Calendar,
  ArrowRight,
  Search,
  Sliders,
  Star,
  Heart,
  Share2,
  Bell,
  LogOut,
} from "lucide-react"

interface Trip {
  _id: string
  destination: string
  startDate: string
  endDate: string
  budget: string
  maxCompanions: number
  companions: string[]
  description: string
  userId: {
    name: string
    _id: string
  }
}

export default function TripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchDestination, setSearchDestination] = useState("")
  const [filterBudget, setFilterBudget] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchTrips()
    }
  }, [status, router])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trip")
      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesDestination = trip.destination
      .toLowerCase()
      .includes(searchDestination.toLowerCase())
    const matchesBudget = !filterBudget || trip.budget === filterBudget
    return matchesDestination && matchesBudget
  })

  const getBudgetGradient = (budget: string) => {
    const gradients = {
      budget: "from-blue-500 via-blue-600 to-blue-700",
      moderate: "from-purple-500 via-purple-600 to-purple-700",
      luxury: "from-amber-500 via-orange-500 to-red-500",
    }
    return gradients[budget as keyof typeof gradients] || gradients.moderate
  }

  const getAvailabilityPercentage = (companions: string[], maxCompanions: number) => {
    return Math.round(((maxCompanions - companions.length) / maxCompanions) * 100)
  }

  const toggleFavorite = (tripId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(tripId)) {
      newFavorites.delete(tripId)
    } else {
      newFavorites.add(tripId)
    }
    setFavorites(newFavorites)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-300 text-lg">Discovering amazing trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Travel Buddy</h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Profile
              </Link>
              <Link href="/trips" className="text-white transition-colors text-sm font-medium">
                Trips
              </Link>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Discover Your Next </span>
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Adventure
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Browse amazing trips from fellow travelers, find your perfect match, and embark on unforgettable journeys together.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search destinations, activities..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="pl-12 py-6 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-500 transition-all"
              />
            </div>
            <Button
              onClick={() => setFiltersOpen(!filtersOpen)}
              variant="outline"
              className="py-6 px-6 rounded-xl border-slate-700 hover:bg-gray-300 text-black"
            >
              <Sliders className="w-5 h-5 mr-2" />
              Filters
            </Button>
            <Link href="/trips/create">
              <Button className="py-6 px-8 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                Create Trip
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Filter Panel */}
          {filtersOpen && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Budget
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white text-sm transition-all"
                    value={filterBudget}
                    onChange={(e) => setFilterBudget(e.target.value)}
                  >
                    <option value="">All Budgets</option>
                    <option value="budget">Budget-Friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Duration
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white text-sm transition-all">
                    <option>Any Duration</option>
                    <option>1-3 Days</option>
                    <option>1-2 Weeks</option>
                    <option>2+ Weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Group Size
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white text-sm transition-all">
                    <option>Any Size</option>
                    <option>Solo</option>
                    <option>2-4 People</option>
                    <option>5+ People</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setSearchDestination("")
                      setFilterBudget("")
                    }}
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-black"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-600/20 border border-slate-700 mb-6">
              <MapPin className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">No trips found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              We couldn't find trips matching your criteria. Be the first to create an amazing adventure!
            </p>
            <Link href="/trips/create">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 px-8 rounded-xl">
                Create the First Trip
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-gray-400">
                  Showing <span className="font-semibold text-white">{filteredTrips.length}</span> amazing trips
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => {
                const availabilityPercent = getAvailabilityPercentage(
                  trip.companions,
                  trip.maxCompanions
                )
                const isAvailable = availabilityPercent > 0
                const isFavorite = favorites.has(trip._id)

                return (
                  <div
                    key={trip._id}
                    className="group relative h-full"
                  >
                    <Link href={`/trips/${trip._id}`}>
                      <Card className="h-full bg-slate-900/50 border-slate-700 hover:border-purple-500 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
                        {/* Gradient Header */}
                        <div
                          className={`h-40 bg-linear-to-br ${getBudgetGradient(
                            trip.budget
                          )} relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 opacity-30 bg-noise"></div>
                          
                          {/* Badge */}
                          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">
                              {trip.budget}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(trip._id)
                              }}
                              className="bg-black/40 backdrop-blur-sm p-2 rounded-full border border-white/20 hover:bg-black/60 transition-all"
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-white"
                                }`}
                              />
                            </button>
                            <button className="bg-black/40 backdrop-blur-sm p-2 rounded-full border border-white/20 hover:bg-black/60 transition-all">
                              <Share2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                              {trip.destination}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              {new Date(trip.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              -{" "}
                              {new Date(trip.endDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>

                          {/* Creator */}
                          <div className="mb-4 pb-4 border-b border-slate-700/50">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                              Created by
                            </p>
                            <p className="text-sm font-semibold text-gray-200">
                              {trip.userId.name}
                            </p>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-slate-700 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="w-4 h-4 text-blue-400" />
                                <p className="text-xs text-gray-400 font-semibold">
                                  Companions
                                </p>
                              </div>
                              <p className="text-lg font-bold text-white">
                                {trip.companions.length}/{trip.maxCompanions}
                              </p>
                            </div>
                            <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 border border-slate-700 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Wallet className="w-4 h-4 text-purple-400" />
                                <p className="text-xs text-gray-400 font-semibold">
                                  Budget
                                </p>
                              </div>
                              <p className="text-sm font-bold text-white capitalize">
                                {trip.budget}
                              </p>
                            </div>
                          </div>

                          {/* Availability Bar */}
                          {isAvailable && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-xs font-semibold text-gray-400">
                                  Spots Available
                                </p>
                                <span className="text-xs font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                  {availabilityPercent}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div
                                  className="h-full bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-300"
                                  style={{ width: `${availabilityPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Description */}
                          {trip.description && (
                            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                              {trip.description}
                            </p>
                          )}

                          {/* CTA Button */}
                          <Button className="w-full rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold group/btn">
                            View Trip Details
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
