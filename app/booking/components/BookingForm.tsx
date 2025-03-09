'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface TimeSlot {
  id: string
  time: string
  available: boolean
  day: string
}

interface Booking {
  id: string
  day: string
  time: string
  bookedAt: string
  paymentStatus: 'pending' | 'confirmed'
  paymentMethod: 'paypal'
  paymentReference?: string
}

interface CustomerDetails {
  firstName: string
  lastName: string
  email: string
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
const PAYONEER_EMAIL = 'helmyyoussef612@gmail.com'

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingForm() {
  const [slots, setSlots] = useState<TimeSlot[]>(timeSlots)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>('Monday')
  const [showPayoneerInstructions, setShowPayoneerInstructions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  const fetchBookedSlots = useCallback(async () => {
    try {
      const response = await fetch('/api/bookings')
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const bookings: Booking[] = await response.json()
      
      // Update slots availability based on CONFIRMED bookings only
      const updatedSlots = slots.map(slot => ({
        ...slot,
        available: !bookings.some(
          booking => 
            booking.day === slot.day && 
            booking.time === slot.time && 
            booking.paymentStatus === 'confirmed'
        )
      }))
      
      setSlots(updatedSlots)

      // If selected slot is now booked (confirmed payment), clear the selection
      if (selectedSlot && !updatedSlots.find(s => 
        s.id === selectedSlot.id && s.available
      )) {
        setSelectedSlot(null)
        setShowPayoneerInstructions(false)
        setError('Sorry, this slot has just been booked by someone else. Please select another time.')
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error)
      setError('Unable to check slot availability. Please try again.')
    }
  }, [slots, selectedSlot])

  // Fetch booked slots when component mounts
  useEffect(() => {
    fetchBookedSlots()
  }, [fetchBookedSlots])

  // Refresh booking status every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchBookedSlots, 30000)
    return () => clearInterval(interval)
  }, [fetchBookedSlots])

  const handleBookSlot = async () => {
    if (!selectedSlot) return

    try {
      setLoading(true)
      setError(null)

      // Check if slot is still available before booking
      await fetchBookedSlots()
      const currentSlot = slots.find(s => s.id === selectedSlot.id)
      if (!currentSlot?.available) {
        throw new Error('This slot has just been booked. Please select another time.')
      }

      console.log('Creating pending booking:', {
        day: selectedSlot.day,
        time: selectedSlot.time,
      })

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day: selectedSlot.day,
          time: selectedSlot.time,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Booking failed:', data)
        throw new Error(data.error || 'Failed to create booking. Please try again.')
      }

      console.log('Pending booking created:', data)
      return data

    } catch (error) {
      console.error('Booking error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create booking. Please try again.'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handlePayWithPayPal = async () => {
    if (!selectedSlot) return

    try {
      setLoading(true)
      setError(null)

      // Create pending booking first
      const booking = await handleBookSlot()
      
      if (booking) {
        // Store booking ID in session storage
        sessionStorage.setItem('pendingBookingId', booking.id)
        
        // Format the description for PayPal
        const description = `Two Guitar Lessons - Starting ${selectedSlot.day} at ${selectedSlot.time}`
        
        // Construct PayPal URL - using encodeURIComponent for proper URL encoding
        const paypalUrl = `${PAYPAL_ME_LINK}/50USD?note=${encodeURIComponent(description)}`

        // Directly navigate to PayPal
        window.location.href = paypalUrl
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return
    setSelectedSlot(slot)
    setError(null)
    setShowPayoneerInstructions(false)
  }

  const filteredTimeSlots = slots.filter(slot => slot.day === selectedDay)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Day Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-6 transform perspective-1000">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Select Day
        </h3>
        <motion.div 
          className="grid grid-cols-7 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDay(day)
                setSelectedSlot(null)
                setError(null)
              }}
              className={`p-3 text-sm rounded-xl border transition-all transform hover:shadow-lg ${
                selectedDay === day
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {day.slice(0, 3)}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Time Slots */}
      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-6 transform perspective-1000"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Select Time - {selectedDay}
        </h3>
        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {filteredTimeSlots.map((slot) => (
            <motion.button
              key={slot.id}
              whileHover={{ scale: 1.05, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSlotSelect(slot)}
              disabled={!slot.available || loading}
              className={`p-4 rounded-xl border text-sm transition-all transform ${
                !slot.available
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : selectedSlot?.id === slot.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
              }`}
            >
              {slot.time}
              {!slot.available && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="block text-xs mt-1 text-red-400"
                >
                  (Booked)
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Payment Section */}
      {selectedSlot && selectedSlot.available && (
        <motion.div 
          className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl shadow-2xl text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold">Complete Your Booking</h3>
            <div className="text-lg opacity-90">
              <p>Selected Time: {selectedSlot.time}</p>
              <p>Selected Day: {selectedSlot.day}</p>
              <div className="mt-4 p-4 bg-white/10 rounded-xl">
                <p className="text-xl font-bold">Package Details:</p>
                <p className="mt-2">Two Guitar Lessons</p>
                <p className="font-bold mt-2">$25 USD per lesson</p>
                <p className="text-2xl font-bold mt-2">Total: $50 USD</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#0070BA' }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayWithPayPal}
              disabled={loading}
              className="w-full max-w-md mx-auto bg-[#0079C1] text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform font-bold text-lg"
            >
              <span className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.067 8.478c.492.315.844.825.983 1.39l.001.006c.008.037.013.074.017.112l.001.006v.001c.275 2.107-.915 4.495-3.532 4.495h-2.333c-.278 0-.513.201-.558.471l-.001.007-.001.007-.738 4.714c-.064.37-.384.638-.759.638h-2.899c-.218 0-.402-.157-.437-.371v-.001c-.01-.053-.009-.107.003-.16l.001-.007.001-.007.736-4.705c.045-.27.28-.471.558-.471h2.333c2.618 0 3.808-2.389 3.533-4.496-.004-.038-.009-.075-.017-.111l-.001-.007c-.14-.564-.491-1.074-.984-1.389-.492-.315-1.068-.41-1.627-.41h-5.559c-.278 0-.513.201-.558.471l-.001.007-.001.007-2.099 13.408c-.064.37-.384.638-.759.638h-2.899c-.218 0-.402-.157-.437-.371v-.001c-.01-.053-.009-.107.003-.16l.001-.007.001-.007 2.097-13.399c.045-.27.28-.471.558-.471h8.459c.559 0 1.135.095 1.627.41z"/>
                </svg>
                <span>
                  {loading ? 'Processing...' : 'Pay Securely with PayPal'}
                </span>
              </span>
            </motion.button>

            <motion.div 
              className="mt-6 text-sm opacity-90 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="flex items-center justify-center">
                <span className="mr-2">✨</span>
                Book Two Lessons Package
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-2">⚡</span>
                Instant Confirmation
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-2">🔒</span>
                Secure PayPal Checkout
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
} 