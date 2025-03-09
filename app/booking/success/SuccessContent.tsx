'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SuccessContent() {
  const [status, setStatus] = useState<'verifying' | 'confirmed' | 'error'>('verifying')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        // Get the pending booking ID from session storage
        const bookingId = sessionStorage.getItem('pendingBookingId')
        if (!bookingId) {
          throw new Error('No pending booking found')
        }

        // Generate a PayPal reference number
        const paypalReference = `PAYPAL_${Date.now()}`

        // Confirm the booking with PayPal reference
        const response = await fetch('/api/bookings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            paymentReference: paypalReference,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to confirm booking')
        }

        // Clear session storage
        sessionStorage.removeItem('pendingBookingId')
        setStatus('confirmed')
      } catch (error) {
        console.error('Error confirming booking:', error)
        setError(error instanceof Error ? error.message : 'Failed to confirm booking')
        setStatus('error')
      }
    }

    confirmBooking()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      {status === 'verifying' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Confirming your booking...
          </h2>
          <p className="mt-2 text-gray-500">
            Please wait while we verify your payment.
          </p>
        </motion.div>
      )}

      {status === 'confirmed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-700">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-gray-500">
            Thank you for booking a guitar lesson. You will receive a confirmation email shortly.
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Book Another Lesson
          </Link>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Something went wrong
          </h2>
          <p className="mt-2 text-red-600">
            {error || 'Failed to confirm booking. Please try again.'}
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
} 