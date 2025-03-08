'use client'

import { useState } from 'react'

interface TimeSlot {
  id: string
  time: string
  available: boolean
  day: string
}

// Generate time slots for each day
const generateTimeSlots = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const slots: TimeSlot[] = []
  let id = 1

  days.forEach(day => {
    // Generate slots from 1 PM to 12 AM
    for (let hour = 13; hour <= 24; hour++) {
      slots.push({
        id: String(id++),
        time: `${hour === 24 ? '12' : hour === 12 ? '12' : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        available: true,
        day: day
      })
    }
  })

  return slots
}

const timeSlots = generateTimeSlots()

const PAYPAL_ME_LINK = 'https://paypal.me/yousefhelmymusic'
const PAYONEER_EMAIL = 'your.payoneer.email@example.com' // Replace with your Payoneer email

export default function BookingForm() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'payoneer' | 'paypal' | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>('Monday')
  const [showPayoneerInstructions, setShowPayoneerInstructions] = useState(false)

  const handlePayWithPayoneer = () => {
    if (!selectedSlot) return
    setShowPayoneerInstructions(true)
  }

  const handlePayWithPayPal = () => {
    if (!selectedSlot) return
    // Open PayPal.me link in a new window
    window.open(
      `${PAYPAL_ME_LINK}/25USD?description=Guitar+Lesson+-+${selectedSlot.day}+at+${encodeURIComponent(selectedSlot.time)}`,
      '_blank'
    )
    // Redirect to success page
    window.location.href = '/booking/success'
  }

  const filteredTimeSlots = timeSlots.filter(slot => slot.day === selectedDay)

  return (
    <div className="space-y-8">
      {/* Day Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Day</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                selectedDay === day
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Time - {selectedDay}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {filteredTimeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              className={`p-3 rounded-lg border text-sm transition-all transform hover:scale-105 ${
                selectedSlot?.id === slot.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      {selectedSlot && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
          <div className="space-y-4">
            <button
              onClick={() => {
                setPaymentMethod('payoneer')
                handlePayWithPayoneer()
              }}
              className={`w-full p-4 rounded-lg border transition-colors ${
                paymentMethod === 'payoneer'
                  ? 'border-blue-500 bg-white shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="flex items-center justify-center">
                <img 
                  src="/payoneer-logo.png" 
                  alt="Payoneer" 
                  className="h-6 mr-2"
                />
                <span>Pay with Payoneer</span>
              </span>
              <span className="text-sm text-gray-500 block mt-1">
                (Preferred payment method)
              </span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('paypal')
                handlePayWithPayPal()
              }}
              className={`w-full p-4 rounded-lg border flex items-center justify-center transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-blue-500 bg-white shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="flex items-center justify-center">
                <img 
                  src="/paypal-logo.png" 
                  alt="PayPal" 
                  className="h-6 mr-2"
                />
                <span>Pay with PayPal</span>
              </span>
            </button>
          </div>

          {showPayoneerInstructions && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-lg mb-3">Payoneer Payment Instructions</h4>
              <div className="space-y-3 text-gray-600">
                <p>Please follow these steps to complete your payment:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Log in to your Payoneer account</li>
                  <li>Select "Make a Payment"</li>
                  <li>Enter the following email: <span className="font-medium text-gray-800">{PAYONEER_EMAIL}</span></li>
                  <li>Enter the amount: <span className="font-medium text-gray-800">$25.00 USD</span></li>
                  <li>In the description, enter: <span className="font-medium text-gray-800">Guitar Lesson - {selectedSlot.day} at {selectedSlot.time}</span></li>
                </ol>
                <div className="mt-4 text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p>⚠️ Important: After making the payment, please take a screenshot or note down the payment reference number.</p>
                </div>
                <button
                  onClick={() => window.location.href = '/booking/success'}
                  className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
                >
                  I've Completed the Payment
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <p>✓ Secure payment processing</p>
            <p>✓ Instant confirmation</p>
            <p>✓ Multiple payment options available</p>
          </div>
        </div>
      )}
    </div>
  )
} 