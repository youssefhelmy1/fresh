'use client'

import dynamic from 'next/dynamic'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'

// Import the CSS file here since we're in a client component
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

// Create the localizer outside of the component
import { dateFnsLocalizer } from 'react-big-calendar'
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Dynamically import the Calendar component with no SSR
const DynamicCalendar = dynamic(() => import('./components/DynamicCalendar'), {
  ssr: false,
  loading: () => <div>Loading calendar...</div>
})

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Book Your Guitar Lesson</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Available Time Slots</h2>
            <p className="text-gray-600">
              Select your preferred time slot. Lessons are 1 hour long and cost $25.
              You can book up to 2 lessons per week.
            </p>
          </div>
          <div className="h-[600px]">
            <DynamicCalendar localizer={localizer} />
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Booking Instructions</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Click on an available time slot to book your lesson</li>
              <li>Lessons are available Monday through Saturday</li>
              <li>Payment is required at the time of booking</li>
              <li>24-hour cancellation policy applies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 