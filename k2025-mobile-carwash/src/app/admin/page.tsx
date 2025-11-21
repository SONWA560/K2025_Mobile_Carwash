'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import PaginationAnt from '@/components/ui/pagination-ant'
import { 
  Calendar, 
  DollarSign, 
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
  AlertCircle,
  Bell,
  Send
} from 'lucide-react'

interface Booking {
  id: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  date: string
  time: string
  location: string
  status: string
  totalPrice: number
  notes?: string
  invoiceNumber?: string
  paymentStatus?: string
  invoiceExpiresAt?: string
  services: Array<{
    service: {
      id: string
      name: string
      tier: string
      category: string
    }
  }>
}

interface Contract {
  id: string
  customerName: string
  customerEmail: string
  contractType: string
  totalWashes: number
  usedWashes: number
  remainingWashes: number
  totalPrice: number
  startDate: string
  endDate: string
  status: string
  invoiceNumber?: string
  paymentStatus?: string
  invoiceExpiresAt?: string
}

interface Stats {
  totalBookings: number
  todayBookings: number
  totalRevenue: number
  activeContracts: number
  pendingBookings: number
  completedThisMonth: number
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookingPage, setBookingPage] = useState(1)
  const [contractPage, setContractPage] = useState(1)

  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    activeContracts: 0,
    pendingBookings: 0,
    completedThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [confirmPaymentDialog, setConfirmPaymentDialog] = useState<{
    open: boolean
    type: 'booking' | 'contract'
    id: string
    amount: number
  }>({ open: false, type: 'booking', id: '', amount: 0 })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  
  const bookingsPerPage = 10
  const contractsPerPage = 10

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?status=${statusFilter}&search=${searchTerm}&page=${bookingPage}&limit=${bookingsPerPage}`)
        const data = await response.json()
        setBookings(data.bookings || [])
        
        // Update stats
        const today = new Date().toDateString()
        const todayBookings = data.bookings?.filter((b: Booking) => 
          new Date(b.date).toDateString() === today
        ) || []
        const totalRevenue = data.bookings?.reduce((sum: number, b: Booking) => sum + b.totalPrice, 0) || 0
        const completedThisMonth = data.bookings?.filter((b: Booking) => 
          b.status === 'COMPLETED' && 
          new Date(b.date).getMonth() === new Date().getMonth() &&
          new Date(b.date).getFullYear() === new Date().getFullYear()
        ).length || 0

        setStats(prev => ({
          ...prev,
          totalBookings: data.bookings?.length || 0,
          todayBookings: todayBookings.length,
          totalRevenue,
          completedThisMonth
        }))
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [statusFilter, searchTerm, bookingPage])

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
    const matchesSearch = booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleConfirmPayment = async () => {
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: confirmPaymentDialog.type,
          id: confirmPaymentDialog.id,
          paymentMethod,
          paidAmount: confirmPaymentDialog.amount,
          adminNotes
        })
      })

      if (response.ok) {
        alert('Payment confirmed successfully!')
        setConfirmPaymentDialog({ open: false, type: 'booking', id: '', amount: 0 })
        setPaymentMethod('')
        setAdminNotes('')
        // Refresh data
        window.location.reload()
      } else {
        const error = await response.json()
        alert('Failed to confirm payment: ' + error.error)
      }
    } catch (error) {
      console.error('Payment confirmation error:', error)
      alert('Error confirming payment')
    }
  }

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
            <TabsTrigger value="payments">💳 Payments</TabsTrigger>
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
                               <div className="font-medium">{booking.user.name}</div>
                               <div className="text-sm text-gray-600">{booking.user.email}</div>
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
                              {booking.services.map((bookingService: { service: { name: string } }, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {bookingService.service.name}
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
                               <Button 
                                 size="sm" 
                                 variant="outline"
                                 onClick={async () => {
                                   try {
                                     const response = await fetch('/api/contracts', {
                                       method: 'POST',
                                       headers: { 'Content-Type': 'application/json' },
                                       body: JSON.stringify({ bookingId: booking.id })
                                     })
                                     const result = await response.json()
                                     if (result.success) {
                                       alert('Contract generated and sent successfully!')
                                     } else {
                                       alert('Failed to generate contract: ' + result.error)
                                     }
                                    } catch (error) {
                                      console.error('Error generating contract:', error)
                                      alert('Error generating contract')
                                    }
                                 }}
                               >
                                 <FileText className="h-3 w-3" />
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

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Payment Management</CardTitle>
                    <CardDescription>Manage invoices and confirm payments</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Check Expiring
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Reminders
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Payment Status Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-gray-600">Pending Invoices</p>
                          <p className="text-lg font-semibold">
                            {bookings.filter(b => b.paymentStatus === 'PENDING').length + 
                             contracts.filter(c => c.paymentStatus === 'PENDING').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">Expiring Soon</p>
                          <p className="text-lg font-semibold">
                            {[...bookings, ...contracts].filter(item => 
                              item.invoiceExpiresAt && 
                              new Date(item.invoiceExpiresAt) <= new Date(Date.now() + 6 * 60 * 60 * 1000)
                            ).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Paid Today</p>
                          <p className="text-lg font-semibold">0</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-lg font-semibold">
                             R{[...bookings, ...contracts]
                               .filter(item => item.paymentStatus === 'PAID')
                               .reduce((sum, item) => sum + item.totalPrice, 0)
                               .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Invoices Table */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pending Invoices</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...bookings, ...contracts]
                          .filter(item => item.paymentStatus === 'PENDING')
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Badge variant="outline">
                                  {'services' in item ? 'Booking' : 'Contract'}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {item.invoiceNumber || 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{'user' in item ? item.user?.name || 'N/A' : 'N/A'}</div>
                                  <div className="text-sm text-gray-600">{'user' in item ? item.user?.email : 'N/A'}</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                R{item.totalPrice?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {item.invoiceExpiresAt ? (
                                  <Badge variant={new Date(item.invoiceExpiresAt) <= new Date(Date.now() + 6 * 60 * 60 * 1000) ? "destructive" : "secondary"}>
                                    {new Date(item.invoiceExpiresAt).toLocaleDateString()}
                                  </Badge>
                                ) : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Pending
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Dialog open={confirmPaymentDialog.open && confirmPaymentDialog.id === item.id} onOpenChange={(open) => 
                                    setConfirmPaymentDialog(open ? { 
                                      open: true, 
                                      type: 'services' in item ? 'booking' : 'contract', 
                                      id: item.id, 
                                      amount: item.totalPrice || 0 
                                    } : { open: false, type: 'booking', id: '', amount: 0 })
                                  }>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Confirm
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Confirm Payment</DialogTitle>
                                        <DialogDescription>
                                          Confirm payment for {'user' in item ? item.user?.name : 'Customer'} - R{item.totalPrice?.toFixed(2)}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium">Payment Method</label>
                                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="EFT">EFT</SelectItem>
                                              <SelectItem value="Cash">Cash</SelectItem>
                                              <SelectItem value="Bank Deposit">Bank Deposit</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Admin Notes</label>
                                          <Input 
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            placeholder="Optional notes..."
                                          />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                          <Button variant="outline" onClick={() => setConfirmPaymentDialog({ open: false, type: 'booking', id: '', amount: 0 })}>
                                            Cancel
                                          </Button>
                                          <Button onClick={handleConfirmPayment}>
                                            Confirm Payment
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  <Button size="sm" variant="outline">
                                    <Send className="h-3 w-3 mr-1" />
                                    Remind
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
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