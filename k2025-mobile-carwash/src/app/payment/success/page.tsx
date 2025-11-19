'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Home, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')

    if (redirectStatus === 'succeeded') {
      setPaymentStatus('success')
      // In a real app, you'd fetch payment details from your API
      setPaymentDetails({
        id: paymentIntent,
        amount: 299, // This would come from your API
        date: new Date().toLocaleDateString(),
        status: 'completed'
      })
    } else {
      setPaymentStatus('failed')
    }
  }, [searchParams])

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Processing your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-red-600">Payment Failed</CardTitle>
            <CardDescription>
              We couldn't process your payment. Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/booking">Try Again</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your payment. Your booking has been confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment ID:</span>
                  <span className="font-mono text-sm">{paymentDetails?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-semibold">R{paymentDetails?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{paymentDetails?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Booking Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>You'll receive a confirmation email shortly with your booking details.</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Our team will contact you to confirm the exact time.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild>
                <Link href="/customer">
                  View My Bookings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>

            {/* Receipt Download */}
            <div className="text-center">
              <Button variant="outline" className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-glossiq-primary font-semibold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Confirmation Email</h4>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed confirmation email with your booking information.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-glossiq-primary font-semibold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Team Contact</h4>
                <p className="text-sm text-gray-600">
                  Our team will contact you to confirm timing and any special requirements.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-glossiq-primary font-semibold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Service Day</h4>
                <p className="text-sm text-gray-600">
                  We'll arrive at your location on the scheduled day with all equipment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPageContent />
    </Suspense>
  )
}