import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendEmail, generateBookingConfirmationEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Bookings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle user ID mapping
    let userId = body.userId
    if (userId === 'temp-user-id') {
      const tempUser = await prisma.user.findFirst({
        where: { email: 'temp@example.com' }
      })
      userId = tempUser?.id || userId
    }
    
    // Handle service ID mapping
    const serviceMap: { [key: string]: string } = {
      'exterior-basic': 'cmi5u6pgu00003tk0zz0mhnyt',
      'interior-basic': 'cmi5u6phl00033tk0yyfxnjq3', 
      'standard-full': 'cmi5u6phn00063tk0ye4i0ye3',
      'premium-detail': 'cmi5u6pho00093tk0qzb0o8wi'
    }
    
    const mappedServices = body.services.map((serviceId: string) => 
      serviceMap[serviceId] || serviceId
    )
    
    const booking = await prisma.booking.create({
      data: {
        userId,
        date: new Date(body.date),
        time: body.time,
        location: body.location,
        status: 'CONFIRMED',
        basePrice: body.basePrice,
        serviceCharge: body.serviceCharge || 0,
        totalPrice: body.totalPrice,
        notes: body.notes,
        vehicleType: body.vehicleType.toUpperCase() as 'SMALL' | 'SUV',
        numberOfCars: body.numberOfCars,
        distance: body.locationData?.distance,
        withinRadius: body.locationData?.withinRadius,
        services: {
          create: await Promise.all(mappedServices.map(async (serviceId: string) => ({
            serviceId,
            price: await getServicePrice(serviceId, body.vehicleType.toUpperCase() as 'SMALL' | 'SUV'),
            duration: await getServiceDuration(serviceId)
          })))
        }
      },
      include: {
        user: true,
        services: {
          include: {
            service: true
          }
        }
      }
    })

    // Send booking confirmation email
    if (booking.user.email) {
      const emailData = {
        customerName: booking.user.name || 'Valued Customer',
        date: booking.date.toLocaleDateString(),
        time: booking.time,
        location: booking.location,
        services: booking.services.map((bs: { service: { name: string } }) => bs.service.name),
        totalPrice: booking.totalPrice,
        notes: booking.notes
      }

      await sendEmail({
        to: booking.user.email,
        ...generateBookingConfirmationEmail(emailData)
      })
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...updateData,
        vehicleType: updateData.vehicleType ? updateData.vehicleType.toUpperCase() as 'SMALL' | 'SUV' : undefined,
        updatedAt: new Date()
      },
      include: {
        user: true,
        services: {
          include: {
            service: true
          }
        }
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    await prisma.booking.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Booking deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}

// Helper functions
async function getServicePrice(serviceId: string, vehicleType: 'SMALL' | 'SUV') {
  const servicePrice = await prisma.servicePrice.findUnique({
    where: {
      serviceId_vehicleType: {
        serviceId,
        vehicleType
      }
    }
  })
  return servicePrice?.priceMin || 0
}

async function getServiceDuration(serviceId: string) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMin: true }
  })
  return service?.durationMin || 30
}