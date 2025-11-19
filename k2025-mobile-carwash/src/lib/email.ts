import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"K2025 Mobile Carwash" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

export function generateBookingConfirmationEmail(bookingData: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - K2025 Mobile Carwash</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .booking-details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 K2025 Mobile Carwash</h1>
          <h2>Booking Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Dear ${bookingData.customerName},</p>
          <p>Thank you for booking with K2025 Mobile Carwash! Your appointment has been confirmed.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Date:</strong> ${bookingData.date}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
            <p><strong>Location:</strong> ${bookingData.location}</p>
            <p><strong>Services:</strong> ${bookingData.services.join(', ')}</p>
            <p><strong>Total Price:</strong> R${bookingData.totalPrice}</p>
            ${bookingData.notes ? `<p><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
          </div>
          
          <div class="booking-details">
            <h3>What's Next?</h3>
            <ul>
              <li>Our team will arrive at your location on the scheduled date and time</li>
              <li>Please ensure there's adequate space for our equipment</li>
              <li>Have your vehicle accessible and ready for service</li>
              <li>Payment will be processed on-site or via your selected method</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/customer" class="button">View My Bookings</a>
          </div>
        </div>
        
        <div class="footer">
          <p>K2025 Mobile Carwash</p>
          <p>Email: info@k2025carwash.co.za | Phone: +27 XX XXX XXXX</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    subject: 'Booking Confirmation - K2025 Mobile Carwash',
    html,
    text: `Booking Confirmation - K2025 Mobile Carwash\n\nDear ${bookingData.customerName},\n\nThank you for booking with K2025 Mobile Carwash!\n\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nLocation: ${bookingData.location}\nServices: ${bookingData.services.join(', ')}\nTotal Price: R${bookingData.totalPrice}\n\nWe'll see you soon!`
  }
}

export function generateContractConfirmationEmail(contractData: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contract Confirmation - K2025 Mobile Carwash</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .contract-details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 K2025 Mobile Carwash</h1>
          <h2>Contract Activated</h2>
        </div>
        
        <div class="content">
          <p>Dear ${contractData.customerName},</p>
          <p>Great news! Your contract with K2025 Mobile Carwash has been activated and is ready to use.</p>
          
          <div class="contract-details">
            <h3>Contract Details</h3>
            <p><strong>Contract Type:</strong> ${contractData.contractType}</p>
            <p><strong>Total Washes:</strong> ${contractData.totalWashes}</p>
            <p><strong>Remaining Washes:</strong> ${contractData.remainingWashes}</p>
            <p><strong>Contract Value:</strong> R${contractData.totalPrice}</p>
            <p><strong>Valid From:</strong> ${contractData.startDate}</p>
            <p><strong>Valid Until:</strong> ${contractData.endDate}</p>
          </div>
          
          <div class="contract-details">
            <h3>How to Use Your Contract</h3>
            <ul>
              <li>Book washes through our website or customer portal</li>
              <li>Simply select your services and use your contract credits at checkout</li>
              <li>Track your remaining washes in the customer portal</li>
              <li>Enjoy priority booking for all your appointments</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/customer" class="button">Go to Customer Portal</a>
            <a href="${process.env.NEXTAUTH_URL}/booking" class="button">Book Your First Wash</a>
          </div>
        </div>
        
        <div class="footer">
          <p>K2025 Mobile Carwash</p>
          <p>Email: info@k2025carwash.co.za | Phone: +27 XX XXX XXXX</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    subject: 'Contract Activated - K2025 Mobile Carwash',
    html,
    text: `Contract Activated - K2025 Mobile Carwash\n\nDear ${contractData.customerName},\n\nYour contract has been activated!\n\nContract Type: ${contractData.contractType}\nTotal Washes: ${contractData.totalWashes}\nRemaining Washes: ${contractData.remainingWashes}\nValid Until: ${contractData.endDate}\n\nStart booking your washes today!`
  }
}