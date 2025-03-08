'use client'

import BookingForm from './components/BookingForm'

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Book Your Guitar Lesson</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Book a Lesson</h2>
            <p className="text-gray-600">
              Choose your preferred time slot and complete the payment to secure your lesson.
              Each lesson is 1 hour long and costs $25.
            </p>
          </div>
          
          <BookingForm />

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Important Information</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Lessons are available Monday through Saturday</li>
              <li>Each lesson is one hour long</li>
              <li>You can book up to 2 lessons per week</li>
              <li>24-hour cancellation policy applies</li>
              <li>Payment is required to confirm your booking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 