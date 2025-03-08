import { NextResponse } from 'next/server'

const PAYONEER_API_URL = 'https://api.payoneer.com'

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

    // Instead of creating a payment link, we'll return the Payoneer recipient registration link
    const registrationLink = `https://payouts.sandbox.payoneer.com/partners/lp.aspx?pid=${process.env.PAYONEER_PROGRAM_ID}&langid=92&email=${encodeURIComponent(customerDetails.email)}&firstname=${encodeURIComponent(customerDetails.firstName)}&lastname=${encodeURIComponent(customerDetails.lastName)}&amount=${amount}&desc=${encodeURIComponent(description)}`

    // For development/testing, we'll simulate a successful payment link creation
    return NextResponse.json({
      payment_url: registrationLink,
      id: `TEST_${Date.now()}`,
      status: 'CREATED'
    })
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
    
    // For development/testing, we'll auto-confirm the payment
    const bookingId = body.metadata?.bookingId
    if (bookingId) {
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          paymentReference: `TEST_${Date.now()}`
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