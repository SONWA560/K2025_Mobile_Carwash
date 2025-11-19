import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId, contractId, customerEmail } = await request.json()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'zar',
      metadata: {
        bookingId: bookingId || '',
        contractId: contractId || '',
        customerEmail
      },
      receipt_email: customerEmail,
    })

    // Save payment record to database
    await prisma.payment.create({
      data: {
        userId: 'temp-user-id', // This would come from authentication
        bookingId: bookingId || null,
        contractId: contractId || null,
        amount,
        currency: 'ZAR',
        status: 'PENDING',
        paymentMethod: 'stripe',
        transactionId: paymentIntent.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}