'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent')
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret')

    if (payment_intent) {
      // Verify the payment with your backend
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent,
          payment_intent_client_secret,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus('success')
            setPaymentDetails(data.payment)
          } else {
            setStatus('error')
          }
        })
        .catch(() => setStatus('error'))
    } else {
      // PayPal payment
      setStatus('success')
    }
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              There was an issue processing your payment. Please try again or contact support.
            </p>

            <div className="space-y-4">
              <Link
                href="/booking"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </Link>
              
              <Link
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          
          <div className="text-lg text-gray-600 mb-8 space-y-4">
            <p>
              Thank you for booking your guitar lesson. Your payment has been processed successfully.
            </p>
            {paymentDetails && (
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <p className="font-medium">Lesson Details:</p>
                <p>{paymentDetails.description}</p>
              </div>
            )}
            <p>
              You will receive a confirmation email shortly with all the details.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
            >
              Return to Home
            </Link>
            
            <Link
              href="/booking"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200"
            >
              Book Another Lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 