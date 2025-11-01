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
  companions: string[]
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

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/auth/signin")
  //   } else if (status === "authenticated") {
  //     fetchTrip()
  //   }
  // }, [status, router])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
    
    if (status === "authenticated") {
      const fetchTrip = async () => {
        try {
          const response = await fetch(`/api/trip/${tripId}`)
          const data = await response.json()
          setTrip(data)
          setHasRequested(data.companions.includes(session?.user?.id))
        } catch (error) {
          console.error("Failed to fetch trip:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchTrip()
    }
  }, [status, router, tripId, session?.user?.id])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`)
      const data = await response.json()
      setTrip(data)
      setHasRequested(data.companions.includes(session?.user?.id))
    } catch (error) {
      console.error("Failed to fetch trip:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestToJoin = async () => {
    setRequesting(true)
    try {
      const response = await fetch(`/api/trips/${tripId}/request`, {
        method: "POST",
      })

      if (response.ok) {
        setHasRequested(true)
        fetchTrip()
      }
    } catch (error) {
      console.error("Failed to request:", error)
    } finally {
      setRequesting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading trip...</div>
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
                <Button onClick={handleRequestToJoin} disabled={hasRequested || isFull || requesting} size="lg">
                  {hasRequested ? "Request Sent" : isFull ? "Trip Full" : "Request to Join"}
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
                {trip.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {trip.activities.map((activity) => (
                      <span key={activity} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
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
              <h3 className="font-semibold mb-4">Companions ({trip.companions.length})</h3>
              {trip.companions.length > 0 ? (
                <div className="space-y-2">
                  {trip.companions.map((companion) => (
                    <div key={companion} className="bg-card border border-border p-3 rounded">
                      <p className="font-medium">Companion ID: {companion}</p>
                    </div>
                  ))}
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
