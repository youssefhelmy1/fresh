'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'

interface Booking {
  id: number
  lesson_date: string
  lesson_type: string
  status: string
}

interface UserData {
  id: number
  name: string
  email: string
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage and token from cookies
    const storedUserData = localStorage.getItem('userData')
    const authToken = Cookies.get('auth_token')

    if (!storedUserData || !authToken) {
      router.push('/auth')
      return
    }

    try {
      const parsedUserData = JSON.parse(storedUserData)
      setUserData(parsedUserData)

      // Fetch user bookings
      fetchBookings(parsedUserData.id, authToken)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/auth')
    }
  }, [router])

  const fetchBookings = async (userId: number, token: string) => {
    try {
      const response = await fetch(`/api/user-bookings?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        console.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Remove both localStorage items and cookies
    localStorage.removeItem('userData')
    localStorage.removeItem('authToken')
    Cookies.remove('auth_token', { path: '/' })
    
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md font-medium text-sm"
              >
                Logout
              </motion.button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            {userData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg font-medium">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium">{userData.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bookings */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>

            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lesson Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.lesson_date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.lesson_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any bookings yet.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/booking')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md font-medium text-sm"
                >
                  Book a Lesson
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 