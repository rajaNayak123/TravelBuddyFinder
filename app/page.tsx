import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen from-primary/5 to-accent/5">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Travel Buddy</div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Find Your Perfect Travel Companion
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Connect with like-minded travelers, share experiences, and explore the world together. Find your ideal travel
          buddy based on destination, style, and budget.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="text-lg px-8">
            Start Exploring
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Global Network</h3>
            <p className="text-muted-foreground">
              Connect with travelers from around the world heading to your dream destinations.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-muted-foreground">
              Our algorithm matches you with compatible travel buddies based on your preferences.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-muted-foreground">Chat instantly with potential travel companions before you meet.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Travel Buddy?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of travelers who have found their perfect companions on Travel Buddy Finder.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Travel Buddy Finder. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
