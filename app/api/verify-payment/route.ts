import { NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function POST(request: Request) {
  try {
    const { payment_intent } = await request.json()

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        payment: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          description: paymentIntent.description,
          status: paymentIntent.status,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `Payment status is ${paymentIntent.status}`,
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error verifying payment' },
      { status: 500 }
    )
  }
} 