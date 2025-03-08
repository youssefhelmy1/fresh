'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SuccessContent() {
  const [status, setStatus] = useState<'verifying' | 'confirmed' | 'error'>('verifying')
  const [paymentReference, setPaymentReference] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        // Get the pending booking ID from session storage
        const bookingId = sessionStorage.getItem('pendingBookingId')
        if (!bookingId) {
          throw new Error('No pending booking found')
        }

        // Get payment reference from user
        const reference = window.prompt('Please enter your payment reference number or transaction ID:')
        if (!reference) {
          throw new Error('Payment reference is required')
        }
        setPaymentReference(reference)

        // Confirm the payment
        const response = await fetch('/api/bookings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            paymentReference: reference,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to confirm payment')
        }

        // Clear the pending booking ID
        sessionStorage.removeItem('pendingBookingId')
        setStatus('confirmed')
      } catch (error) {
        console.error('Error confirming payment:', error)
        setError(error instanceof Error ? error.message : 'Failed to confirm payment')
        setStatus('error')
      }
    }

    confirmBooking()
  }, [])

  if (status === 'verifying') {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
        <p className="text-gray-600">Please wait while we confirm your payment...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/booking"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Booking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-2">Your payment has been verified.</p>
        <p className="text-gray-600 mb-6">Payment Reference: {paymentReference}</p>
        <div className="space-y-3">
          <Link 
            href="/dashboard"
            className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View My Bookings
          </Link>
          <Link 
            href="/booking"
            className="block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Book Another Lesson
          </Link>
        </div>
      </div>
    </div>
  )
} 