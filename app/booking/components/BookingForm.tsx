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

interface PaymentOption {
  type: 'single' | 'bundle'
  amount: number
  quantity?: number
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
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<PaymentOption>({ 
    type: 'single', 
    amount: 25,
    quantity: 1 
  })

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
        
        // Redirect to PayPal
        window.location.href = `${PAYPAL_ME_LINK}/${selectedPaymentOption.amount}`
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

  const handleQuantityChange = (quantity: number) => {
    if (selectedPaymentOption.type === 'single') {
      setSelectedPaymentOption({
        type: 'single',
        amount: 25 * quantity,
        quantity
      })
    }
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
              
              {/* Package Selection */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Single Class Option */}
                <div
                  className={`p-4 rounded-xl transition-all ${
                    selectedPaymentOption.type === 'single'
                      ? 'bg-white/20 border-2 border-white'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <button
                    onClick={() => setSelectedPaymentOption({ 
                      type: 'single', 
                      amount: 25 * (selectedPaymentOption?.quantity || 1), 
                      quantity: selectedPaymentOption?.quantity || 1 
                    })}
                    className="w-full text-left"
                  >
                    <h4 className="text-xl font-bold">Single Class</h4>
                    <p className="text-2xl font-bold mt-2">
                      ${selectedPaymentOption.type === 'single' ? selectedPaymentOption.amount : 25}
                    </p>
                    <p className="text-sm mt-1 opacity-80">1-hour lesson</p>
                  </button>
                  
                  {selectedPaymentOption.type === 'single' && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <label className="text-sm font-medium">Number of Classes:</label>
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => handleQuantityChange(Math.max(1, (selectedPaymentOption?.quantity || 1) - 1))}
                          className="bg-white/20 hover:bg-white/30 w-8 h-8 rounded-lg flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-lg font-bold w-8 text-center">
                          {selectedPaymentOption?.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange((selectedPaymentOption?.quantity || 1) + 1)}
                          className="bg-white/20 hover:bg-white/30 w-8 h-8 rounded-lg flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bundle Option */}
                <button
                  onClick={() => setSelectedPaymentOption({ type: 'bundle', amount: 199.90 })}
                  className={`p-4 rounded-xl transition-all relative overflow-hidden ${
                    selectedPaymentOption.type === 'bundle'
                      ? 'bg-white/20 border-2 border-white'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div className="absolute top-2 right-2 transform rotate-12 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded">
                    SAVE $100!
                  </div>
                  <h4 className="text-xl font-bold">Bundle Package</h4>
                  <p className="text-2xl font-bold mt-2">$199.90</p>
                  <p className="text-sm mt-1 opacity-80">12 one-hour lessons</p>
                  <p className="text-sm mt-2 bg-white/20 rounded-lg p-2">
                    Only $16.66 per class!
                  </p>
                </button>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <p className="text-xl font-bold">Selected Package:</p>
                {selectedPaymentOption.type === 'single' ? (
                  <>
                    <p className="mt-2">
                      Single Guitar Lesson 
                      {selectedPaymentOption?.quantity && selectedPaymentOption.quantity > 1 
                        ? ` (${selectedPaymentOption.quantity} classes)` 
                        : ''
                      }
                    </p>
                    <p className="font-bold mt-2">Total: ${selectedPaymentOption.amount} USD</p>
                    {selectedPaymentOption?.quantity && selectedPaymentOption.quantity > 1 && (
                      <p className="text-sm mt-1 opacity-80">(${25} per class)</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mt-2">12 Guitar Lessons Bundle</p>
                    <p className="font-bold mt-2">Total: $199.90 USD</p>
                    <p className="text-sm mt-1 opacity-80">(Save $100 compared to single classes!)</p>
                    <div className="mt-3 bg-yellow-400/20 p-3 rounded-lg">
                      <p className="text-sm font-bold text-yellow-200">
                        🌟 Best Value! Take up to 4 classes per week
                      </p>
                      <p className="text-sm mt-2 text-yellow-200">
                        ✨ Schedule your classes flexibly within 3 months
                      </p>
                    </div>
                  </>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-lg font-bold mb-2">Payment Instructions:</p>
                  <p className="text-sm mb-4">Click the PayPal button below to proceed with payment</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="px-4 text-sm text-gray-500">or</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handlePayWithPayPal}
                      className="w-full flex items-center justify-center space-x-2 bg-[#0070BA] hover:bg-[#005ea6] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.72a.641.641 0 0 1 .633-.54h5.833c3.720 0 5.341 2.198 5.341 5.828 0 3.63-1.621 5.828-5.341 5.828h-2.364l-1.994 8.451zm2.055-9.923h1.677c1.863 0 2.67-1.185 2.67-2.914 0-1.73-.807-2.914-2.67-2.914h-1.677l-.8 5.828z"/>
                      </svg>
                      <span className="text-lg">Pay with PayPal</span>
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      You'll be redirected to PayPal to complete your payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="mt-6 text-sm opacity-90 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {selectedPaymentOption.type === 'bundle' ? (
                <>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">💎</span>
                    12 Lessons Bundle - Save $100!
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">🎯</span>
                    Up to 4 classes per week
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">⭐</span>
                    Only $16.66 per lesson
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">✨</span>
                    Single Guitar Lesson
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">⚡</span>
                    Instant Confirmation
                  </p>
                </>
              )}
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