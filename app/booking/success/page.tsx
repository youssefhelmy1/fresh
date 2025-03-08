'use client'

import Link from 'next/link'

export default function SuccessPage() {
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
            Booking Initiated!
          </h1>
          
          <div className="text-lg text-gray-600 mb-8 space-y-4">
            <p>
              Thank you for booking your guitar lesson. If you paid with a credit card,
              your booking is confirmed and you'll receive an email with the details.
            </p>
            <p>
              If you chose PayPal, please complete your payment in the PayPal window.
              Once the payment is complete, your booking will be confirmed.
            </p>
            <p className="text-sm">
              Note: If you don't see the PayPal window, please check if it was blocked by your browser.
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