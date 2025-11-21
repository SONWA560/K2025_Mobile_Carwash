import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { type, id, paymentMethod, paidAmount, adminNotes } = await request.json()

    if (!type || !id || !paymentMethod || !paidAmount) {
      return NextResponse.json(
        { error: 'Type, id, paymentMethod, and paidAmount are required' },
        { status: 400 }
      )
    }

    let updateData
    let receiptData

    if (type === 'booking') {
      // Update booking payment status
      updateData = await prisma.booking.update({
        where: { id },
        data: {
          paymentStatus: 'PAID',
          paymentMethod,
          paidAmount: parseFloat(paidAmount),
          paidAt: new Date(),
          adminNotes,
          status: 'CONFIRMED' // Confirm the booking
        },
        include: {
          user: true,
          services: {
            include: { service: true }
          }
        }
      })

      receiptData = {
        type: 'booking',
        invoiceNumber: updateData.invoiceNumber,
        customerName: updateData.user.name,
        customerEmail: updateData.user.email,
        amount: paidAmount,
        paymentMethod,
        services: updateData.services.map(bs => bs.service.name),
        date: updateData.date,
        time: updateData.time,
        location: updateData.location
      }
    } else if (type === 'contract') {
      // Update contract payment status
      updateData = await prisma.contract.update({
        where: { id },
        data: {
          paymentStatus: 'PAID',
          paymentMethod,
          paidAmount: parseFloat(paidAmount),
          paidAt: new Date(),
          adminNotes,
          status: 'ACTIVE' // Activate the contract
        },
        include: {
          user: true
        }
      })

      receiptData = {
        type: 'contract',
        invoiceNumber: updateData.invoiceNumber,
        customerName: updateData.user.name,
        customerEmail: updateData.user.email,
        amount: paidAmount,
        paymentMethod,
        contractType: updateData.contractType,
        totalWashes: updateData.totalWashes,
        startDate: updateData.startDate,
        endDate: updateData.endDate
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be booking or contract' },
        { status: 400 }
      )
    }

    // Send payment confirmation email
    await sendEmail({
      to: receiptData.customerEmail,
      subject: `Payment Confirmed - ${receiptData.invoiceNumber}`,
      html: generateReceiptHTML(receiptData),
      text: `Dear ${receiptData.customerName},

Thank you for your payment!

Payment Details:
- Invoice Number: ${receiptData.invoiceNumber}
- Amount Paid: R${parseFloat(paidAmount).toFixed(2)}
- Payment Method: ${paymentMethod}
- Payment Date: ${new Date().toLocaleDateString('en-ZA')}

${receiptData.type === 'booking' ? 
  `Your booking is now confirmed. We'll see you on ${receiptData.date} at ${receiptData.time}.` :
  `Your contract is now active. You have ${receiptData.totalWashes} washes available.`
}

Thank you for choosing K2025 Mobile Carwash!

Best regards,
The K2025 Team`
    })

    return NextResponse.json({
      success: true,
      updateData,
      message: 'Payment confirmed successfully'
    })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}

    if (status) {
      where.paymentStatus = status.toUpperCase()
    }

    // Get bookings with payment status
    const bookings = type !== 'contract' ? await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                tier: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }) : []

    // Get contracts with payment status
    const contracts = type !== 'booking' ? await prisma.contract.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }) : []

    return NextResponse.json({
      bookings,
      contracts,
      summary: {
        totalBookings: bookings.length,
        totalContracts: contracts.length,
        paidBookings: bookings.filter(b => b.paymentStatus === 'PAID').length,
        paidContracts: contracts.filter(c => c.paymentStatus === 'PAID').length,
        pendingBookings: bookings.filter(b => b.paymentStatus === 'PENDING').length,
        pendingContracts: contracts.filter(c => c.paymentStatus === 'PENDING').length
      }
    })
  } catch (error) {
    console.error('Payment status fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    )
  }
}

function generateReceiptHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - K2025 Mobile Carwash</title>
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
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border: 1px solid #ddd; 
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 8px 8px 0 0;
        }
        .content { padding: 30px; }
        .success-icon { 
          font-size: 48px; 
          margin-bottom: 20px;
        }
        .details { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 4px; 
          margin: 20px 0;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>Payment Confirmed!</h1>
          <p>Thank you for your payment</p>
        </div>
        
        <div class="content">
          <div class="details">
            <h3>Payment Details</h3>
            <p><strong>Receipt Number:</strong> ${data.invoiceNumber}</p>
            <p><strong>Amount Paid:</strong> R${parseFloat(data.amount).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
          </div>

          ${data.type === 'booking' ? `
            <div class="details">
              <h3>Booking Details</h3>
              <p><strong>Services:</strong> ${data.services.join(', ')}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Location:</strong> ${data.location}</p>
            </div>
          ` : `
            <div class="details">
              <h3>Contract Details</h3>
              <p><strong>Contract Type:</strong> ${data.contractType}</p>
              <p><strong>Total Washes:</strong> ${data.totalWashes}</p>
              <p><strong>Start Date:</strong> ${data.startDate}</p>
              <p><strong>End Date:</strong> ${data.endDate}</p>
            </div>
          `}
        </div>
        
        <div class="footer">
          <p>Thank you for choosing K2025 Mobile Carwash!</p>
          <p>Email: gloss.iq.info@gmail.com | Phone: 071 869 2274</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}