"use client"

import type React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, MapPin, Calendar, Users, Wallet, Sparkles } from "lucide-react"

export default function CreateTripPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    activities: "",
    budget: "",
    maxCompanions: "2",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.destination.trim()) newErrors.destination = "Destination is required"
      if (!formData.startDate) newErrors.startDate = "Start date is required"
      if (!formData.endDate) newErrors.endDate = "End date is required"
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = "End date must be after start date"
      }
    } else if (step === 2) {
      if (!formData.budget) newErrors.budget = "Budget range is required"
      if (!formData.maxCompanions || Number.parseInt(formData.maxCompanions) < 1) {
        newErrors.maxCompanions = "Max companions must be at least 1"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          activities: formData.activities
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a),
          maxCompanions: Number.parseInt(formData.maxCompanions),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/trips/${data.trip._id}`)
      } else {
        setErrors({ submit: "Failed to create trip. Please try again." })
      }
    } catch (error) {
      console.error("Failed to create trip:", error)
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const steps = [
    { id: 1, label: "Trip Details" },
    { id: 2, label: "Preferences" },
    { id: 3, label: "Description" },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Plan Your Adventure
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Create your perfect trip and find amazing travel companions</p>
        </div>

        {/* Progress Indicator - Centered with Equal Spacing */}
        <div className="mb-16 flex justify-center px-4">
          <div className="flex items-center justify-center gap-16">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-16">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full font-bold text-lg transition-all z-10 shadow-lg ${
                      step.id <= currentStep
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50"
                        : "bg-slate-700 text-gray-400 border-2 border-slate-600"
                    }`}
                  >
                    {step.id}
                  </div>
                  <p className="text-gray-300 font-semibold text-sm mt-4 text-center whitespace-nowrap">
                    {step.label}
                  </p>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-24 rounded-full transition-all ${
                      step.id < currentStep
                        ? "bg-linear-to-r from-purple-600 to-pink-600"
                        : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Trip Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Where are you going?</h2>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">Destination *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                      <Input
                        name="destination"
                        placeholder="e.g., Thailand, Bali, Japan..."
                        value={formData.destination}
                        onChange={handleInputChange}
                        className={`pl-12 h-12 text-base bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.destination ? "border-red-500 focus:ring-red-500/20" : ""
                        }`}
                        required
                      />
                    </div>
                    {errors.destination && <p className="text-red-400 text-sm mt-1">{errors.destination}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">Start Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                        <Input
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className={`pl-12 h-12 text-base bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            errors.startDate ? "border-red-500 focus:ring-red-500/20" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">End Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                        <Input
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className={`pl-12 h-12 text-base bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            errors.endDate ? "border-red-500 focus:ring-red-500/20" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-200">
                      💡 <span className="font-semibold">Tip:</span> Longer trips give you more time to find the perfect travel companions
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Preferences */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <Wallet className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Trip Preferences</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">Budget Range *</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 h-12 border rounded-md bg-slate-800 text-white text-base font-medium transition-all hover:border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
                          errors.budget ? "border-red-500 focus:ring-red-500/20" : "border-slate-700"
                        }`}
                        required
                      >
                        <option value="">Select budget range...</option>
                        <option value="budget">💰 Budget (Under $50/day)</option>
                        <option value="moderate">💎 Moderate ($50-$150/day)</option>
                        <option value="luxury">👑 Luxury ($150+/day)</option>
                      </select>
                      {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">Max Companions *</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                        <Input
                          name="maxCompanions"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.maxCompanions}
                          onChange={handleInputChange}
                          className={`pl-12 h-12 text-base bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                            errors.maxCompanions ? "border-red-500 focus:ring-red-500/20" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.maxCompanions && <p className="text-red-400 text-sm mt-1">{errors.maxCompanions}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">Activities & Interests</label>
                    <Input
                      name="activities"
                      placeholder="e.g., Hiking, Beach, Cultural sites, Nightlife..."
                      value={formData.activities}
                      onChange={handleInputChange}
                      className="h-12 text-base bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <p className="text-xs text-gray-500">Separate activities with commas</p>
                  </div>

                  <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                    <p className="text-sm text-purple-200">
                      🎯 <span className="font-semibold">Smart tip:</span> Being specific about activities helps match you with like-minded travelers
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Description */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-pink-400" />
                    <h2 className="text-2xl font-bold text-white">Tell Your Story</h2>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">Trip Description</label>
                    <textarea
                      name="description"
                      placeholder="Share your vision for this trip... What makes it special? What kind of travelers are you looking for? Any special experiences planned?"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800 text-white text-base font-medium placeholder-gray-500 transition-all hover:border-pink-500/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                      <p className="text-sm text-red-200">{errors.submit}</p>
                    </div>
                  )}

                  <div className="bg-pink-900/30 border border-pink-700/50 rounded-lg p-4">
                    <p className="text-sm text-pink-200">
                      ✨ <span className="font-semibold">Pro tip:</span> Engaging descriptions get 3x more interest from potential companions
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrev}
                    variant="outline"
                    className="px-6 h-12 font-semibold bg-slate-800 border border-slate-700 text-gray-200 hover:bg-slate-700 hover:border-slate-600"
                  >
                    ← Back
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-8 h-12 font-semibold bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="ml-auto px-8 h-12 font-semibold bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Trip 🚀"}
                  </Button>
                )}

                {currentStep === 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-6 h-12 font-semibold bg-slate-800 border border-slate-700 text-gray-200 hover:bg-slate-700 hover:border-slate-600"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Join <span className="font-bold text-gray-200">2,500+</span> travelers who've found their perfect travel companions
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
