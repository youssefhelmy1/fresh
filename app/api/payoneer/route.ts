import { NextResponse } from 'next/server'

const PAYONEER_API_URL = process.env.PAYONEER_API_URL || 'https://api.sandbox.payoneer.com/v4/programs/'
const PAYONEER_PROGRAM_ID = process.env.PAYONEER_PROGRAM_ID
const PAYONEER_USERNAME = process.env.PAYONEER_USERNAME
const PAYONEER_API_PASSWORD = process.env.PAYONEER_API_PASSWORD

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, description, customerDetails } = body

    if (!amount || !description || !customerDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create payment link using Payoneer API
    const response = await fetch(`${PAYONEER_API_URL}${PAYONEER_PROGRAM_ID}/billing/payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${PAYONEER_USERNAME}:${PAYONEER_API_PASSWORD}`).toString('base64')
      },
      body: JSON.stringify({
        amount: {
          value: amount,
          currency: 'USD'
        },
        description,
        customer: customerDetails,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payoneer/webhook`
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment link')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating Payoneer payment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing payment' },
      { status: 500 }
    )
  }
}

// Webhook handler for payment notifications
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // Verify webhook signature
    // This should be implemented based on Payoneer's webhook security requirements
    
    // Update booking status based on payment status
    if (body.status === 'COMPLETED') {
      // Update booking status to confirmed
      const bookingId = body.metadata.bookingId
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          paymentReference: body.id
        })
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
} 