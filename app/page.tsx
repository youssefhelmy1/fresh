import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1"
            alt="Guitar player performing"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Master the Guitar with Professional Guidance
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            10 years of experience teaching students of all levels
          </p>
          <Link href="#booking" className="btn-primary text-lg">
            Book Your First Lesson
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose My Lessons?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-primary-600 text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2">Online Convenience</h3>
              <p className="text-gray-600">Learn from anywhere in the world with high-quality video lessons</p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary-600 text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Affordable Pricing</h3>
              <p className="text-gray-600">$25 per hour, with special pricing for multiple lessons</p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary-600 text-4xl mb-4">🎸</div>
              <h3 className="text-xl font-semibold mb-2">Expert Instruction</h3>
              <p className="text-gray-600">Personalized lessons tailored to your skill level and goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Book Your Lesson</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <p className="text-center text-lg mb-8">
              Choose your preferred time slot and start your musical journey today!
            </p>
            {/* Booking calendar will be integrated here */}
            <div className="text-center">
              <Link href="/booking" className="btn-primary text-lg">
                View Available Slots
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 