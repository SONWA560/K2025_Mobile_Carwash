import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createBookingInvoice, createContractInvoice, generateInvoiceHTML } from '@/lib/invoice'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { type, bookingId, contractId } = await request.json()

    if (!type || (!bookingId && !contractId)) {
      return NextResponse.json(
        { error: 'Type and either bookingId or contractId are required' },
        { status: 400 }
      )
    }

    let invoiceData
    let updateData

    if (type === 'booking' && bookingId) {
      // Generate booking invoice
      invoiceData = await createBookingInvoice(bookingId)
      
      // Update booking with invoice details
      updateData = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceSentAt: new Date(),
          invoiceExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          paymentStatus: 'PENDING'
        },
        include: {
          user: true,
          services: {
            include: { service: true }
          }
        }
      })
    } else if (type === 'contract' && contractId) {
      // Generate contract invoice
      invoiceData = await createContractInvoice(contractId)
      
      // Update contract with invoice details
      updateData = await prisma.contract.update({
        where: { id: contractId },
        data: {
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceSentAt: new Date(),
          invoiceExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          paymentStatus: 'PENDING'
        },
        include: {
          user: true
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    // Generate HTML invoice
    const invoiceHTML = generateInvoiceHTML(invoiceData)

    // Send invoice email
    await sendEmail({
      to: invoiceData.customerEmail,
      subject: `Invoice ${invoiceData.invoiceNumber} - K2025 Mobile Carwash`,
      html: invoiceHTML,
      text: `Dear ${invoiceData.customerName},

Please find attached your invoice for ${invoiceData.type === 'booking' ? 'your car wash booking' : 'your car wash contract'}.

Invoice Number: ${invoiceData.invoiceNumber}
Total Amount: R${invoiceData.total.toFixed(2)}
Due Date: ${invoiceData.dueDate}

Payment Details:
Bank: ${invoiceData.paymentInfo.bankName}
Account Name: ${invoiceData.paymentInfo.accountName}
Account Number: ${invoiceData.paymentInfo.accountNumber}
Reference: ${invoiceData.paymentInfo.reference}

Please use the invoice number as your payment reference.

This invoice expires within 24 hours. Please complete payment to avoid cancellation.

Thank you for choosing K2025 Mobile Carwash!

Best regards,
The K2025 Team`
    })

    return NextResponse.json({
      success: true,
      invoiceData,
      updateData,
      message: 'Invoice generated and sent successfully'
    })
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type') // 'booking' or 'contract'
    const expiring = searchParams.get('expiring') // '6h', '12h', '24h'

    const where: Record<string, unknown> = {}

    if (status) {
      where.paymentStatus = status.toUpperCase()
    }

    if (expiring) {
      const hours = parseInt(expiring.replace('h', ''))
      const expiryTime = new Date(Date.now() + hours * 60 * 60 * 1000)
      where.invoiceExpiresAt = {
        lte: expiryTime,
        gte: new Date()
      }
    }

    // Get bookings with invoices
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

    // Get contracts with invoices
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
        pendingBookings: bookings.filter(b => b.paymentStatus === 'PENDING').length,
        pendingContracts: contracts.filter(c => c.paymentStatus === 'PENDING').length,
        expiringIn6h: [...bookings, ...contracts].filter(item => 
          item.invoiceExpiresAt && 
          new Date(item.invoiceExpiresAt) <= new Date(Date.now() + 6 * 60 * 60 * 1000)
        ).length
      }
    })
  } catch (error) {
    console.error('Invoice fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}