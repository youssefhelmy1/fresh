'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

const timeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: true },
  { id: '3', time: '11:00 AM', available: true },
  { id: '4', time: '2:00 PM', available: true },
  { id: '5', time: '3:00 PM', available: true },
  { id: '6', time: '4:00 PM', available: true },
]

const PAYPAL_ME_LINK = 'https://paypal.me/yousefhelmymusic'

export default function BookingForm() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null)

  const handlePayWithStripe = async () => {
    if (!selectedSlot) return

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2500, // $25.00
          timeSlot: selectedSlot.time,
        }),
      })

      const { clientSecret } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        const { error } = await stripe.confirmPayment({
          elements: await stripe.elements({
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }),
          confirmParams: {
            return_url: `${window.location.origin}/booking/success`,
          },
        })

        if (error) {
          console.error('Payment failed:', error)
        }
      }
    } catch (err) {
      console.error('Error processing payment:', err)
    }
  }

  const handlePayWithPayPal = () => {
    // Open PayPal.me link in a new window
    window.open(`${PAYPAL_ME_LINK}/25USD?description=Guitar+Lesson+-+${encodeURIComponent(selectedSlot?.time || '')}`, '_blank')
    // Redirect to success page
    window.location.href = '/booking/success'
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select a Time Slot</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              className={`p-4 rounded-lg border ${
                selectedSlot?.id === slot.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <div>
          <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
          <div className="space-y-4">
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`w-full p-4 rounded-lg border ${
                paymentMethod === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
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
              className={`w-full p-4 rounded-lg border flex items-center justify-center ${
                paymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
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

      {selectedSlot && paymentMethod === 'stripe' && (
        <button
          onClick={handlePayWithStripe}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
        >
          Pay $25.00
        </button>
      )}
    </div>
  )
} 