"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  // Parallax effects for different image squares
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // High quality travel images from Pexels
  const travelImages = [
    "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600&h=600",
    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600&h=600",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600&h=600",
    "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600&h=600",
    "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=600&h=600",
    "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600&h=600"
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              ✈️ Travel Buddy
            </span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section with Animated Image Grid */}
      <section ref={heroRef} className="relative min-h-[700px] overflow-hidden bg-linear-to-br from-black via-gray-900 to-black">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Find Your Perfect
                <br />
                <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Travel Companion
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-xl"
              >
                Connect with like-minded travelers worldwide. Share experiences, split costs, and explore amazing destinations together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/auth/signup">
                  <Button 
                    size="lg" 
                    className="text-lg px-12 py-7 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    Start Your Journey
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Animated Floating Image Grid */}
            <div className="relative h-[600px] hidden lg:block">
              {/* First Column */}
              <motion.div 
                style={{ y: y1 }}
                className="absolute left-0 top-0 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -15, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.2 },
                    scale: { duration: 0.6, delay: 0.2 },
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/20 cursor-pointer"
                >
                  <Image
                    src={travelImages[0]}
                    alt="Travel destination"
                    fill
                    quality={95}
                    className="object-cover"
                    sizes="192px"
                    priority
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, 20, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.4 },
                    scale: { duration: 0.6, delay: 0.4 },
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }
                  }}
                  whileHover={{ scale: 1.1, rotate: -5, transition: { duration: 0.3 } }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30 ring-2 ring-purple-500/20 cursor-pointer"
                >
                  <Image
                    src={travelImages[1]}
                    alt="Travel destination"
                    fill
                    quality={95}
                    className="object-cover"
                    sizes="192px"
                  />
                </motion.div>
              </motion.div>

              {/* Second Column */}
              <motion.div 
                style={{ y: y2 }}
                className="absolute left-56 top-20 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -20, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.3 },
                    scale: { duration: 0.6, delay: 0.3 },
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }
                  }}
                  whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/20 cursor-pointer"
                >
                  <Image
                    src={travelImages[2]}
                    alt="Travel destination"
                    fill
                    quality={95}
                    className="object-cover"
                    sizes="192px"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, 15, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.5 },
                    scale: { duration: 0.6, delay: 0.5 },
                    y: {
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }
                  }}
                  whileHover={{ scale: 1.1, rotate: -5, transition: { duration: 0.3 } }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30 ring-2 ring-purple-500/20 cursor-pointer"
                >
                  <Image
                    src={travelImages[3]}
                    alt="Travel destination"
                    fill
                    quality={95}
                    className="object-cover"
                    sizes="192px"
                  />
                </motion.div>
              </motion.div>

              {/* Third Column */}
              <motion.div 
                style={{ y: y3 }}
                className="absolute right-0 top-10 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, 18, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.6 },
                    scale: { duration: 0.6, delay: 0.6 },
                    y: {
                      duration: 3.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7
                    }
                  }}
                  whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/20 cursor-pointer"
                >
                  <Image
                    src={travelImages[4]}
                    alt="Travel destination"
                    fill
                    quality={95}
                    className="object-cover"
                    sizes="192px"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -18, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.7 },
                    scale: { duration: 0.6, delay: 0.7 },
                    y: {
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2
                    }
                  }}
                  whileHover={{ scale: 1.1, rotate: -5, transition: { duration: 0.3 } }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30 ring-2 ring-purple-500/20 cursor-pointer"
                >
                  <Image
                    src={travelImages[5]}
                    alt="Travel destination"
                    fill
                    quality={95}
                    className="object-cover"
                    sizes="192px"
                  />
                </motion.div>
              </motion.div>

              {/* Floating Animation Badges */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-32 right-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-full px-6 py-3 shadow-2xl shadow-blue-500/40 z-20 border border-blue-400/20"
              >
                <p className="text-sm font-bold text-white">100+ Travelers</p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-32 left-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-full px-6 py-3 shadow-2xl shadow-purple-500/40 z-20 border border-purple-400/20"
              >
                <p className="text-sm font-bold text-white">20+ Countries</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Scroll Animations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Why Choose Travel Buddy?
            </span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to find and connect with the perfect travel companion
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              emoji: "🌍",
              title: "Global Network",
              description: "Connect with verified travelers from 20+ countries heading to your dream destinations.",
              gradient: "from-blue-500 to-purple-600",
              bgColor: "bg-gradient-to-br from-blue-500/10 to-purple-600/10",
              textColor: "from-blue-400 to-purple-500",
              borderColor: "border-blue-500/20"
            },
            {
              emoji: "🎯",
              title: "Smart Matching",
              description: "AI-powered algorithm matches you with compatible buddies based on interests and travel style.",
              gradient: "from-blue-500 to-purple-600",
              bgColor: "bg-gradient-to-br from-blue-500/10 to-purple-600/10",
              textColor: "from-blue-400 to-purple-500",
              borderColor: "border-purple-500/20"
            },
            {
              emoji: "💬",
              title: "Real-time Chat",
              description: "Secure messaging with instant translation. Connect and plan together in real-time.",
              gradient: "from-blue-500 to-purple-600",
              bgColor: "bg-gradient-to-br from-blue-500/10 to-purple-600/10",
              textColor: "from-blue-400 to-purple-500",
              borderColor: "border-purple-500/20"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`group relative ${feature.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border ${feature.borderColor} backdrop-blur-sm`}
            >
              <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-800">
                <span className="text-5xl">{feature.emoji}</span>
              </div>
              
              <h3 className={`text-2xl font-bold mb-4 bg-linear-to-r ${feature.textColor} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {feature.description}
              </p>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${feature.gradient} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section with Scroll Animation */}
      {/* <section className="bg-linear-to-r from-gray-900 via-black to-gray-900 py-20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-12 text-center text-white"
          >
            {[
              { number: "50K+", label: "Active Travelers", icon: "👥", color: "from-blue-400 to-purple-500" },
              { number: "120+", label: "Countries", icon: "🌏", color: "from-blue-400 to-purple-500" },
              { number: "15K+", label: "Successful Trips", icon: "✈️", color: "from-blue-400 to-purple-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                className="backdrop-blur-sm bg-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className={`text-5xl md:text-6xl font-bold mb-2 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-xl text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section with Scroll Animation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-linear-to-br from-blue-600 to-purple-600 rounded-3xl p-16 text-center shadow-2xl shadow-purple-500/30"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"
          />

          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Ready to Start Your Adventure?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Join 100+ travelers finding their perfect companions. Sign up free and start exploring today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-7 bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Get Started - It's Free
                </Button>
              </Link>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-white/80 mt-6"
            >
              No credit card required • Join in 30 seconds
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="text-lg">&copy; 2025 Travel Buddy Finder. All rights reserved.</p>
            <p className="mt-2 text-gray-500">Made by <span className="text-purple-400">Raja</span> for travelers worldwide</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
