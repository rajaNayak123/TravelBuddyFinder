"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchTrips()
    }
  }, [status, router])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips")
      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesDestination = trip.destination.toLowerCase().includes(searchDestination.toLowerCase())
    const matchesBudget = !filterBudget || trip.budget === filterBudget
    return matchesDestination && matchesBudget
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading trips...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Travel Buddy</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost">Matches</Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost">Messages</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Browse Trips</h2>
            <p className="text-muted-foreground">Find trips and join other travelers</p>
          </div>
          <Link href="/trips/create">
            <Button size="lg">Create Trip</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Destination</label>
              <Input
                placeholder="e.g., Thailand, Japan..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget</label>
              <select
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
              >
                <option value="">All Budgets</option>
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchDestination("")
                  setFilterBudget("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-4">No trips found matching your criteria</p>
              <Link href="/trips/create">
                <Button>Create the first trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Link key={trip._id} href={`/trips/${trip._id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl">{trip.destination}</CardTitle>
                    <CardDescription>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Created by</p>
                      <p className="font-medium">{trip.userId.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium capitalize">{trip.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Companions</p>
                        <p className="font-medium">
                          {trip.companions.length}/{trip.maxCompanions}
                        </p>
                      </div>
                    </div>
                    {trip.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
