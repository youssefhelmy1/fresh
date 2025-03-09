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

    setLoading(true)
    const booking = await handleBookSlot()
    
    if (booking) {
      sessionStorage.setItem('pendingBookingId', booking.id)
      window.open(
        `${PAYPAL_ME_LINK}/25USD?description=Guitar+Lesson+-+${selectedSlot.day}+at+${encodeURIComponent(selectedSlot.time)}`,
        '_blank'
      )
      window.location.href = '/booking/success'
    }
    setLoading(false)
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
              <p className="font-bold mt-2">Price: $25 USD</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayWithPayPal}
              disabled={loading}
              className="w-full max-w-md mx-auto bg-white text-blue-600 py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center space-x-3">
                <img 
                  src="/paypal-logo.jpg" 
                  alt="PayPal" 
                  className="h-6"
                />
                <span className="font-bold">
                  {loading ? 'Processing...' : 'Pay with PayPal'}
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
                Secure payment processing
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-2">⚡</span>
                Instant confirmation
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-2">🔒</span>
                100% secure checkout
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
} 