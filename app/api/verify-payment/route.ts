import { NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  try {
    const { payment_intent } = await request.json()

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful
      return NextResponse.json({
        success: true,
        payment: {
          amount: paymentIntent.amount / 100, // Convert from cents to dollars
          description: paymentIntent.metadata.timeSlot,
          date: new Date(paymentIntent.created * 1000).toLocaleString(),
        },
      })
    } else {
      // Payment failed or is pending
      return NextResponse.json({
        success: false,
        error: 'Payment has not been completed',
      })
    }
  } catch (err) {
    console.error('Error verifying payment:', err)
    return NextResponse.json(
      { error: 'Error verifying payment' },
      { status: 500 }
    )
  }
} 