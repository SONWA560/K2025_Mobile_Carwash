// WhatsApp API integration for notifications

interface WhatsAppMessage {
  to: string
  message: string
  type?: 'text' | 'template'
  templateName?: string
  templateLanguage?: string
  templateComponents?: any[]
}

export async function sendWhatsAppMessage({ to, message, type = 'text' }: WhatsAppMessage) {
  if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER) {
    console.log('WhatsApp credentials not configured, skipping message')
    return { success: false, error: 'WhatsApp not configured' }
  }

  try {
    const payload = {
      messaging_product: 'whatsapp',
      to: to.replace(/[^\d]/g, ''), // Remove non-digits
      type,
      [type]: type === 'text' ? { body: message } : {}
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await response.json()
    
    if (response.ok) {
      console.log('WhatsApp message sent successfully:', data)
      return { success: true, messageId: data.messages[0].id }
    } else {
      console.error('WhatsApp API error:', data)
      return { success: false, error: data }
    }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return { success: false, error }
  }
}

export function generateBookingConfirmationMessage(bookingData: any) {
  return `🚗 *K2025 Mobile Carwash - Booking Confirmed!*

Dear ${bookingData.customerName},

Your car wash appointment has been confirmed:

📅 *Date:* ${bookingData.date}
⏰ *Time:* ${bookingData.time}
📍 *Location:* ${bookingData.location}
🛠️ *Services:* ${bookingData.services.join(', ')}
💰 *Total:* R${bookingData.totalPrice}

Our team will arrive at your location at the scheduled time. Please ensure your vehicle is accessible.

Need to make changes? Reply to this message or call us at +27 XX XXX XXXX.

Thank you for choosing K2025 Mobile Carwash! 🧼✨`
}

export function generateContractActivationMessage(contractData: any) {
  return `🎉 *K2025 Mobile Carwash - Contract Activated!*

Dear ${contractData.customerName},

Your ${contractData.contractType} is now active!

📋 *Contract Details:*
• Total Washes: ${contractData.totalWashes}
• Remaining: ${contractData.remainingWashes}
• Valid Until: ${contractData.endDate}
• Value: R${contractData.totalPrice}

Start booking your washes through our website or customer portal. Enjoy priority booking and exclusive member benefits!

Questions? Reply to this message or call us.

Thank you for your business! 🚗✨`
}

export function generateReminderMessage(bookingData: any) {
  return `⏰ *Reminder - K2025 Mobile Carwash*

Hi ${bookingData.customerName},

This is a friendly reminder about your car wash appointment scheduled for:

📅 *Tomorrow:* ${bookingData.date}
⏰ *Time:* ${bookingData.time}
📍 *Location:* ${bookingData.location}

We'll see you soon! Please ensure your vehicle is accessible.

Need to reschedule? Reply to this message or call us.

See you tomorrow! 🧼`
}