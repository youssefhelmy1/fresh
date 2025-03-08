'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

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

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
        payment_method_data: {
          billing_details: {
            name: 'Yousef Helmy',
            email: 'contact@yousefhelmy.com',
            address: {
              country: 'BH',
            },
          },
        },
      },
    })

    if (submitError) {
      setError(submitError.message || 'An error occurred')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <PaymentElement />
      </div>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 mt-4 disabled:opacity-50 text-lg font-medium transition-colors"
      >
        {processing ? 'Processing...' : 'Pay $25.00'}
      </button>
    </form>
  )
}

export default function BookingForm() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>('Monday')

  useEffect(() => {
    if (selectedSlot && paymentMethod === 'stripe') {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2500, // $25.00
          timeSlot: `${selectedSlot.day} at ${selectedSlot.time}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error('Error:', err))
    }
  }, [selectedSlot, paymentMethod])

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
              onClick={() => setPaymentMethod('stripe')}
              className={`w-full p-4 rounded-lg border transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-blue-500 bg-white shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">Pay with Card</span>
                <span className="text-sm text-gray-500">(Visa/Mastercard)</span>
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
        </div>
      )}

      {/* Stripe Payment Form */}
      {selectedSlot && paymentMethod === 'stripe' && clientSecret && (
        <div className="mt-6">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  )
} 