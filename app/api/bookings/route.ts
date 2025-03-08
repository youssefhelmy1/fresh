import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'))
}

// Initialize bookings file if it doesn't exist
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]))
}

// Helper function to read bookings with file lock
function getBookings() {
  try {
    const bookings = fs.readFileSync(BOOKINGS_FILE, 'utf-8')
    return JSON.parse(bookings)
  } catch (error) {
    console.error('Error reading bookings file:', error)
    return []
  }
}

// Helper function to write bookings with file lock
function saveBookings(bookings: any[]) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
    return true
  } catch (error) {
    console.error('Error writing bookings file:', error)
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

export async function GET() {
  try {
    const bookings = getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Error fetching bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { day, time } = await request.json()

    // Validate request
    const validationError = validateBookingRequest(day, time)
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }

    // Get current bookings with file lock
    const bookings = getBookings()

    // Check if slot is already booked
    const isBooked = bookings.some(
      (booking: any) => booking.day === day && booking.time === time
    )

    if (isBooked) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Add new booking
    const newBooking = {
      id: Date.now().toString(),
      day,
      time,
      bookedAt: new Date().toISOString(),
    }
    bookings.push(newBooking)

    // Save with file lock
    const saved = saveBookings(bookings)
    if (!saved) {
      throw new Error('Failed to save booking')
    }

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Error creating booking' },
      { status: 500 }
    )
  }
} 