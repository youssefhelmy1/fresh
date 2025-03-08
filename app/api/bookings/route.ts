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

// Helper function to read bookings
function getBookings() {
  const bookings = fs.readFileSync(BOOKINGS_FILE, 'utf-8')
  return JSON.parse(bookings)
}

// Helper function to write bookings
function saveBookings(bookings: any[]) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
}

export async function GET() {
  try {
    const bookings = getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { day, time } = await request.json()
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
    saveBookings(bookings)

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Error creating booking' },
      { status: 500 }
    )
  }
} 