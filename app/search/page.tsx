"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Sparkles,
  MapPin,
  Backpack,
  Users,
  X,
  ChevronDown,
  Filter,
  MessageCircle,
} from "lucide-react"

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

// Filter Sidebar Component
const FilterSidebar = ({
  filters,
  setFilters,
  toggleTravelStyle,
  onClear,
}: {
  filters: any
  setFilters: any
  toggleTravelStyle: (style: string) => void
  onClear: () => void
}) => {
  const [expandedSections, setExpandedSections] = useState({
    travel: true,
    budget: true,
    age: false,
  })

  const toggleSection = (section: "travel" | "budget" | "age") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }
  
  const activeFilters = [
    filters.name,
    filters.destination,
    ...filters.travelStyle,
    filters.budget,
    filters.minAge,
    filters.maxAge,
  ].filter(Boolean)

  return (
    <div className="space-y-4">
      {/* Active Filters Tags */}
      {activeFilters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Filters
            </p>
            <button
              onClick={onClear}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.name && (
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-blue-500/60 transition-colors">
                {filters.name}
                <button
                  onClick={() => setFilters({ ...filters, name: "" })}
                  className="hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.destination && (
              <div className="bg-green-500/20 border border-green-500/40 text-green-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-green-500/60 transition-colors">
                {filters.destination}
                <button
                  onClick={() => setFilters({ ...filters, destination: "" })}
                  className="hover:text-green-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.travelStyle.map((style: string) => (
              <div
                key={style}
                className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 capitalize hover:border-purple-500/60 transition-colors"
              >
                {style}
                <button
                  onClick={() => toggleTravelStyle(style)}
                  className="hover:text-purple-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {filters.budget && (
              <div className="bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-orange-500/60 transition-colors">
                {filters.budget}
                <button
                  onClick={() => setFilters({ ...filters, budget: "" })}
                  className="hover:text-orange-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Card */}
      <Card className="border-gray-700 bg-linear-to-br from-gray-900 to-gray-950 sticky top-24">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-lg text-white">Refine Search</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 pl-9 focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="e.g., Thailand..."
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 pl-9 focus:border-green-500/50"
              />
            </div>
          </div>

          {/* Travel Style - Expandable */}
          <div>
            <button
              onClick={() => toggleSection("travel")}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Backpack className="w-4 h-4 text-purple-400" />
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer">
                  Travel Style
                </label>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  expandedSections.travel ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.travel && (
              <div className="space-y-2 pl-3 pt-2 border-l border-gray-700/50">
                {TRAVEL_STYLES.map((style) => (
                  <div key={style} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`filter-${style}`}
                      checked={filters.travelStyle.includes(style)}
                      onCheckedChange={() => toggleTravelStyle(style)}
                      className="border-gray-600 bg-gray-800 checked:bg-purple-600 checked:border-purple-600"
                    />
                    <label
                      htmlFor={`filter-${style}`}
                      className="text-sm text-gray-300 capitalize cursor-pointer hover:text-gray-200 transition-colors"
                    >
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget - Expandable */}
          <div>
            <button
              onClick={() => toggleSection("budget")}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer flex items-center gap-2">
                <span>💰</span>
                Budget
              </label>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  expandedSections.budget ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.budget && (
              <div className="pt-2 pl-3 border-l border-gray-700/50">
                <select
                  className="w-full px-3 py-2.5 border border-gray-700 rounded-lg bg-gray-800/50 text-gray-300 text-sm focus:border-orange-500/50 focus:outline-none transition-colors"
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
            )}
          </div>

          {/* Age Range - Expandable */}
          <div>
            <button
              onClick={() => toggleSection("age")}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                Age Range
              </label>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  expandedSections.age ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.age && (
              <div className="pt-2 pl-3 border-l border-gray-700/50 space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min age"
                    value={filters.minAge}
                    onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                    className="w-1/2 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max age"
                    value={filters.maxAge}
                    onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                    className="w-1/2 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Clear Button */}
          {activeFilters.length > 0 && (
            <Button
              onClick={onClear}
              className="w-full bg-linear-to-r from-red-600/20 to-red-600/10 text-red-300 hover:from-red-600/30 hover:to-red-600/20 border border-red-500/20 hover:border-red-500/40 transition-all"
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// User Card Component
const UserCard = ({ user }: { user: User }) => {
  return (
    <Card className="group relative overflow-hidden border-gray-700 bg-linear-to-br from-gray-900 to-gray-950 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-transparent to-blue-500/10" />
      </div>

      <CardContent className="relative pt-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            {user.age && <p className="text-sm text-gray-400">Age {user.age}</p>}
          </div>
          <div className="flex items-center gap-3">
            {user.verified && (
              <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/50 px-2.5 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-blue-300 text-xs font-medium">Verified</span>
              </div>
            )}
            {user.rating > 0 && (
              <div className="bg-amber-500/20 border border-amber-500/50 px-2.5 py-1.5 rounded-full">
                <span className="text-sm text-amber-300">⭐ {user.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 hover:line-clamp-none transition-all">
            {user.bio}
          </p>
        )}

        {/* Tags Grid */}
        <div className="space-y-3 mb-4">
          {/* Destinations */}
          {user.destinations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {user.destinations.slice(0, 3).map((dest) => (
                  <span
                    key={dest}
                    className="bg-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-500/30 hover:border-green-500/60 transition-colors"
                  >
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Travel Style */}
          {user.travelStyle.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Travel Style
              </p>
              <div className="flex flex-wrap gap-2">
                {user.travelStyle.map((style) => (
                  <span
                    key={style}
                    className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-500/30 capitalize hover:border-purple-500/60 transition-colors"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Budget Info */}
        {user.budget && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
            <p className="text-xs text-gray-400 mb-1">Budget Range</p>
            <p className="text-sm font-medium text-gray-200 capitalize">{user.budget}</p>
          </div>
        )}

        {/* Action Button */}
        <Link href={`/messages?userId=${user._id}`} className="block">
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
const EmptyState = () => {
  return (
    <Card className="border-gray-700 bg-linear-to-br from-gray-900 to-gray-950 col-span-full">
      <CardContent className="py-16 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-gray-300 font-medium mb-2">No matches found</p>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Try adjusting your filters to discover more travel buddies
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Header Component
const SearchHeader = () => {
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

// Main Page
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data.users)
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

  const handleClearFilters = () => {
    setFilters({
      name: "",
      destination: "",
      travelStyle: [],
      budget: "",
      minAge: "",
      maxAge: "",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-gray-400">Searching for travel buddies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
      <SearchHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Find Your Travel Match</h2>
          </div>
          <p className="text-gray-400">
            Discover {users.length} travel buddies and find your perfect match
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              toggleTravelStyle={toggleTravelStyle}
              onClear={handleClearFilters}
            />
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <p className="text-gray-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-500/20 rounded-full text-xs font-semibold text-purple-300">
                  {filteredUsers.length}
                </span>
                travel buddy{filteredUsers.length !== 1 ? "ies" : ""} found
              </p>
            </div>

            {filteredUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-6">
                {filteredUsers.map((user, idx) => (
                  <div
                    key={user._id}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.05}s both`,
                    }}
                  >
                    <UserCard user={user} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

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
      `}</style>
    </div>
  )
}
