'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PaginationAnt from '@/components/ui/pagination-ant'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Car, 
  FileText, 
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react'

// Mock data - in real app this would come from API
const mockBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+27 83 123 4567',
    date: '2025-11-20',
    time: '10:00',
    location: '123 Main St, Cape Town',
    services: ['Exterior Wash & Wax', 'Interior Detailing'],
    totalPrice: 698,
    status: 'CONFIRMED',
    notes: 'Customer has a black SUV'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+27 82 987 6543',
    date: '2025-11-20',
    time: '14:00',
    location: '456 Oak Ave, Johannesburg',
    services: ['Exterior Wash & Wax'],
    totalPrice: 299,
    status: 'PENDING',
    notes: 'First time customer'
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '+27 81 555 1234',
    date: '2025-11-19',
    time: '09:00',
    location: '789 Pine Rd, Durban',
    services: ['Paint Protection & Ceramic Coating'],
    totalPrice: 1299,
    status: 'COMPLETED',
    notes: 'Premium service requested'
  }
]

const mockContracts = [
  {
    id: '1',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@company.co.za',
    contractType: '10 Wash Premium Package',
    totalWashes: 10,
    usedWashes: 3,
    remainingWashes: 7,
    totalPrice: 3992,
    startDate: '2025-10-01',
    endDate: '2026-10-01',
    status: 'ACTIVE'
  },
  {
    id: '2',
    customerName: 'ABC Logistics',
    customerEmail: 'fleet@abclogistics.co.za',
    contractType: '20 Wash Ultimate Package',
    totalWashes: 20,
    usedWashes: 8,
    remainingWashes: 12,
    totalPrice: 7184,
    startDate: '2025-09-15',
    endDate: '2027-03-15',
    status: 'ACTIVE'
  }
]

const mockStats = {
  totalBookings: 156,
  todayBookings: 8,
  totalRevenue: 45680,
  activeContracts: 23,
  pendingBookings: 12,
  completedThisMonth: 67
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState(mockBookings)
  const [contracts, setContracts] = useState(mockContracts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookingPage, setBookingPage] = useState(1)
  const [contractPage, setContractPage] = useState(1)
  const [stats] = useState(mockStats)
  
  const bookingsPerPage = 10
  const contractsPerPage = 10

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })
  
  const paginatedBookings = filteredBookings.slice(
    (bookingPage - 1) * bookingsPerPage,
    bookingPage * bookingsPerPage
  )
  
  const paginatedContracts = contracts.slice(
    (contractPage - 1) * contractsPerPage,
    contractPage * contractsPerPage
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, contracts, and business operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.todayBookings} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                2 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Bookings Management</CardTitle>
                    <CardDescription>View and manage all customer bookings</CardDescription>
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
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Date & Time</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Services</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{booking.customerName}</div>
                              <div className="text-sm text-gray-600">{booking.customerEmail}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div>
                              <div>{booking.date}</div>
                              <div className="text-sm text-gray-600">{booking.time}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="max-w-xs truncate">{booking.location}</div>
                          </td>
                          <td className="p-2">
                            <div className="space-y-1">
                              {booking.services.map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 font-semibold">R{booking.totalPrice}</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(booking.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(booking.status)}
                                <span>{booking.status}</span>
                              </div>
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
                
                <PaginationAnt
                  current={bookingPage}
                  total={filteredBookings.length}
                  pageSize={bookingsPerPage}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  onChange={(page) => setBookingPage(page)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Management</CardTitle>
                <CardDescription>View and manage customer contracts and remaining washes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Contract Type</th>
                        <th className="text-left p-2">Washes Used</th>
                        <th className="text-left p-2">Remaining</th>
                        <th className="text-left p-2">Total Price</th>
                        <th className="text-left p-2">Valid Until</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContracts.map((contract) => (
                        <tr key={contract.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{contract.customerName}</div>
                              <div className="text-sm text-gray-600">{contract.customerEmail}</div>
                            </div>
                          </td>
                          <td className="p-2">{contract.contractType}</td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <span>{contract.usedWashes}</span>
                              <span className="text-gray-400">/</span>
                              <span>{contract.totalWashes}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge variant={contract.remainingWashes > 5 ? "secondary" : "destructive"}>
                              {contract.remainingWashes} left
                            </Badge>
                          </td>
                          <td className="p-2 font-semibold">R{contract.totalPrice}</td>
                          <td className="p-2">{contract.endDate}</td>
                          <td className="p-2">
                            <Badge className="bg-green-100 text-green-800">
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
                
                <PaginationAnt
                  current={contractPage}
                  total={contracts.length}
                  pageSize={contractsPerPage}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  onChange={(page) => setContractPage(page)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Service Management</CardTitle>
                    <CardDescription>Manage your service offerings and pricing</CardDescription>
                  </div>
                  <Button>Add New Service</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Service management interface would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Customer management interface would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}