import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateBookingConfirmationEmail, generateContractConfirmationEmail } from '@/lib/email'
import { sendWhatsAppMessage, generateBookingConfirmationMessage, generateContractActivationMessage } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const { type, data, channels } = await request.json()

    const results: any = {
      email: { success: false, error: null },
      whatsapp: { success: false, error: null }
    }

    // Send email notification
    if (channels.includes('email') && data.customerEmail) {
      let emailContent
      
      switch (type) {
        case 'booking_confirmation':
          emailContent = generateBookingConfirmationEmail(data)
          break
        case 'contract_activation':
          emailContent = generateContractConfirmationEmail(data)
          break
        default:
          emailContent = { subject: 'K2025 Mobile Carwash Notification', html: '<p>Notification from K2025 Mobile Carwash</p>' }
      }

      const emailResult = await sendEmail({
        to: data.customerEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      })

      results.email = emailResult
    }

    // Send WhatsApp notification
    if (channels.includes('whatsapp') && data.customerPhone) {
      let message
      
      switch (type) {
        case 'booking_confirmation':
          message = generateBookingConfirmationMessage(data)
          break
        case 'contract_activation':
          message = generateContractActivationMessage(data)
          break
        case 'reminder':
          message = `Reminder: Your car wash appointment is scheduled for ${new Date(data.date).toLocaleDateString()} at ${data.time}. We'll see you at ${data.address}!`
          break
        default:
          message = 'Notification from K2025 Mobile Carwash'
      }

      const whatsappResult = await sendWhatsAppMessage({
        to: data.customerPhone,
        message
      })

      results.whatsapp = whatsappResult
    }

    return NextResponse.json({
      success: true,
      results
    })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}