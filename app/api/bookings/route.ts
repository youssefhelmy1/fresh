import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

// Helper function to ensure data directory and file exist
async function ensureDataStructures() {
  try {
    // Check if data directory exists, create if it doesn't
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }

    // Check if bookings file exists, create if it doesn't
    try {
      await fs.access(BOOKINGS_FILE)
    } catch {
      await fs.writeFile(BOOKINGS_FILE, '[]')
    }

    return true
  } catch (error) {
    console.error('Error ensuring data structures:', error)
    return false
  }
}

// Helper function to read bookings
async function getBookings() {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  }
}

// Helper function to write bookings
async function saveBookings(bookings: any[]) {
  try {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
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

export async function GET() {
  try {
    await ensureDataStructures()
    const bookings = await getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error in GET /api/bookings:', error)
    return NextResponse.json(
      { error: 'Error fetching bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Ensure data structures exist
    const structuresReady = await ensureDataStructures()
    if (!structuresReady) {
      throw new Error('Could not initialize data structures')
    }

    // Parse request body
    const body = await request.json()
    console.log('Received booking request:', body)

    const { day, time } = body
    if (!day || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: day and time' },
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

    // Save bookings
    const saved = await saveBookings(bookings)
    if (!saved) {
      throw new Error('Failed to save booking')
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