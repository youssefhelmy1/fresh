'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import SuccessContent from './SuccessContent'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Suspense
          fallback={
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your booking...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
} 