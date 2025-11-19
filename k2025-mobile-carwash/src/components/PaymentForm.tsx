'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

interface PaymentFormProps {
  amount: number
  bookingId?: string
  contractId?: string
  customerEmail: string
  description: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function PaymentForm({
  amount,
  bookingId,
  contractId,
  customerEmail,
  description,
  onSuccess,
  onError
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          bookingId,
          contractId,
          customerEmail,
        }),
      })

      const { clientSecret, paymentIntentId } = await response.json()

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?payment_intent=${paymentIntentId}`,
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Secure Payment
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
          <Shield className="h-4 w-4" />
          <span>Secured by Stripe</span>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span>Amount:</span>
            <span className="font-semibold">R{amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Payment Method:</span>
            <span>Credit/Debit Card</span>
          </div>
        </div>

        {/* Accepted Cards */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">We accept:</p>
          <div className="flex justify-center space-x-2">
            <Badge variant="outline">Visa</Badge>
            <Badge variant="outline">Mastercard</Badge>
            <Badge variant="outline">Amex</Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Pay R{amount}</span>
            </div>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>PCI Compliant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}