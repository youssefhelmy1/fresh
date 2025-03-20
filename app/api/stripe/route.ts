import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Guitar Lesson',
              description: description,
            },
            unit_amount: amount * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking`,
      customer_email: customerDetails.email,
      metadata: {
        bookingId: metadata.bookingId,
        lessonDay: metadata.day,
        lessonTime: metadata.time,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`
      },
    })

    return NextResponse.json({
      payment_url: session.url,
      id: session.id,
      status: session.status
    })
  } catch (error) {
    console.error('Error creating Stripe session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing payment' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      throw new Error('No session ID provided')
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    })

    if (session.payment_status === 'paid') {
      // Update booking status
      const bookingId = session.metadata?.bookingId
      if (bookingId) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            paymentReference: session.payment_intent as string
          })
        })
      }
    }

    return NextResponse.json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      payment_intent: session.payment_intent
    })
  } catch (error) {
    console.error('Error verifying Stripe session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error verifying payment' },
      { status: 500 }
    )
  }
} 