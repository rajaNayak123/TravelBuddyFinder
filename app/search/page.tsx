"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface User {
  _id: string
  name: string
  age?: number
  bio?: string
  travelStyle: string[]
  destinations: string[]
  budget: string
  languages: string[]
  rating: number
  verified: boolean
}

const TRAVEL_STYLES = ["adventurous", "chill", "foodie", "cultural"]
const BUDGET_OPTIONS = ["budget", "moderate", "luxury"]

export default function SearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    name: "",
    destination: "",
    travelStyle: [] as string[],
    budget: "",
    minAge: "",
    maxAge: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchUsers()
    }
  }, [status, router])

  // useEffect(() => {
  //   applyFilters()
  // }, [filters, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const applyFilters = () => {
      let filtered = users

      if (filters.name) {
        filtered = filtered.filter((u) => u.name.toLowerCase().includes(filters.name.toLowerCase()))
      }

      if (filters.destination) {
        filtered = filtered.filter((u) =>
          u.destinations.some((d) => d.toLowerCase().includes(filters.destination.toLowerCase())),
        )
      }

      if (filters.travelStyle.length > 0) {
        filtered = filtered.filter((u) => filters.travelStyle.some((s) => u.travelStyle.includes(s)))
      }

      if (filters.budget) {
        filtered = filtered.filter((u) => u.budget === filters.budget)
      }

      if (filters.minAge) {
        filtered = filtered.filter((u) => u.age && u.age >= Number.parseInt(filters.minAge))
      }

      if (filters.maxAge) {
        filtered = filtered.filter((u) => u.age && u.age <= Number.parseInt(filters.maxAge))
      }

      setFilteredUsers(filtered)
    }

    applyFilters()
  }, [filters, users])

  const toggleTravelStyle = (style: string) => {
    setFilters((prev) => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter((s) => s !== style)
        : [...prev.travelStyle, style],
    }))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading users...</div>
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
            <Link href="/trips">
              <Button variant="ghost">Trips</Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost">Messages</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Search Travel Buddies</h2>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    placeholder="Search by name..."
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <Input
                    placeholder="e.g., Thailand..."
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  />
                </div>

                {/* Travel Style */}
                <div>
                  <label className="block text-sm font-medium mb-3">Travel Style</label>
                  <div className="space-y-2">
                    {TRAVEL_STYLES.map((style) => (
                      <div key={style} className="flex items-center">
                        <Checkbox
                          id={`filter-${style}`}
                          checked={filters.travelStyle.includes(style)}
                          onCheckedChange={() => toggleTravelStyle(style)}
                        />
                        <label htmlFor={`filter-${style}`} className="ml-2 text-sm capitalize cursor-pointer">
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium mb-2">Budget</label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    value={filters.budget}
                    onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                  >
                    <option value="">All Budgets</option>
                    {BUDGET_OPTIONS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget.charAt(0).toUpperCase() + budget.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Age Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                      className="w-1/2"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                      className="w-1/2"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() =>
                    setFilters({
                      name: "",
                      destination: "",
                      travelStyle: [],
                      budget: "",
                      minAge: "",
                      maxAge: "",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            <p className="text-muted-foreground mb-6">
              Found {filteredUsers.length} travel buddy{filteredUsers.length !== 1 ? "ies" : ""}
            </p>

            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{user.name}</h3>
                          {user.age && <p className="text-muted-foreground">Age {user.age}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {user.verified && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Verified</span>
                          )}
                          {user.rating > 0 && <span className="text-sm">⭐ {user.rating.toFixed(1)}</span>}
                        </div>
                      </div>

                      {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {user.destinations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Destinations</p>
                            <div className="flex flex-wrap gap-1">
                              {user.destinations.slice(0, 3).map((dest) => (
                                <span
                                  key={dest}
                                  className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded"
                                >
                                  {dest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {user.travelStyle.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Travel Style</p>
                            <div className="flex flex-wrap gap-1">
                              {user.travelStyle.map((style) => (
                                <span
                                  key={style}
                                  className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 rounded capitalize"
                                >
                                  {style}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {user.budget && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Budget: <span className="capitalize font-medium">{user.budget}</span>
                        </p>
                      )}

                      <Link href={`/messages?userId=${user._id}`}>
                        <Button className="w-full">Send Message</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
