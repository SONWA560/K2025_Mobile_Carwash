'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ContractForm from '@/components/ContractForm'
import { CheckCircle, Download, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock contract data - in real app this would come from API
const mockContractData = {
  id: 'CTR-2025-001',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '+27 83 123 4567',
  customerAddress: '123 Main St, Cape Town, 8001',
  contractType: '10 Wash Premium Package',
  totalWashes: 10,
  totalPrice: 3992,
  startDate: '2025-11-15',
  endDate: '2026-11-15',
  services: [
    'Exterior Wash & Wax',
    'Interior Detailing'
  ],
  features: [
    'Priority booking',
    'Mobile service',
    'Premium products',
    'Interior protection'
  ]
}

export default function ContractGeneratorPage() {
  const [isSigned, setIsSigned] = useState(false)
  const [signatureData, setSignatureData] = useState<string>('')

  const handleSignature = (data: string) => {
    setSignatureData(data)
    setIsSigned(true)
    
    // In real app, this would save to database
    console.log('Contract signed with signature:', data)
    
    // Show success message
    alert('Contract signed successfully! You will receive a copy via email.')
  }

  const handleDownload = () => {
    // In real app, this would generate and download PDF
    console.log('Downloading contract...')
    alert('Contract download started! (PDF generation would be implemented here)')
  }

  if (isSigned) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-green-600">Contract Successfully Signed!</CardTitle>
              <CardDescription>
                Thank you for signing your service contract with K2025 Mobile Carwash.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    You'll receive a signed copy via email within 5 minutes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Your contract is now active and you can start booking services
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    You can view your contract details in the customer portal anytime
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Contract Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Contract ID:</span>
                    <p className="font-medium">{mockContractData.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Package:</span>
                    <p className="font-medium">{mockContractData.contractType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Washes:</span>
                    <p className="font-medium">{mockContractData.totalWashes}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Valid Until:</span>
                    <p className="font-medium">{new Date(mockContractData.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Contract
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/customer">
                    <FileText className="h-4 w-4 mr-2" />
                    View in Customer Portal
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/booking">
                    Book Your First Wash
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/contracts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Link>
          </Button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Generator</h1>
          <p className="text-gray-600">Review and sign your service contract</p>
          <Badge className="mt-2 bg-blue-100 text-blue-800">
            Contract #{mockContractData.id}
          </Badge>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <ContractForm
            contractData={mockContractData}
            onSignature={handleSignature}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  )
}