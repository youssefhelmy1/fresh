import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!process.env.CHECKOUT_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Payment provider is not configured' },
      { status: 500 }
    )
  }

  try {
    const { amount, timeSlot } = await request.json()

    // Create a payment session with Checkout.com
    const response = await fetch('https://api.checkout.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.CHECKOUT_SECRET_KEY,
      },
      body: JSON.stringify({
        source: {
          type: 'hosted',
        },
        amount: amount,
        currency: 'USD',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success`,
        failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/error`,
        payment_type: 'Regular',
        merchant_initiated: false,
        description: `Guitar Lesson - ${timeSlot}`,
        customer: {
          name: 'Guitar Student',
          email: '',
        },
        billing: {
          address: {
            country: 'BH',
          },
        },
        processing: {
          preferred_scheme: '',
          purpose: 'Guitar Lesson Payment',
        },
        metadata: {
          timeSlot,
        },
        '3ds': {
          enabled: true,
        },
        risk: {
          enabled: true,
        },
      }),
    })

    const data = await response.json()

    if (data.hosted_url) {
      return NextResponse.json({ url: data.hosted_url })
    } else {
      throw new Error('Failed to create payment session')
    }
  } catch (err) {
    console.error('Error creating payment session:', err)
    return NextResponse.json(
      { error: 'Error creating payment session' },
      { status: 500 }
    )
  }
} 