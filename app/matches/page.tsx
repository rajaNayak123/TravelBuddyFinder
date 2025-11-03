"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, MapPin, TrendingUp, MessageCircle } from "lucide-react"

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

// Presentational Component: Match Card
const MatchCard = ({ match }: { match: Match }) => {
  return (
    <Card className="group relative overflow-hidden border-gray-700 bg-linear-to-br from-gray-900 to-gray-950 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-transparent to-blue-500/10" />
      </div>

      <CardHeader className="relative pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl text-white font-semibold">{match.userId.name}</CardTitle>
            {match.userId.age && (
              <CardDescription className="text-gray-400 text-sm">
                {match.userId.age} years old
              </CardDescription>
            )}
          </div>
          {match.userId.verified && (
            <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-blue-300 text-xs font-medium">Verified</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Match Score Section */}
        <div className="space-y-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-medium text-gray-300">Match Compatibility</p>
            </div>
            <p className="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {match.matchScore}%
            </p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-linear-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${match.matchScore}%` }}
            />
          </div>
        </div>

        {/* Why You Match */}
        {match.reasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-200">Why you match:</p>
            <ul className="space-y-1">
              {match.reasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Destinations */}
        {match.userId.destinations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-semibold text-gray-300">Destinations</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {match.userId.destinations.slice(0, 3).map((dest) => (
                <span
                  key={dest}
                  className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1.5 rounded-full border border-blue-500/30 hover:border-blue-500/60 transition-colors"
                >
                  {dest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Travel Style */}
        {match.userId.travelStyle.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-300">Travel Style</p>
            <div className="flex flex-wrap gap-2">
              {match.userId.travelStyle.map((style) => (
                <span
                  key={style}
                  className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1.5 rounded-full border border-purple-500/30 capitalize hover:border-purple-500/60 transition-colors"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Budget & Rating Row */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {match.userId.budget && (
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">Budget</p>
              <p className="text-sm font-medium text-gray-200 capitalize">{match.userId.budget}</p>
            </div>
          )}
          {match.userId.rating > 0 && (
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">Rating</p>
              <div className="flex items-center gap-1">
                <span className="text-lg">⭐</span>
                <p className="text-sm font-medium text-gray-200">{match.userId.rating.toFixed(1)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/messages?userId=${match.userId._id}`} className="block pt-2">
          <Button className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-300 group/btn">
            <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Send Message
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Empty State Component
const EmptyMatchState = () => {
  return (
    <Card className="border-gray-700 bg-linear-to-br from-gray-900 to-gray-950">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400 mb-2">No matches yet</p>
          <p className="text-gray-500 text-sm">Complete your profile to get personalized recommendations</p>
        </div>
        <Link href="/profile">
          <Button className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Complete Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Header Navigation Component
const MatchesHeader = () => {
  return (
    <header className="border-b border-gray-700/50 bg-linear-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Travel Buddy</h1>
        </div>
        <nav className="flex gap-2">
          {["Dashboard", "Profile", "Trips", "Messages"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                {item}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

// Main Page Component
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
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-gray-400">Finding your perfect travel matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
      <MatchesHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Your Matches</h2>
          </div>
          <p className="text-gray-400">
            {matches.length === 0
              ? "Complete your profile to get personalized recommendations"
              : `Discover ${matches.length} compatible travel buddies perfectly matched to your style`}
          </p>
        </div>

        {/* Matches Grid or Empty State */}
        {matches.length === 0 ? (
          <EmptyMatchState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {matches.map((match, idx) => (
              <div key={match._id} style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both` }}>
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add this to your global CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
