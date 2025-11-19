'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  FileText, 
  Download, 
  Pen, 
  CheckCircle, 
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Shield
} from 'lucide-react'

interface ContractData {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  contractType: string
  totalWashes: number
  totalPrice: number
  startDate: string
  endDate: string
  services: string[]
  features: string[]
}

interface ContractFormProps {
  contractData: ContractData
  onSignature: (signatureData: string) => void
  onDownload: () => void
}

export default function ContractForm({ contractData, onSignature, onDownload }: ContractFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [signatureData, setSignatureData] = useState<string>('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setHasSignature(true)
      saveSignature()
    }
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      setSignatureData(dataUrl)
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasSignature(false)
        setSignatureData('')
      }
    }
  }

  const handleSignContract = () => {
    if (hasSignature && agreedToTerms && signatureData) {
      onSignature(signatureData)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Contract Header */}
      <div className="text-center mb-8 border-b pb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-8 w-8 text-glossiq-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Service Contract</h1>
        </div>
        <p className="text-gray-600">K2025 Mobile Carwash Service Agreement</p>
        <Badge className="mt-2 bg-blue-100 text-blue-800">Contract #{contractData.id}</Badge>
      </div>

      {/* Contract Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Customer Information
          </h2>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <Label className="text-sm text-gray-600">Full Name</Label>
              <p className="font-medium">{contractData.customerName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Email Address</Label>
              <p className="font-medium">{contractData.customerEmail}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Phone Number</Label>
              <p className="font-medium">{contractData.customerPhone}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Service Address</Label>
              <p className="font-medium">{contractData.customerAddress}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Contract Details
          </h2>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <Label className="text-sm text-gray-600">Contract Type</Label>
              <p className="font-medium">{contractData.contractType}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Total Washes</Label>
              <p className="font-medium">{contractData.totalWashes}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Contract Value</Label>
              <p className="font-medium text-glossiq-primary">R{contractData.totalPrice}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Start Date</Label>
                <p className="font-medium">{formatDate(contractData.startDate)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">End Date</Label>
                <p className="font-medium">{formatDate(contractData.endDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Included */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Services Included</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Services:</Label>
              {contractData.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Features:</Label>
              {contractData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
        <div className="bg-gray-50 p-6 rounded-lg space-y-3 text-sm">
          <p><strong>1. Service Period:</strong> This contract is valid from {formatDate(contractData.startDate)} to {formatDate(contractData.endDate)}.</p>
          <p><strong>2. Booking Requirements:</strong> All washes must be booked at least 24 hours in advance through our booking system or by phone.</p>
          <p><strong>3. Service Location:</strong> Services will be provided only at the address specified in this contract.</p>
          <p><strong>4. Payment Terms:</strong> Full payment has been received and the contract is now active.</p>
          <p><strong>5. Usage Policy:</strong> Unused washes are non-refundable after the contract expiration date.</p>
          <p><strong>6. Transfer Policy:</strong> This contract can be transferred to another person with written notice to K2025 Mobile Carwash.</p>
          <p><strong>7. Modification:</strong> K2025 Mobile Carwash reserves the right to modify service terms with 30 days written notice.</p>
          <p><strong>8. Cancellation:</strong> Contract can be cancelled within 14 days of purchase with a full refund, minus any services already used.</p>
          <p><strong>9. Quality Guarantee:</strong> We guarantee professional service using quality products and equipment.</p>
          <p><strong>10. Liability:</strong> K2025 Mobile Carwash is insured against any damages that may occur during service provision.</p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Pen className="h-5 w-5 mr-2" />
          Digital Signature
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label className="text-sm font-medium mb-2 block">Sign below to agree to the terms:</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border border-gray-300 rounded cursor-crosshair w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="flex justify-between mt-2">
                <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                  Clear Signature
                </Button>
                {hasSignature && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Signed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms-agreement"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms-agreement" className="text-sm">
                  I have read and agree to all terms and conditions outlined in this contract. I understand that this digital signature is legally binding and equivalent to a handwritten signature.
                </label>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> By signing this contract, you agree to be bound by all terms and conditions. Please keep a copy for your records.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleSignContract}
                  disabled={!hasSignature || !agreedToTerms}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Sign Contract
                </Button>
                <Button variant="outline" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
        <p>K2025 Mobile Carwash • info@k2025carwash.co.za • +27 XX XXX XXXX</p>
        <p className="mt-2">This contract was generated on {new Date().toLocaleDateString('en-ZA')} at {new Date().toLocaleTimeString('en-ZA')}</p>
      </div>
    </div>
  )
}