'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Shield, Star, Clock, MapPin, Users, FileText } from 'lucide-react'

const contractPackages = [
  {
    id: '10-wash-basic',
    name: '10 Wash Basic Package',
    description: 'Perfect for regular car maintenance',
    price: 2392,
    originalPrice: 2990,
    savings: 598,
    washes: 10,
    validity: 12,
    services: ['Exterior Wash & Wax'],
    features: ['Priority booking', 'Mobile service', 'Quality products'],
    popular: false
  },
  {
    id: '10-wash-premium',
    name: '10 Wash Premium Package',
    description: 'Complete care inside and out',
    price: 3992,
    originalPrice: 4990,
    savings: 998,
    washes: 10,
    validity: 12,
    services: ['Exterior Wash & Wax', 'Interior Detailing'],
    features: ['Priority booking', 'Mobile service', 'Premium products', 'Interior protection'],
    popular: true
  },
  {
    id: '20-wash-ultimate',
    name: '20 Wash Ultimate Package',
    description: 'Best value for frequent users',
    price: 7184,
    originalPrice: 8980,
    savings: 1796,
    washes: 20,
    validity: 18,
    services: ['Exterior Wash & Wax', 'Interior Detailing', 'Headlight Restoration'],
    features: ['Priority booking', 'Mobile service', 'Premium products', 'Quarterly detailing', 'Free headlight restoration'],
    popular: false
  }
]

export default function ContractsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const selectedPackageData = contractPackages.find(pkg => pkg.id === selectedPackage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPackage || !agreedToTerms) {
      alert('Please select a package and agree to the terms')
      return
    }

    const contractData = {
      package: selectedPackageData,
      customer: customerInfo,
      agreedToTerms
    }

    console.log('Contract data:', contractData)
    alert('Contract submitted! (This would redirect to payment and contract generation in production)')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Packages</h1>
          <p className="text-gray-600">Save money with our wash bundles and enjoy regular car care</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-glossiq-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-glossiq-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Package Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contractPackages.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative cursor-pointer transition-all hover:shadow-lg ${
                      selectedPackage === pkg.id ? 'ring-2 ring-blue-600' : ''
                    } ${pkg.popular ? 'border-blue-600' : ''}`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-glossiq-primary">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-glossiq-primary">R{pkg.price}</div>
                        <div className="text-sm text-gray-500 line-through">R{pkg.originalPrice}</div>
                        <Badge variant="secondary" className="mt-1">Save R{pkg.savings}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          {pkg.washes} washes included
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Valid for {pkg.validity} months
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          R{Math.round(pkg.price / pkg.washes)} per wash
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium text-sm">Services included:</p>
                        {pkg.services.map((service, index) => (
                          <div key={index} className="text-xs text-gray-600">• {service}</div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium text-sm">Features:</p>
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Button 
                        type="button"
                        className="w-full mt-4" 
                        variant={selectedPackage === pkg.id ? "default" : "outline"}
                      >
                        {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedPackage}
                  className="px-8"
                >
                  Continue to Customer Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Customer Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Please provide your details for the contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="+27 XX XXX XXXX"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={customerInfo.company}
                      onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                      placeholder="Company Ltd"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Service Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    placeholder="Full address where we'll provide the service"
                    rows={2}
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(3)}
                    disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}
                  >
                    Review Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Sign */}
          {currentStep === 3 && selectedPackageData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Summary</CardTitle>
                  <CardDescription>Please review your contract details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Package Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Package Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{selectedPackageData.name}</p>
                          <p className="text-sm text-gray-600">{selectedPackageData.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-glossiq-primary">R{selectedPackageData.price}</div>
                          <div className="text-sm text-gray-500 line-through">R{selectedPackageData.originalPrice}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {selectedPackageData.washes} washes
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {selectedPackageData.validity} months validity
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Customer Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><strong>Name:</strong> {customerInfo.name}</p>
                      <p><strong>Email:</strong> {customerInfo.email}</p>
                      <p><strong>Phone:</strong> {customerInfo.phone}</p>
                      {customerInfo.company && <p><strong>Company:</strong> {customerInfo.company}</p>}
                      <p><strong>Service Address:</strong> {customerInfo.address}</p>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div>
                    <h3 className="font-semibold mb-3">Terms and Conditions</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                      <p>1. This contract is valid for {selectedPackageData.validity} months from the date of purchase.</p>
                      <p>2. All washes must be booked at least 24 hours in advance.</p>
                      <p>3. Services are provided at the customer's specified address only.</p>
                      <p>4. Unused washes are non-refundable after the contract expires.</p>
                      <p>5. The contract can be transferred to another person with written notice.</p>
                      <p>6. K2025 Mobile Carwash reserves the right to modify service terms with 30 days notice.</p>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="border-t pt-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm">
                        I have read and agree to the terms and conditions outlined above. I understand that this is a binding contract and that payment will be processed upon submission.
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                      Previous
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-glossiq-primary hover:bg-opacity-90"
                      disabled={!agreedToTerms}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Sign Contract & Pay R{selectedPackageData.price}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}