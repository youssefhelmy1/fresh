import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

// Use system temp directory instead of project directory
const DATA_DIR = path.join(os.tmpdir(), 'guitar-lessons')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

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

export async function GET() {
  try {
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