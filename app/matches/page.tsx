"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Match {
  _id: string
  userId: {
    _id: string
    name: string
    age?: number
    travelStyle: string[]
    destinations: string[]
    budget: string
    bio?: string
    rating: number
    verified: boolean
  }
  matchScore: number
  reasons: string[]
}

export default function MatchesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchMatches()
    }
  }, [status, router])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matches")
      const data = await response.json()
      setMatches(data)
    } catch (error) {
      console.error("Failed to fetch matches:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading matches...</div>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Your Matches</h2>
          <p className="text-muted-foreground">
            {matches.length === 0
              ? "Complete your profile to get personalized recommendations"
              : `Found ${matches.length} compatible travel buddies`}
          </p>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-4">
                No matches yet. Complete your profile to get personalized recommendations.
              </p>
              <Link href="/profile">
                <Button>Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{match.userId.name}</CardTitle>
                      {match.userId.age && <CardDescription>Age {match.userId.age}</CardDescription>}
                    </div>
                    {match.userId.verified && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Verified</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Match Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Match Score</p>
                      <p className="text-lg font-bold text-primary">{match.matchScore}%</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${match.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {match.reasons.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Why you match:</p>
                      <ul className="space-y-1">
                        {match.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="space-y-2">
                    {match.userId.destinations.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Destinations</p>
                        <div className="flex flex-wrap gap-1">
                          {match.userId.destinations.slice(0, 3).map((dest) => (
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

                    {match.userId.travelStyle.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Travel Style</p>
                        <div className="flex flex-wrap gap-1">
                          {match.userId.travelStyle.map((style) => (
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

                    {match.userId.budget && (
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm capitalize">{match.userId.budget}</p>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  {match.userId.rating > 0 && (
                    <div>
                      <p className="text-sm">⭐ {match.userId.rating.toFixed(1)} rating</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/messages?userId=${match.userId._id}`} className="block">
                    <Button className="w-full">Send Message</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
