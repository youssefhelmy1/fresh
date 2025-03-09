import { Metadata } from 'next'
import SuccessContent from './SuccessContent'

export const metadata: Metadata = {
  title: 'Booking Successful - Guitar Lessons',
  description: 'Your guitar lesson booking has been confirmed.',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <SuccessContent />
      </div>
    </div>
  )
} 