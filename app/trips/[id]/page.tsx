"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Sparkles,
  Share2,
  Heart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"


interface Companion {
  _id: string
  name?: string
  email?: string
}

interface Trip {
  _id: string
  destination: string
  startDate: string
  endDate: string
  activities: string[]
  budget: string
  maxCompanions: number
  companions: Companion[] | string[]
  description: string
  userId: {
    name: string
    _id: string
  }
  createdAt: string
}

const BUDGET_INFO: Record<string, { label: string; emoji: string; description: string; range: string }> = {
  budget: {
    label: 'Budget',
    emoji: '💰',
    description: 'Economy friendly',
    range: 'Under $50/day'
  },
  moderate: {
    label: 'Moderate',
    emoji: '💎',
    description: 'Comfortable travel',
    range: '$50-$150/day'
  },
  luxury: {
    label: 'Luxury',
    emoji: '👑',
    description: 'Premium experience',
    range: '$150+/day'
  }
}


export default function TripDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const tripId = params.id as string
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
    
    if (status === "authenticated") {
      fetchTripData()
    }
  }, [status, router, tripId, session?.user?.id])

  const fetchTripData = async () => {
    try {
      const response = await fetch(`/api/trip/${tripId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const tripData = data.trip || data
      setTrip(tripData)
      
      if (tripData.companions && session?.user?.id) {
        const hasRequest = tripData.companions.some((companion: Companion | string) => {
          const companionId = typeof companion === 'string' ? companion : companion._id
          return companionId === session.user?.id
        })
        setHasRequested(hasRequest)
      }
    } catch (error) {
      console.error("Failed to fetch trip:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestToJoin = async () => {
    setRequesting(true)
    try {
      const response = await fetch(`/api/trip/${tripId}/request`, {
        method: "POST",
      })
      
      if (response.ok) {
        setHasRequested(true)
        await fetchTripData() 
      } else {
        const errorData = await response.json()
        console.error("Request failed:", errorData)
      }
    } catch (error) {
      console.error("Failed to request:", error)
    } finally {
      setRequesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-300">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
          <p className="text-gray-400 mb-8">This trip doesn't exist or has been removed.</p>
          <Link href="/trips">
            <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-12">
              Back to Trips
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = session?.user?.id === trip.userId._id
  const isFull = trip.companions.length >= trip.maxCompanions
  const days = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  )

  const budgetInfo = BUDGET_INFO[trip.budget] || BUDGET_INFO['moderate']

  const colors = [
    'from-purple-600 to-pink-600',
    'from-blue-600 to-purple-600',
    'from-pink-600 to-red-600',
    'from-green-600 to-blue-600'
  ]


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/trips" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
          
          <div className="flex gap-3">
            <button className="p-2 hover:bg-slate-800 rounded-full transition-all text-gray-400 hover:text-white">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-full transition-all text-gray-400 hover:text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Image Section */}
        <div className="mb-8 rounded-2xl overflow-hidden bg-slate-800 h-96 relative group">
          <div className="w-full h-full bg-linear-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 flex items-center justify-center">
            <MapPin className="w-32 h-32 text-purple-500/30" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-3">{trip.destination}</h1>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                  <span>{budgetInfo.emoji} {budgetInfo.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  {days} days
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  {trip.companions.length}/{trip.maxCompanions} companions
                </div>
              </div>
            </div>

            {/* Dates Bar */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-2">Check-in</p>
                  <p className="text-lg font-semibold text-white">{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm text-gray-400">{new Date(trip.startDate).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs uppercase text-gray-500 mb-2">Duration</p>
                    <p className="text-lg font-semibold text-purple-400">{days} days</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-2">Check-out</p>
                  <p className="text-lg font-semibold text-white">{new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm text-gray-400">{new Date(trip.endDate).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {trip.description && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About This Adventure</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{trip.description}</p>
              </div>
            )}

            {/* Activities */}
            {trip.activities && trip.activities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">What You'll Do</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trip.activities.map((activity, index) => (
                    <div 
                      key={`${activity}-${index}`} 
                      className={`bg-linear-to-br ${colors[index % colors.length]} rounded-xl p-4 text-white font-semibold text-center`}
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Companions Grid */}
            {trip.companions && trip.companions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Your Travel Squad</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {trip.companions.map((companion, index: number) => {
                    const isPopulated = typeof companion === 'object' && companion !== null
                    const companionName = isPopulated ? (companion as Companion).name : null
                    
                    return (
                      <div 
                        key={`companion-${index}`} 
                        className="text-center group cursor-pointer"
                      >
                        <div className={`w-full aspect-square rounded-xl bg-linear-to-br ${colors[index % colors.length]} flex items-center justify-center text-white text-3xl font-bold mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all`}>
                          {companionName ? companionName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <p className="text-white font-semibold text-sm truncate">{companionName || 'Companion'}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border border-slate-700 rounded-2xl sticky top-24 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                {/* Budget Card */}
                <div className="bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <p className="text-xs uppercase text-gray-500 mb-2">Trip Budget</p>
                  <div className="mb-3">
                    <p className="text-3xl font-bold text-white mb-1">
                      {budgetInfo.emoji} {budgetInfo.label}
                    </p>
                    <p className="text-2xl text-purple-400 font-semibold">{budgetInfo.range}</p>
                  </div>
                  <p className="text-sm text-gray-300">{budgetInfo.description}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3 py-6 border-y border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spots Available</span>
                    <span className="text-white font-semibold">{trip.maxCompanions - trip.companions.length}/{trip.maxCompanions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Already Joined</span>
                    <span className="text-white font-semibold">{trip.companions.length}</span>
                  </div>
                </div>

                {/* Organizer */}
                <div className="bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4">
                  <p className="text-xs uppercase text-gray-500 mb-3">Organized by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shrink-0">
                      {trip.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{trip.userId.name}</p>
                      <p className="text-xs text-gray-400">{new Date(trip.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Trip Filling Up</span>
                    <span>{Math.round((trip.companions.length / trip.maxCompanions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${(trip.companions.length / trip.maxCompanions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                {!isOwner && (
                  <Button 
                    onClick={handleRequestToJoin} 
                    disabled={hasRequested || isFull || requesting}
                    className={`w-full h-12 font-bold rounded-lg transition-all ${
                      hasRequested 
                        ? 'bg-slate-700 text-gray-300 cursor-not-allowed'
                        : isFull 
                        ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                        : 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
                    }`}
                  >
                    {requesting 
                      ? 'Requesting...'
                      : hasRequested 
                      ? '✓ Request Sent'
                      : isFull 
                      ? 'Trip Full'
                      : 'Request to Join'}
                  </Button>
                )}

                {isOwner && (
                  <div className="text-center bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-400 font-semibold flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                      You're the Organizer
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
