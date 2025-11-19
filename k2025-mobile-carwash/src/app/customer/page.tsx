'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  FileText, 
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

// Mock data - in real app this would come from API
const mockCustomerBookings = [
  {
    id: '1',
    date: '2025-11-20',
    time: '10:00',
    location: '123 Main St, Cape Town',
    services: ['Exterior Wash & Wax', 'Interior Detailing'],
    totalPrice: 698,
    status: 'CONFIRMED',
    notes: 'Black SUV, extra attention needed'
  },
  {
    id: '2',
    date: '2025-11-15',
    time: '14:00',
    location: '123 Main St, Cape Town',
    services: ['Exterior Wash & Wax'],
    totalPrice: 299,
    status: 'COMPLETED',
    notes: 'Regular wash'
  },
  {
    id: '3',
    date: '2025-11-25',
    time: '09:00',
    location: '123 Main St, Cape Town',
    services: ['Paint Protection & Ceramic Coating'],
    totalPrice: 1299,
    status: 'PENDING',
    notes: 'Premium service requested'
  }
]

const mockCustomerContracts = [
  {
    id: '1',
    contractType: '10 Wash Premium Package',
    totalWashes: 10,
    usedWashes: 3,
    remainingWashes: 7,
    totalPrice: 3992,
    startDate: '2025-10-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    contractUrl: '/contracts/contract-1.pdf'
  }
]

const mockCustomerInfo = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+27 83 123 4567',
  address: '123 Main St, Cape Town, 8001',
  memberSince: '2025-09-15',
  totalBookings: 8,
  totalSpent: 2456
}

export default function CustomerPortal() {
  const [bookings, setBookings] = useState(mockCustomerBookings)
  const [contracts, setContracts] = useState(mockCustomerContracts)
  const [editingBooking, setEditingBooking] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.services.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEditBooking = (bookingId: string) => {
    setEditingBooking(bookingId === editingBooking ? null : bookingId)
  }

  const handleSaveBooking = (bookingId: string) => {
    // In real app, this would save to API
    setEditingBooking(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
          <p className="text-gray-600">Manage your bookings and contracts</p>
        </div>

        {/* Customer Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm text-gray-600">Name</Label>
                <p className="font-medium">{mockCustomerInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Email</Label>
                <p className="font-medium">{mockCustomerInfo.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Phone</Label>
                <p className="font-medium">{mockCustomerInfo.phone}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Member Since</Label>
                <p className="font-medium">{mockCustomerInfo.memberSince}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-600">Address</Label>
                <p className="font-medium">{mockCustomerInfo.address}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Total Bookings</Label>
                <p className="font-medium">{mockCustomerInfo.totalBookings}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Total Spent</Label>
                <p className="font-medium">R{mockCustomerInfo.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="contracts">My Contracts</TabsTrigger>
            <TabsTrigger value="new-booking">Book New Service</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>View and manage your car wash appointments</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        {editingBooking === booking.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Date</Label>
                                <Input type="date" defaultValue={booking.date} />
                              </div>
                              <div>
                                <Label>Time</Label>
                                <Select defaultValue={booking.time}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2">
                                <Label>Location</Label>
                                <Input defaultValue={booking.location} />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Notes</Label>
                                <Textarea defaultValue={booking.notes} rows={2} />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => handleSaveBooking(booking.id)}>Save Changes</Button>
                              <Button variant="outline" onClick={() => setEditingBooking(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <Badge className={getStatusColor(booking.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(booking.status)}
                                    <span>{booking.status}</span>
                                  </div>
                                </Badge>
                                <span className="font-semibold">R{booking.totalPrice}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditBooking(booking.id)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{booking.location}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Label className="text-sm text-gray-600">Services</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {booking.services.map((service, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {booking.notes && (
                              <div className="mt-3">
                                <Label className="text-sm text-gray-600">Notes</Label>
                                <p className="text-sm mt-1">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Contracts</CardTitle>
                <CardDescription>View your active contracts and remaining washes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <Card key={contract.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{contract.contractType}</h3>
                            <Badge className="bg-green-100 text-green-800 mt-1">
                              {contract.status}
                            </Badge>
                          </div>
                          <div className="flex space-x-2 mt-2 sm:mt-0">
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-600">Total Washes</Label>
                            <p className="font-semibold">{contract.totalWashes}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Used</Label>
                            <p className="font-semibold">{contract.usedWashes}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Remaining</Label>
                            <p className="font-semibold text-green-600">{contract.remainingWashes}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Valid Until</Label>
                            <p className="font-semibold">{contract.endDate}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Usage Progress</span>
                            <span>{contract.usedWashes}/{contract.totalWashes}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-glossiq-primary h-2 rounded-full" 
                              style={{ width: `${(contract.usedWashes / contract.totalWashes) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Booking Tab */}
          <TabsContent value="new-booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book New Service</CardTitle>
                <CardDescription>Schedule a new car wash appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready for a new booking?</h3>
                  <p className="text-gray-600 mb-4">
                    Click below to schedule your next car wash service
                  </p>
                  <Button asChild>
                    <a href="/booking">Book New Service</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}