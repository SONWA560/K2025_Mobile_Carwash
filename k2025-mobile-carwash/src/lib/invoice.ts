import { prisma } from './prisma'

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  paymentInfo: {
    bankName: string
    accountName: string
    accountNumber: string
    reference: string
  }
  type: 'booking' | 'contract'
  bookingId?: string
  contractId?: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  total: number
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `INV-${timestamp}-${random}`
}

export function calculateInvoiceExpiry(): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 24)
  return expiry
}

export function generateInvoiceHTML(data: InvoiceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - K2025 Mobile Carwash</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 20px; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          border: 1px solid #ddd; 
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #23336E 0%, #1a2856 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 8px 8px 0 0;
        }
        .invoice-details { 
          background: #f8f9fa; 
          padding: 20px; 
          margin: 20px; 
          border-left: 4px solid #23336E; 
          border-radius: 4px;
        }
        .billing-info { 
          padding: 20px; 
          margin: 20px; 
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px; 
          background: white;
        }
        .items-table th, .items-table td { 
          border: 1px solid #dee2e6; 
          padding: 12px; 
          text-align: left; 
        }
        .items-table th { 
          background: #f8f9fa; 
          font-weight: 600; 
          color: #495057;
        }
        .items-table .text-right { text-align: right; }
        .totals { 
          text-align: right; 
          margin: 20px; 
          padding: 20px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .payment-info { 
          background: #e3f2fd; 
          padding: 20px; 
          margin: 20px; 
          border-left: 4px solid #2196f3;
          border-radius: 4px;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          font-size: 12px; 
          color: #666; 
          border-top: 1px solid #dee2e6;
          background: #f8f9fa;
          border-radius: 0 0 8px 8px;
        }
        .logo { 
          font-size: 28px; 
          font-weight: bold; 
          margin-bottom: 10px;
        }
        .invoice-number { 
          font-size: 18px; 
          margin: 10px 0; 
          opacity: 0.9;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #ff9800;
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
        }
        .expiry-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 12px;
          border-radius: 4px;
          margin: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚗 K2025 Mobile Carwash</div>
          <div class="invoice-number">Invoice #${data.invoiceNumber}</div>
          <div class="status-badge">PAYMENT DUE WITHIN 24 HOURS</div>
        </div>
        
        <div class="expiry-notice">
          <strong>⏰ Important:</strong> This invoice expires on ${data.dueDate}. Please complete payment to avoid cancellation.
        </div>
        
        <div class="invoice-details">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <h3>Invoice Details</h3>
              <p><strong>Issue Date:</strong> ${data.date}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
              <p><strong>Type:</strong> ${data.type === 'booking' ? 'Service Booking' : 'Contract Package'}</p>
            </div>
            <div style="text-align: right;">
              <h3>Billed To:</h3>
              <p><strong>${data.customerName}</strong></p>
              <p>${data.customerEmail}</p>
              ${data.customerPhone ? `<p>${data.customerPhone}</p>` : ''}
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%;">Description</th>
              <th style="width: 15%;">Qty</th>
              <th style="width: 15%;">Rate</th>
              <th style="width: 20%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item) => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">R${item.rate.toFixed(2)}</td>
                <td class="text-right"><strong>R${item.total.toFixed(2)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p><strong>Subtotal:</strong> R${data.subtotal.toFixed(2)}</p>
          <p><strong>Tax (15% VAT):</strong> R${data.tax.toFixed(2)}</p>
          <p style="font-size: 18px; color: #23336E; margin-top: 10px;"><strong>Total Amount Due:</strong> R${data.total.toFixed(2)}</p>
        </div>

        <div class="payment-info">
          <h3>💳 Payment Information</h3>
          <p><strong>Bank:</strong> ${data.paymentInfo.bankName}</p>
          <p><strong>Account Name:</strong> ${data.paymentInfo.accountName}</p>
          <p><strong>Account Number:</strong> ${data.paymentInfo.accountNumber}</p>
          <p><strong>Reference:</strong> <code>${data.paymentInfo.reference}</code></p>
          <p style="margin-top: 10px; font-size: 14px; color: #666;">
            Please use the invoice number as your payment reference to ensure proper allocation.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p>K2025 Mobile Carwash | Email: gloss.iq.info@gmail.com | Phone: 071 869 2274</p>
          <p>📍 Mobile Service - We come to you! | 🕐 7 Days a Week</p>
          <p style="margin-top: 10px;">© 2025 K2025 Mobile Carwash. All rights reserved.</p>
          <p style="margin-top: 5px; font-size: 10px;">VAT Registration Number: [Your VAT Number]</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function createBookingInvoice(bookingId: string): Promise<InvoiceData> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      services: {
        include: { service: true }
      }
    }
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  const items: InvoiceItem[] = []
  let subtotal = 0

  // Add services to invoice items
  booking.services.forEach((bookingService) => {
    const item: InvoiceItem = {
      description: `${bookingService.service.name} (${booking.vehicleType})`,
      quantity: booking.numberOfCars,
      rate: bookingService.price,
      total: bookingService.price * booking.numberOfCars
    }
    items.push(item)
    subtotal += item.total
  })

  // Add service charge if applicable
  if (booking.serviceCharge && booking.serviceCharge > 0) {
    items.push({
      description: 'Mobile Service Charge (Distance)',
      quantity: 1,
      rate: booking.serviceCharge,
      total: booking.serviceCharge
    })
    subtotal += booking.serviceCharge
  }

  const tax = subtotal * 0.15 // 15% VAT
  const total = subtotal + tax

  return {
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toLocaleDateString('en-ZA'),
    dueDate: calculateInvoiceExpiry().toLocaleDateString('en-ZA'),
    customerName: booking.user.name || 'Valued Customer',
    customerEmail: booking.user.email,
    customerPhone: booking.user.phone || undefined,
    items,
    subtotal,
    tax,
    total,
    paymentInfo: {
      bankName: 'Standard Bank',
      accountName: 'K2025 Mobile Carwash',
      accountNumber: '1234567890',
      reference: generateInvoiceNumber()
    },
    type: 'booking',
    bookingId
  }
}

export async function createContractInvoice(contractId: string): Promise<InvoiceData> {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      user: true,
      services: {
        include: { service: true }
      }
    }
  })

  if (!contract) {
    throw new Error('Contract not found')
  }

  const items: InvoiceItem[] = []
  let subtotal = 0

  // Add contract package
  items.push({
    description: `${contract.contractType} Package (${contract.totalWashes} washes)`,
    quantity: 1,
    rate: contract.totalPrice,
    total: contract.totalPrice
  })
  subtotal = contract.totalPrice

  const tax = subtotal * 0.15 // 15% VAT
  const total = subtotal + tax

  return {
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toLocaleDateString('en-ZA'),
    dueDate: calculateInvoiceExpiry().toLocaleDateString('en-ZA'),
    customerName: contract.user.name || 'Valued Customer',
    customerEmail: contract.user.email,
    customerPhone: contract.user.phone || undefined,
    items,
    subtotal,
    tax,
    total,
    paymentInfo: {
      bankName: 'Standard Bank',
      accountName: 'K2025 Mobile Carwash',
      accountNumber: '1234567890',
      reference: generateInvoiceNumber()
    },
    type: 'contract',
    contractId
  }
}