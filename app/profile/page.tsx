"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Users, Globe, Zap, MessageSquare, Heart, Share2, Edit2, Check, X } from "lucide-react"

const TRAVEL_STYLES = ["adventurous", "chill", "foodie", "cultural"]
const BUDGET_OPTIONS = ["budget", "moderate", "luxury"]
const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Mandarin"]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
    travelStyle: [] as string[],
    destinations: "",
    budget: "",
    languages: [] as string[],
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.id) {
      fetchProfile()
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()
      setFormData({
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "",
        bio: data.bio || "",
        travelStyle: data.travelStyle || [],
        destinations: data.destinations?.join(", ") || "",
        budget: data.budget || "",
        languages: data.languages || [],
      })
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          destinations: formData.destinations.split(",").map((d) => d.trim()),
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const toggleTravelStyle = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter((s) => s !== style)
        : [...prev.travelStyle, style],
    }))
  }

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang) ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-gray-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black text-gray-100">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {!isEditing ? (
          // View Mode
          <>
            {/* Hero Section */}
            <div className="border-b border-gray-800">
              <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Profile Card */}
                  <div className="md:col-span-1">
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-3xl p-6 sticky top-6">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-5xl mb-4 shadow-lg">
                          ✈
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">{formData.name || "Your Name"}</h1>
                        <p className="text-gray-400 mb-4">
                          {formData.age && formData.gender ? `Age: ${formData.age}, Gender: ${formData.gender}` : "Age & Gender"}
                        </p>
                        <p className="text-gray-300 text-sm mb-6 line-clamp-3">{formData.bio || "Add your bio"}</p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-medium">
                          <Heart className="w-4 h-4" />
                          Connect
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 py-3 rounded-xl transition border border-gray-700">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                      </div>

                      <div className="flex gap-2 mb-6">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 py-2 rounded-lg transition text-sm border border-gray-700">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>

                      <Button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white py-3 rounded-xl transition flex items-center justify-center gap-2 border border-gray-600"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Travel Styles */}
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Travel Style</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.travelStyle.length > 0 ? (
                          formData.travelStyle.map((style) => (
                            <span
                              key={style}
                              className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 capitalize"
                            >
                              {style}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Not specified</span>
                        )}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Budget Range</h2>
                      </div>
                      <p className="text-xl font-semibold text-purple-300 capitalize">
                        {formData.budget || "Not specified"}
                      </p>
                    </div>

                    {/* Dream Destinations */}
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Dream Destinations</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.destinations ? (
                          formData.destinations.split(",").map((dest, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30"
                            >
                              {dest.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Not specified</span>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Globe className="w-5 h-5 text-green-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Languages</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.length > 0 ? (
                          formData.languages.map((lang) => (
                            <span
                              key={lang}
                              className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30"
                            >
                              {lang}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Edit Mode
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Edit Your Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-5 pb-8 border-b border-gray-700">
                  <h3 className="text-xl font-semibold text-white">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-slate-800 border border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 h-12 rounded-lg"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="bg-slate-800 border border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 h-12 rounded-lg"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                      <select
                        className="w-full h-12 px-4 bg-slate-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 transition"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">About You</label>
                    <textarea
                      className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:border-blue-500 transition resize-none"
                      rows={4}
                      placeholder="Tell other travelers about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                </div>

                {/* Travel Preferences */}
                <div className="space-y-5 pb-8 border-b border-gray-700">
                  <h3 className="text-xl font-semibold text-white">Travel Preferences</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Travel Style</label>
                    <div className="grid grid-cols-2 gap-3">
                      {TRAVEL_STYLES.map((style) => (
                        <label
                          key={style}
                          className="flex items-center gap-3 p-4 rounded-lg bg-slate-800 border border-gray-700 hover:border-blue-500/50 cursor-pointer transition"
                        >
                          <Checkbox
                            checked={formData.travelStyle.includes(style)}
                            onCheckedChange={() => toggleTravelStyle(style)}
                            className="border-gray-600"
                          />
                          <span className="text-sm text-gray-300 capitalize">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Dream Destinations</label>
                    <Input
                      placeholder="Thailand, Japan, Peru (comma-separated)"
                      value={formData.destinations}
                      onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                      className="bg-slate-800 border border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 h-12 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                    <select
                      className="w-full h-12 px-4 bg-slate-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 transition"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="">Select budget...</option>
                      <option value="budget">Budget</option>
                      <option value="moderate">Moderate</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-5 pb-8">
                  <h3 className="text-xl font-semibold text-white">Languages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LANGUAGES.map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-3 p-4 rounded-lg bg-slate-800 border border-gray-700 hover:border-blue-500/50 cursor-pointer transition"
                      >
                        <Checkbox
                          checked={formData.languages.includes(lang)}
                          onCheckedChange={() => toggleLanguage(lang)}
                          className="border-gray-600"
                        />
                        <span className="text-sm text-gray-300">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-12 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? "Saving..." : "Save Changes"} {!saving && <Check className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 h-12 bg-slate-800 hover:bg-slate-700 text-gray-300 border border-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
