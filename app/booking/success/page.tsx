'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const bookingId = sessionStorage.getItem('pendingBookingId')
        if (!bookingId) {
          setStatus('failed')
          setMessage('No booking found. Please try again.')
          setTimeout(() => router.push('/booking'), 3000)
          return
        }

        // Check payment status
        const response = await fetch(`/api/verify-payment?bookingId=${bookingId}`)
        const data = await response.json()

        if (data.status === 'confirmed') {
          setStatus('success')
          setMessage('Booking confirmed! Thank you for choosing our guitar lessons.')
          // Clear the pending booking ID
          sessionStorage.removeItem('pendingBookingId')
        } else {
          setStatus('failed')
          setMessage('Payment not confirmed. Please try booking again.')
          setTimeout(() => router.push('/booking'), 3000)
        }
      } catch (error) {
        setStatus('failed')
        setMessage('An error occurred. Please try booking again.')
        setTimeout(() => router.push('/booking'), 3000)
      }
    }

    checkPayment()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {status === 'loading' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">Checking Payment Status...</h2>
            <p className="text-gray-600 mt-2">Please wait while we confirm your booking.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Booking Successful!</h2>
            <p className="text-gray-600 mt-4">{message}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/booking')}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Book Another Class
            </motion.button>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Booking Failed</h2>
            <p className="text-gray-600 mt-4">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to booking page...</p>
          </div>
        )}
      </motion.div>
    </div>
  )
} 