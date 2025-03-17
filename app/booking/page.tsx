'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface LessonType {
  id: string;
  name: string;
  description: string;
  price: number;
}

const lessonTypes: LessonType[] = [
  {
    id: 'beginner',
    name: 'Beginner Lesson',
    description: 'Perfect for those just starting out with guitar',
    price: 30
  },
  {
    id: 'intermediate',
    name: 'Intermediate Lesson',
    description: 'For players with some experience looking to improve',
    price: 40
  },
  {
    id: 'advanced',
    name: 'Advanced Lesson',
    description: 'For experienced players wanting to master complex techniques',
    price: 50
  }
];

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLessonType, setSelectedLessonType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Available time slots
  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Generate dates for the next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    return date;
  });

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!authToken || !userData) {
      // Store the current location to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/booking');
      router.push('/auth');
    }
  }, [router]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedLessonType) {
      setError('Please select a date, time, and lesson type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authToken = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!authToken || !userData.id) {
        throw new Error('You must be logged in to book a lesson');
      }

      // Format the date and time for the API
      const lessonDate = new Date(selectedDate);
      const [hours, minutes, period] = selectedTime.split(/:| /);
      let hour = parseInt(hours);
      
      // Convert to 24-hour format
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      lessonDate.setHours(hour, parseInt(minutes) || 0, 0, 0);
      
      const response = await fetch('/api/user-bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          lesson_date: lessonDate.toISOString(),
          lesson_type: selectedLessonType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book lesson');
      }

      // Show success message and reset form
      setSuccess(true);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedLessonType(null);
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while booking your lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Book a Lesson</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/profile')}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md font-medium text-sm"
              >
                View My Bookings
              </motion.button>
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="px-6 py-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
              >
                <p className="font-medium">Lesson booked successfully!</p>
                <p className="text-sm mt-1">Redirecting to your profile...</p>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                <div className="space-y-6">
                  {/* Lesson Type Selection */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Select Lesson Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {lessonTypes.map((type) => (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedLessonType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedLessonType(type.id)}
                        >
                          <h3 className="font-medium text-gray-900">{type.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                          <p className="text-blue-600 font-medium mt-2">${type.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Date Selection */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Select Date</h2>
                    <div className="flex overflow-x-auto pb-2 space-x-2">
                      {availableDates.map((date) => (
                        <motion.div
                          key={date.toISOString()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 border rounded-lg cursor-pointer flex-shrink-0 text-center min-w-[80px] ${
                            selectedDate && date.toDateString() === selectedDate.toDateString()
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <p className="text-sm font-medium">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className="text-lg font-bold">{date.getDate()}</p>
                          <p className="text-xs text-gray-500">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time Selection */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Select Time</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <motion.button
                            key={time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 border rounded-lg ${
                              selectedTime === time
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300 text-gray-700'
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Booking Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedDate || !selectedTime || !selectedLessonType || loading}
                    onClick={handleBooking}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Book Lesson'}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 