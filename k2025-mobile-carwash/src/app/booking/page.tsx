'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, Clock, MapPin, Droplets, Sparkles, Shield, Sun, ArrowLeft, Home, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import LocationSelector from '@/components/LocationSelector'
import PaginationAnt from '@/components/ui/pagination-ant'
import { generateTimeSlots, isTimeSlotAvailable, calculateBookingEndTime } from '@/lib/booking-utils'
import { NavBar } from '@/components/ui/tubelight-navbar'

const services = [
  // Basic Services
  {
    id: 'exterior-basic',
    name: 'Exterior Wash',
    description: 'Pre-rinse hand wash, tyre and rim clean, windows quick dry, light wax spray (optional)',
    price: { small: { min: 120, max: 150 }, suv: { min: 150, max: 180 } },
    duration: { min: 30, max: 45 },
    category: 'basic',
    tier: 'basic',
    icon: Droplets
  },
  {
    id: 'interior-basic',
    name: 'Interior Wash',
    description: 'Vacuuming, wipe down of surfaces, windows, door panels',
    price: { small: { min: 100, max: 130 }, suv: { min: 130, max: 260 } },
    duration: { min: 25, max: 40 },
    category: 'basic',
    tier: 'basic',
    icon: Sparkles
  },
  // Standard Package
  {
    id: 'standard-full',
    name: 'Standard Full Package',
    description: 'Full exterior wash, tyre shine, full vacuum, dashboard and panel clean, windows inside and out',
    price: { small: { min: 250, max: 300 }, suv: { min: 300, max: 350 } },
    duration: { min: 60, max: 90 },
    category: 'standard',
    tier: 'standard',
    icon: Shield
  },
  // Premium Services
  {
    id: 'premium-detailing',
    name: 'Deep Interior Detailing',
    description: 'Seat deep cleaning, shampooing, deep vacuuming, odour removal, detail cleaning in corners and panels',
    price: { min: 400, max: 600 },
    duration: { min: 120, max: 180 },
    category: 'premium',
    tier: 'premium',
    icon: Sun
  }
]

const vehicleTypes = [
  { value: 'small', label: 'Small Car / Hatchback / Sedan' },
  { value: 'suv', label: 'SUV / Bakkie / Truck' }
]

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/#services", icon: Droplets },
  { name: "Book Now", url: "/booking", icon: CalendarDays },
]

// Generate time slots dynamically based on service duration
const getTimeSlotsForService = (date: Date | undefined, duration: number, page: number = 1, pageSize: number = 12) => {
  if (!date) return []
  const allSlots = generateTimeSlots(date, duration)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return allSlots.slice(startIndex, endIndex)
}

function BookingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedServices, setSelectedServices] = useState<string[]>(searchParams?.get('service') ? [searchParams.get('service')!] : [])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [multipleCars, setMultipleCars] = useState(false)
  const [numberOfCars, setNumberOfCars] = useState(1)
  const [vehicleType, setVehicleType] = useState<'small' | 'suv'>('small')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  })
  const [locationData, setLocationData] = useState<any>(null)
  const [timeSlotPage, setTimeSlotPage] = useState(1)
  const [currentStep, setCurrentStep] = useState(1)

  const selectedServicesData = services.filter(service => selectedServices.includes(service.id))
  
  const getServicePrice = (service: any) => {
    if (typeof service.price === 'object' && 'min' in service.price && !('small' in service.price)) {
      return service.price.min // Premium service
    }
    if (typeof service.price === 'object' && 'small' in service.price) {
      return service.price[vehicleType].min // Basic or standard service
    }
    return 0
  }
  
  const getServiceDuration = (service: any) => {
    return typeof service.duration === 'object' ? service.duration.min : service.duration
  }
  
  const basePrice = selectedServicesData.reduce((sum, service) => sum + getServicePrice(service), 0) * numberOfCars
  const serviceCharge = locationData?.serviceCharge || 0
  const totalPrice = basePrice + serviceCharge
  const totalDuration = selectedServicesData.reduce((sum, service) => sum + getServiceDuration(service), 0)

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime || !location || selectedServices.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    const bookingData = {
      services: selectedServices,
      date: selectedDate.toISOString(),
      time: selectedTime,
      location,
      notes,
      multipleCars,
      numberOfCars,
      vehicleType,
      customerInfo,
      locationData,
      basePrice,
      serviceCharge,
      totalPrice
    }

    // Here you would typically save to database and redirect to payment
    console.log('Booking data:', bookingData)
    alert('Booking submitted! (This would redirect to payment in production)')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar items={navItems} />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-glossiq-primary transition-colors flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Booking</span>
            </li>
          </ol>
        </nav>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Car Wash</h1>
          <p className="text-gray-600">Select your services and schedule your appointment</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-glossiq-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 6 && (
                <div className={`w-12 h-1 mx-1 ${
                  currentStep > step ? 'bg-glossiq-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Services</CardTitle>
                <CardDescription>Choose the services you need for your vehicle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <div key={service.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <IconComponent className="h-8 w-8 text-glossiq-primary" />
                      <div className="flex-1">
                        <label htmlFor={service.id} className="font-medium cursor-pointer">
                          {service.name}
                        </label>
                         <p className="text-sm text-gray-600">{service.description}</p>
                         <div className="flex items-center space-x-4 mt-1">
                           <Badge variant="secondary">
                             {typeof service.duration === 'object' 
                               ? `${service.duration.min}-${service.duration.max} min`
                               : `${service.duration} min`
                             }
                           </Badge>
                            <span className="font-semibold text-glossiq-primary">
                             From R{typeof service.price === 'object' && 'min' in service.price && !('small' in service.price)
                               ? service.price.min
                               : typeof service.price === 'object' && 'small' in service.price
                               ? service.price[vehicleType]?.min || 0
                               : 0
                             }
                           </span>
                         </div>
                      </div>
                    </div>
                  )
                })}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="multiple-cars"
                      checked={multipleCars}
                      onCheckedChange={(checked) => setMultipleCars(checked as boolean)}
                    />
                    <label htmlFor="multiple-cars" className="font-medium cursor-pointer">
                      I need service for multiple vehicles
                    </label>
                  </div>
                  {multipleCars && (
                    <div className="ml-6">
                      <Label htmlFor="num-cars">Number of vehicles</Label>
                      <Select value={numberOfCars.toString()} onValueChange={(value) => setNumberOfCars(parseInt(value))}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} vehicles</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                   <Label htmlFor="vehicle-type">Vehicle Type</Label>
                   <Select value={vehicleType} onValueChange={(value: 'small' | 'suv') => setVehicleType(value)}>
                     <SelectTrigger className="w-full">
                       <SelectValue placeholder="Select vehicle type" />
                     </SelectTrigger>
                     <SelectContent>
                       {vehicleTypes.map((type) => (
                         <SelectItem key={type.value} value={type.value}>
                           {type.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="flex justify-between mt-6">
                   <Button type="button" variant="outline" disabled>Previous</Button>
                   <Button 
                     type="button" 
                     onClick={() => setCurrentStep(2)}
                     disabled={selectedServices.length === 0}
                   >
                     Next
                   </Button>
                 </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose when you'd like us to visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Select Time</Label>
                  <div className="text-sm text-gray-600 mb-2">
                    Service duration: {totalDuration} minutes
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                    {getTimeSlotsForService(selectedDate, totalDuration, timeSlotPage).map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={selectedTime === slot.time ? "default" : slot.available ? "outline" : "ghost"}
                        className={`h-10 text-xs ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        title={slot.reason}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                  
                  {selectedDate && (
                    <PaginationAnt
                      current={timeSlotPage}
                      total={generateTimeSlots(selectedDate, totalDuration).length}
                      pageSize={12}
                      showSizeChanger={false}
                      showQuickJumper={false}
                      onChange={(page) => setTimeSlotPage(page)}
                      simple={true}
                    />
                  )}
                  {selectedTime && selectedDate && (
                    <div className="mt-2 text-sm text-gray-600">
                      End time: {calculateBookingEndTime(selectedDate, selectedTime, totalDuration)}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customer Information */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      value={customerInfo.surname}
                      onChange={(e) => setCustomerInfo({...customerInfo, surname: e.target.value})}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(4)}
                    disabled={!customerInfo.name || !customerInfo.surname || !customerInfo.email || !customerInfo.phone}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <LocationSelector 
                onLocationChange={(data) => {
                  setLocationData(data)
                  setLocation(data.address)
                }}
                initialLocation={location}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes (Optional)</CardTitle>
                  <CardDescription>Any special instructions or access information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions, gate codes, parking information..."
                    rows={3}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                  Previous
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(5)}
                  disabled={!locationData}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Booking</CardTitle>
                <CardDescription>Please confirm your booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Selected Services</h3>
                  {selectedServicesData.map((service) => (
                     <div key={service.id} className="flex justify-between items-center py-2 border-b">
                       <div>
                         <p className="font-medium">{service.name}</p>
                         <p className="text-sm text-gray-600">
                           {typeof service.duration === 'object' 
                             ? `${service.duration.min}-${service.duration.max} minutes`
                             : `${service.duration} minutes`
                           }
                         </p>
                       </div>
                       <span className="font-semibold">R{getServicePrice(service) * numberOfCars}</span>
                     </div>
                  ))}
                  {multipleCars && (
                    <div className="flex justify-between items-center py-2 font-semibold">
                      <span>Number of vehicles</span>
                      <span>x{numberOfCars}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Appointment Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {selectedDate && format(selectedDate, "PPP")}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {selectedTime}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {location}
                    </div>
                    <div className="flex items-center text-sm">
                      <Droplets className="h-4 w-4 mr-2" />
                      Duration: {totalDuration} minutes
                    </div>
                  </div>
                </div>

                 <div className="border-t pt-4 space-y-2">
                   {serviceCharge > 0 && (
                     <div className="flex justify-between items-center text-sm">
                       <span>Service Charge (Distance)</span>
                       <span className="text-yellow-600">R{serviceCharge}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center text-lg font-bold">
                     <span>Total Price</span>
                      <span className="text-glossiq-primary">R{totalPrice}</span>
                   </div>
                 </div>

                 <div>
                   <h3 className="font-semibold mb-2">Customer Information</h3>
                   <div className="space-y-2">
                     <div className="flex items-center text-sm">
                       <span className="font-medium mr-2">Name:</span>
                       {customerInfo.name} {customerInfo.surname}
                     </div>
                     <div className="flex items-center text-sm">
                       <span className="font-medium mr-2">Email:</span>
                       {customerInfo.email}
                     </div>
                     <div className="flex items-center text-sm">
                       <span className="font-medium mr-2">Phone:</span>
                       {customerInfo.phone}
                     </div>
                     <div className="flex items-center text-sm">
                       <span className="font-medium mr-2">Vehicle:</span>
                       {vehicleTypes.find(t => t.value === vehicleType)?.label}
                     </div>
                   </div>
                 </div>

                 <div className="flex justify-between">
                   <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>
                     Previous
                   </Button>
                    <Button type="submit" className="bg-glossiq-primary hover:bg-opacity-90">
                     Confirm Booking & Proceed to Payment
                   </Button>
                 </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
      
      {/* Floating Home Button */}
      <Link 
        href="/"
        className="fixed bottom-6 left-6 z-50 bg-glossiq-primary text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors"
        aria-label="Go to home"
      >
        <Home className="h-5 w-5" />
      </Link>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  )
}