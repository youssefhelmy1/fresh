import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { RowDataPacket } from 'mysql2/promise'

// Use system temp directory instead of project directory
const DATA_DIR = path.join(os.tmpdir(), 'guitar-lessons')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

interface Booking {
  id: string
  day: string
  time: string
  bookedAt: string
  paymentStatus: 'pending' | 'confirmed'
  paymentMethod: 'paypal' | 'payoneer'
  paymentReference?: string
}

// Helper function to ensure data directory and file exist
async function ensureDataStructures() {
  try {
    // Check if data directory exists, create if it doesn't
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
      console.log('Created data directory:', DATA_DIR)
    }

    // Check if bookings file exists, create if it doesn't
    try {
      await fs.access(BOOKINGS_FILE)
    } catch {
      await fs.writeFile(BOOKINGS_FILE, '[]', { mode: 0o666 })
      console.log('Created bookings file:', BOOKINGS_FILE)
    }

    // Verify we can read and write
    await fs.access(BOOKINGS_FILE, fs.constants.R_OK | fs.constants.W_OK)
    console.log('Verified read/write access to bookings file')

    return true
  } catch (error) {
    console.error('Error ensuring data structures:', error)
    return false
  }
}

// Helper function to read bookings
async function getBookings() {
  try {
    await ensureDataStructures()
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8')
    return JSON.parse(data || '[]')
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  }
}

// Helper function to write bookings
async function saveBookings(bookings: any[]) {
  try {
    await ensureDataStructures()
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), {
      mode: 0o666, // Read/write for everyone
      flag: 'w'    // Open for writing, create if doesn't exist
    })
    console.log('Successfully saved bookings')
    return true
  } catch (error) {
    console.error('Error writing bookings:', error)
    return false
  }
}

// Validate booking request
function validateBookingRequest(day: string, time: string) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  if (!days.includes(day)) {
    return 'Invalid day selected'
  }

  // Validate time format and range (1 PM to 12 AM)
  const timeRegex = /^(1[0-2]|[1-9]):00 [AP]M$/
  if (!timeRegex.test(time)) {
    return 'Invalid time format'
  }

  const [hourStr, period] = time.split(':00 ')
  const hour = parseInt(hourStr)
  if (period === 'PM' && (hour < 1 || hour > 12)) {
    return 'Time must be between 1 PM and 12 AM'
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1]
    
    // Verify the token
    const payload = verifyToken(token)
    
    // Get the user ID from the query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    // Ensure the user ID matches the token
    if (!userId || parseInt(userId) !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Fetch the user's bookings
    const bookings = await db.query<RowDataPacket[]>(
      `SELECT * FROM bookings WHERE user_id = ? ORDER BY lesson_date DESC`,
      [userId]
    )
    
    // Return the bookings
    return NextResponse.json({
      bookings
    })
    
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    console.log('Received booking request:', body)

    const { day, time, paymentMethod, paymentReference } = body
    if (!day || !time || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: day, time, and paymentMethod' },
        { status: 400 }
      )
    }

    // Validate request
    const validationError = validateBookingRequest(day, time)
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }

    // Get current bookings
    const bookings = await getBookings()
    console.log('Current bookings:', bookings)

    // Check if slot is already booked (only consider confirmed bookings)
    const isBooked = bookings.some(
      (booking: Booking) => 
        booking.day === day && 
        booking.time === time && 
        booking.paymentStatus === 'confirmed'
    )

    if (isBooked) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Add new booking with pending status
    const newBooking: Booking = {
      id: Date.now().toString(),
      day,
      time,
      bookedAt: new Date().toISOString(),
      paymentStatus: 'pending',
      paymentMethod,
      paymentReference
    }
    bookings.push(newBooking)

    // Save bookings
    const saved = await saveBookings(bookings)
    if (!saved) {
      throw new Error('Failed to save booking - check server logs for details')
    }

    console.log('Successfully created booking:', newBooking)
    return NextResponse.json(newBooking)
  } catch (error) {
    console.error('Error in POST /api/bookings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating booking' },
      { status: 500 }
    )
  }
}

// New endpoint to confirm payment
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, paymentReference } = body

    if (!bookingId || !paymentReference) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId and paymentReference' },
        { status: 400 }
      )
    }

    const bookings = await getBookings()
    const bookingIndex = bookings.findIndex((b: Booking) => b.id === bookingId)

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking status to confirmed
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      paymentStatus: 'confirmed',
      paymentReference
    }

    const saved = await saveBookings(bookings)
    if (!saved) {
      throw new Error('Failed to update booking status')
    }

    return NextResponse.json(bookings[bookingIndex])
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error confirming payment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing required field: bookingId' },
        { status: 400 }
      )
    }

    const bookings = await getBookings()
    const bookingIndex = bookings.findIndex((b: Booking) => b.id === bookingId)

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of pending bookings
    if (bookings[bookingIndex].paymentStatus === 'confirmed') {
      return NextResponse.json(
        { error: 'Cannot delete confirmed bookings' },
        { status: 400 }
      )
    }

    // Remove the booking
    bookings.splice(bookingIndex, 1)

    const saved = await saveBookings(bookings)
    if (!saved) {
      throw new Error('Failed to delete booking')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error deleting booking' },
      { status: 500 }
    )
  }
} 