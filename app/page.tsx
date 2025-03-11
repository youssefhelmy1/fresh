'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [showVideo, setShowVideo] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const features = [
    {
      icon: '💻',
      title: 'Online Convenience',
      description: 'Learn from anywhere in the world with high-quality video lessons',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: '💰',
      title: 'Affordable Pricing',
      description: '$25 per hour, with special pricing for multiple lessons',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🎸',
      title: 'Expert Instruction',
      description: 'Personalized lessons tailored to your skill level and goals',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '📝',
      title: 'Free Access to Tabs',
      description: 'Get exclusive access to all my guitar covers with detailed tabs',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: '📚',
      title: 'Step-by-Step Guidance',
      description: 'Clear, structured lessons for beginners to advanced players',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor improvement with personalized feedback and milestones',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {!showVideo ? (
            <motion.div
              key="banner"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-black/50 z-10" />
              <Image
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1"
                alt="Guitar player performing"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVideoLoaded ? 1 : 0 }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-black/30 z-10" />
              <video
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={handleVideoLoad}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/guitar-intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Master the Guitar with Professional Guidance
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl mb-8"
          >
            10 years of experience teaching students of all levels
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link href="#booking" className="btn-primary text-lg">
              Book Your First Lesson
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Add this section before the features section */}
      <section className="py-16 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative z-10">
            <div className="text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-4xl"
              >
                Ready to Start Your Musical Journey?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-xl text-gray-600"
              >
                Join our community of music enthusiasts
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            >
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:translate-x-0" />
                <div className="relative flex items-center justify-center space-x-2">
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-semibold">Login</span>
                </div>
              </motion.a>

              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg bg-white text-blue-600 shadow-xl transition-all duration-300 hover:shadow-2xl border-2 border-blue-600"
                onClick={() => {
                  // Store a flag to show registration form
                  localStorage.setItem('showRegister', 'true')
                }}
              >
                <div className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-gradient-to-r from-blue-50 to-purple-50 group-hover:translate-x-0" />
                <div className="relative flex items-center justify-center space-x-2">
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="font-semibold">Sign Up</span>
                </div>
              </motion.a>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full filter blur-3xl" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            Why Choose My Lessons?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl transform transition-transform duration-500 group-hover:scale-105" />
                <div className="relative p-8 rounded-2xl bg-white shadow-xl border border-gray-100 transform transition-all duration-500 group-hover:translate-y-[-5px]">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative -mt-16 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-full transform transition-transform duration-500 group-hover:scale-105" />
                      <div className="relative w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                        <span className="text-4xl transform transition-transform duration-500 group-hover:scale-110">
                          {feature.icon}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            Book Your Lesson
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl transform transition-transform duration-500 group-hover:scale-105" />
              <div className="relative p-8 rounded-2xl bg-white shadow-xl border border-gray-100 transform transition-all duration-500 group-hover:translate-y-[-5px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative -mt-16 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full transform transition-transform duration-500 group-hover:scale-105" />
                    <div className="relative w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                      <span className="text-4xl transform transition-transform duration-500 group-hover:scale-110">
                        🎸
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Start Your Musical Journey
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Choose your preferred time slot and begin learning with personalized guidance
                  </p>
                  <Link 
                    href="/booking" 
                    className="btn-primary text-lg transform transition-all duration-500 hover:scale-105 hover:shadow-lg"
                  >
                    View Available Slots
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 