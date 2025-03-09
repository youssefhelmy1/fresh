import { NextResponse } from 'next/server'
import { Headers } from 'next/dist/compiled/@edge-runtime/primitives'

const PAYONEER_API_URL = 'https://api.payoneer.com/v2/billing-services'
const PAYONEER_API_KEY = process.env.PAYONEER_API_KEY
const PAYONEER_ACCOUNT_ID = process.env.PAYONEER_ACCOUNT_ID

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, description, customerDetails, metadata } = body

    if (!amount || !description || !customerDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create payment using Payoneer's Billing Service API
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PAYONEER_API_KEY}`,
      'Account-Id': PAYONEER_ACCOUNT_ID || ''
    })

    const response = await fetch(`${PAYONEER_API_URL}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: {
          value: amount,
          currency: 'USD'
        },
        description,
        customer: {
          email: customerDetails.email,
          name: `${customerDetails.firstName} ${customerDetails.lastName}`
        },
        payment_method: {
          type: 'card'
        },
        redirect_urls: {
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success`,
          failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/error`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking`
        },
        metadata: {
          bookingId: metadata.bookingId,
          lessonDay: metadata.day,
          lessonTime: metadata.time
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment')
    }

    return NextResponse.json({
      payment_url: data.redirect_url,
      id: data.id,
      status: data.status
    })
  } catch (error) {
    console.error('Error creating Payoneer payment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing payment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { paymentId } = body

    // Verify payment status with Payoneer
    const headers = new Headers({
      'Authorization': `Bearer ${PAYONEER_API_KEY}`,
      'Account-Id': PAYONEER_ACCOUNT_ID || ''
    })

    const response = await fetch(`${PAYONEER_API_URL}/payments/${paymentId}`, {
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment')
    }

    // If payment is successful, update booking status
    if (data.status === 'COMPLETED') {
      const bookingId = data.metadata.bookingId
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          paymentReference: data.id
        })
      })
    }

    return NextResponse.json({ 
      success: true,
      status: data.status,
      payment: data
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error verifying payment' },
      { status: 500 }
    )
  }
} 