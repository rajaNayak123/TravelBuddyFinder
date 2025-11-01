"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Trip {
  _id: string
  destination: string
  startDate: string
  endDate: string
  activities: string[]
  budget: string
  maxCompanions: number
  companions: Array<{
    _id: string
    name?: string
    email?: string
  }> | string[]
  description: string
  userId: {
    name: string
    _id: string
  }
  createdAt: string
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
      console.log("Fetched data:", data)
      
      const tripData = data.trip || data
      setTrip(tripData)
      
      if (tripData.companions && session?.user?.id) {
        const hasRequest = tripData.companions.some((companion: any) => {
          const companionId = typeof companion === 'string' ? companion : companion._id
          return companionId === session.user.id
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading trip...</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground mb-4">Trip not found</p>
            <Link href="/trips">
              <Button>Back to Trips</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = session?.user?.id === trip.userId._id
  const isFull = trip.companions.length >= trip.maxCompanions

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/trips" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Trips
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{trip.destination}</CardTitle>
                <CardDescription>
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </CardDescription>
              </div>
              {!isOwner && (
                <Button 
                  onClick={handleRequestToJoin} 
                  disabled={hasRequested || isFull || requesting} 
                  size="lg"
                >
                  {requesting 
                    ? "Requesting..." 
                    : hasRequested 
                    ? "Request Sent" 
                    : isFull 
                    ? "Trip Full" 
                    : "Request to Join"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Trip Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <p className="font-medium">{trip.userId.name}</p>
                  </div>
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
              </div>

              <div>
                <h3 className="font-semibold mb-4">Activities</h3>
                {trip.activities && trip.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {trip.activities.map((activity, index) => (
                      <span 
                        key={`${activity}-${index}`} 
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No activities specified</p>
                )}
              </div>
            </div>

            {/* Description */}
            {trip.description && (
              <div>
                <h3 className="font-semibold mb-2">About This Trip</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{trip.description}</p>
              </div>
            )}

            {/* Companions */}
            <div>
              <h3 className="font-semibold mb-4">
                Companions ({trip.companions?.length || 0})
              </h3>
              {trip.companions && trip.companions.length > 0 ? (
                <div className="space-y-2">
                  {trip.companions.map((companion: any, index: number) => {
                    // Handle both populated objects and string IDs
                    const isPopulated = typeof companion === 'object' && companion !== null
                    const companionId = isPopulated ? companion._id : companion
                    const companionName = isPopulated ? companion.name : null
                    const companionEmail = isPopulated ? companion.email : null
                    
                    return (
                      <div 
                        key={companionId || index} 
                        className="bg-card border border-border p-3 rounded"
                      >
                        {companionName ? (
                          <div>
                            <p className="font-medium">{companionName}</p>
                            {companionEmail && (
                              <p className="text-sm text-muted-foreground">{companionEmail}</p>
                            )}
                          </div>
                        ) : (
                          <p className="font-medium text-muted-foreground">
                            Companion (ID: {companionId.slice(0, 8)}...)
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No companions yet. Be the first to join!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
