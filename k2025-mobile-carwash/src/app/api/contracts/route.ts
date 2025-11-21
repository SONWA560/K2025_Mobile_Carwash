import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId } = body

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        services: {
          include: {
            service: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Generate contract data
    const contractData = generateContractData(booking)
    
    // Generate contract HTML
    const contractHtml = generateContractHTML(contractData)

    // Send contract email
    if (booking.user.email) {
      await sendEmail({
        to: booking.user.email,
        subject: `Contract - K2025 Mobile Carwash - Invoice #${contractData.invoiceNumber}`,
        html: contractHtml,
        text: `Contract for ${booking.user.name}`
      })
    }

    return NextResponse.json({
      success: true,
      contractData,
      message: 'Contract generated and sent successfully'
    })
  } catch (error) {
    console.error('Contract generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate contract' },
      { status: 500 }
    )
  }
}

function generateContractData(booking: any) {
  const services = booking.services.map((bs: any) => bs.service)
  
  // Calculate service breakdown
  let standardServiceCount = 0
  let basicServiceCount = 0
  let premiumServiceCount = 0

  services.forEach((service: any) => {
    switch (service.tier) {
      case 'STANDARD':
        standardServiceCount++
        break
      case 'BASIC':
        basicServiceCount++
        break
      case 'PREMIUM':
        premiumServiceCount++
        break
    }
  })

  const subtotal = booking.basePrice || 900
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return {
    invoiceNumber: '01234',
    date: new Date().toLocaleDateString('en-ZA'),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA'),
    issuedTo: {
      name: booking.user.name,
      company: 'Thynk Unlimited',
      address: '123 Anywhere St., Any City'
    },
    items: [
      {
        description: 'Standard Service',
        quantity: standardServiceCount,
        rate: 500,
        total: standardServiceCount * 500
      },
      {
        description: 'Basic Service', 
        quantity: basicServiceCount,
        rate: 100,
        total: basicServiceCount * 100
      },
      {
        description: 'Premium Car Detailing',
        quantity: premiumServiceCount,
        rate: 100,
        total: premiumServiceCount * 100
      }
    ].filter(item => item.quantity > 0),
    subtotal,
    tax,
    total,
    paymentInfo: {
      bankName: 'Borcele Bank',
      accountName: 'Morgan Maxwell',
      accountNumber: '0123 4567 8901'
    }
  }
}

function generateContractHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contract - K2025 Mobile Carwash</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #ddd; }
        .header { background: #23336E; color: white; padding: 20px; text-align: center; }
        .invoice-details { background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #23336E; }
        .billing-info { padding: 15px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background: #f8f9fa; font-weight: bold; }
        .items-table .text-right { text-align: right; }
        .totals { text-align: right; margin: 20px 0; }
        .payment-info { background: #e9ecef; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
        .logo { font-size: 24px; font-weight: bold; }
        .invoice-number { font-size: 18px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚗 K2025 Mobile Carwash</div>
          <div class="invoice-number">Invoice #${data.invoiceNumber}</div>
        </div>
        
        <div class="invoice-details">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <h3>Invoice Details</h3>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
            </div>
            <div style="text-align: right;">
              <h3>Issued To:</h3>
              <p><strong>${data.issuedTo.name}</strong></p>
              <p>${data.issuedTo.company}</p>
              <p>${data.issuedTo.address}</p>
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">R${item.rate}</td>
                <td class="text-right">R${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p><strong>Subtotal:</strong> R${data.subtotal}</p>
          <p><strong>Tax (10%):</strong> R${data.tax}</p>
          <p><strong>Total:</strong> R${data.total}</p>
        </div>

        <div class="payment-info">
          <h3>Payment Information</h3>
          <p><strong>Bank:</strong> ${data.paymentInfo.bankName}</p>
          <p><strong>Account Name:</strong> ${data.paymentInfo.accountName}</p>
          <p><strong>Account Number:</strong> ${data.paymentInfo.accountNumber}</p>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>K2025 Mobile Carwash | Email: gloss.iq.info@gmail.com | Phone: 071 869 2274</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}