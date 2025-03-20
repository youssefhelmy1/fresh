'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken')
    setIsLoggedIn(!!authToken)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const features = [
    {
      title: 'Personalized Lessons',
      description: 'Lessons tailored to your skill level and musical interests',
      icon: '🎸'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book lessons at times that work for your schedule',
      icon: '📅'
    },
    {
      title: 'Progress Tracking',
      description: 'Track your improvement and set achievable goals',
      icon: '📈'
    },
    {
      title: 'Online & In-Person',
      description: 'Choose between virtual or face-to-face lessons',
      icon: '💻'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'I went from never touching a guitar to playing my favorite songs in just a few months!',
      image: '/images/testimonial1.jpg'
    },
    {
      name: 'Michael Chen',
      text: 'The instructor\'s patience and expertise made learning guitar enjoyable and less intimidating.',
      image: '/images/testimonial2.jpg'
    },
    {
      name: 'Emma Rodriguez',
      text: 'The flexible scheduling allowed me to fit lessons into my busy work schedule.',
      image: '/images/testimonial3.jpg'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/guitar-hero.jpg')] bg-cover bg-center mix-blend-overlay z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Master the Guitar with Professional Lessons</h1>
            <p className="text-xl md:text-2xl mb-8">
              Whether you're a beginner or looking to refine your skills, our personalized lessons will help you achieve your musical goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={isLoggedIn ? "/booking" : "/auth"} className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                  {isLoggedIn ? "Book a Lesson" : "Get Started"}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/lessons" className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                  Explore Lessons
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Guitar Lessons?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive learning experience tailored to your needs and goals.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
            <p className="text-xl mb-8">
              Join our community of guitar enthusiasts and take your skills to the next level.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={isLoggedIn ? "/booking" : "/auth"} className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                {isLoggedIn ? "Book Your First Lesson" : "Sign Up Now"}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who have transformed their guitar playing with our lessons.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                    {/* Placeholder for testimonial images */}
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
} 