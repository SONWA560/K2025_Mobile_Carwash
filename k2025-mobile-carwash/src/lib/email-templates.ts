import { sendEmail } from './email'

export interface InvoiceEmailData {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  amount: number
  dueDate: string
  paymentInfo: {
    bankName: string
    accountName: string
    accountNumber: string
    reference: string
  }
  type: 'booking' | 'contract'
  services?: string[]
  contractType?: string
}

export interface ReminderEmailData {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  amount: number
  dueDate: string
  hoursUntilExpiry: number
  paymentInfo: {
    bankName: string
    accountName: string
    accountNumber: string
    reference: string
  }
}

export interface OverdueEmailData {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  amount: number
  paymentInfo: {
    bankName: string
    accountName: string
    accountNumber: string
    reference: string
  }
}

export function generateInvoiceEmail(data: InvoiceEmailData) {
  const subject = `Invoice ${data.invoiceNumber} - K2025 Mobile Carwash`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - K2025 Mobile Carwash</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #23336E 0%, #1a2856 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .invoice-details { background: #f8f9fa; padding: 20px; border-left: 4px solid #23336E; border-radius: 4px; margin: 20px 0; }
        .payment-info { background: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #dee2e6; background: #f8f9fa; border-radius: 0 0 8px 8px; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .expiry-notice { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center; }
        .btn { display: inline-block; padding: 12px 24px; background: #23336E; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚗 K2025 Mobile Carwash</div>
          <h2>Invoice ${data.invoiceNumber}</h2>
          <p>Thank you for your business!</p>
        </div>
        
        <div class="content">
          <div class="expiry-notice">
            <strong>⏰ Important:</strong> This invoice expires on ${data.dueDate}. Please complete payment to avoid cancellation.
          </div>
          
          <div class="invoice-details">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p><strong>Amount Due:</strong> R${data.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Type:</strong> ${data.type === 'booking' ? 'Service Booking' : 'Contract Package'}</p>
            ${data.services ? `<p><strong>Services:</strong> ${data.services.join(', ')}</p>` : ''}
            ${data.contractType ? `<p><strong>Contract:</strong> ${data.contractType}</p>` : ''}
          </div>

          <div class="payment-info">
            <h3>💳 Payment Information</h3>
            <p><strong>Bank:</strong> ${data.paymentInfo.bankName}</p>
            <p><strong>Account Name:</strong> ${data.paymentInfo.accountName}</p>
            <p><strong>Account Number:</strong> ${data.paymentInfo.accountNumber}</p>
            <p><strong>Reference:</strong> <code>${data.paymentInfo.reference}</code></p>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
              Please use invoice number as your payment reference to ensure proper allocation.
            </p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="#" class="btn">View Full Invoice</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing K2025 Mobile Carwash!</strong></p>
          <p>Email: gloss.iq.info@gmail.com | Phone: 071 869 2274</p>
          <p>📍 Mobile Service - We come to you! | 🕐 7 Days a Week</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Dear ${data.customerName},

Thank you for choosing K2025 Mobile Carwash!

Invoice Details:
- Invoice Number: ${data.invoiceNumber}
- Amount Due: R${data.amount.toFixed(2)}
- Due Date: ${data.dueDate}
- Type: ${data.type === 'booking' ? 'Service Booking' : 'Contract Package'}
${data.services ? `- Services: ${data.services.join(', ')}` : ''}
${data.contractType ? `- Contract: ${data.contractType}` : ''}

Payment Information:
- Bank: ${data.paymentInfo.bankName}
- Account Name: ${data.paymentInfo.accountName}
- Account Number: ${data.paymentInfo.accountNumber}
- Reference: ${data.paymentInfo.reference}

Please use the invoice number as your payment reference.

This invoice expires within 24 hours. Please complete payment to avoid cancellation.

Thank you for your business!

Best regards,
The K2025 Mobile Carwash Team
  `

  return { subject, html, text }
}

export function generateReminderEmail(data: ReminderEmailData) {
  const urgencyLevel = data.hoursUntilExpiry <= 6 ? 'URGENT' : 'Reminder'
  const subject = `${urgencyLevel}: Invoice ${data.invoiceNumber} expires soon!`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Reminder - K2025 Mobile Carwash</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: ${data.hoursUntilExpiry <= 6 ? '#dc3545' : '#ff9800'}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .alert { background: ${data.hoursUntilExpiry <= 6 ? '#f8d7da' : '#fff3cd'}; border: 1px solid ${data.hoursUntilExpiry <= 6 ? '#f5c6cb' : '#ffeaa7'}; color: ${data.hoursUntilExpiry <= 6 ? '#721c24' : '#856404'}; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center; }
        .payment-info { background: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #dee2e6; background: #f8f9fa; border-radius: 0 0 8px 8px; }
        .btn { display: inline-block; padding: 12px 24px; background: #23336E; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>⏰ ${urgencyLevel}</h2>
          <p>Invoice ${data.invoiceNumber} expires in ${data.hoursUntilExpiry} hours</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <strong>Payment Required:</strong> Your invoice expires on ${data.dueDate}. 
            ${data.hoursUntilExpiry <= 6 ? 'Please complete payment immediately to avoid cancellation.' : 'Please complete payment soon to secure your booking.'}
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3>Invoice Summary</h3>
            <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p><strong>Amount Due:</strong> R${data.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Time Remaining:</strong> ${data.hoursUntilExpiry} hours</p>
          </div>

          <div class="payment-info">
            <h3>💳 Payment Information</h3>
            <p><strong>Bank:</strong> ${data.paymentInfo.bankName}</p>
            <p><strong>Account Name:</strong> ${data.paymentInfo.accountName}</p>
            <p><strong>Account Number:</strong> ${data.paymentInfo.accountNumber}</p>
            <p><strong>Reference:</strong> <code>${data.paymentInfo.reference}</code></p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="#" class="btn">Complete Payment Now</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at gloss.iq.info@gmail.com or 071 869 2274</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
${urgencyLevel}: Invoice ${data.invoiceNumber} Payment Reminder

Dear ${data.customerName},

This is a ${data.hoursUntilExpiry <= 6 ? 'URGENT' : 'friendly'} reminder that your invoice expires in ${data.hoursUntilExpiry} hours.

Invoice Details:
- Invoice Number: ${data.invoiceNumber}
- Amount Due: R${data.amount.toFixed(2)}
- Due Date: ${data.dueDate}
- Time Remaining: ${data.hoursUntilExpiry} hours

Payment Information:
- Bank: ${data.paymentInfo.bankName}
- Account Name: ${data.paymentInfo.accountName}
- Account Number: ${data.paymentInfo.accountNumber}
- Reference: ${data.paymentInfo.reference}

${data.hoursUntilExpiry <= 6 ? 'Please complete payment immediately to avoid cancellation.' : 'Please complete payment soon to secure your booking.'}

If you have already made payment, please disregard this notice.

Thank you for your business!

Best regards,
The K2025 Mobile Carwash Team
  `

  return { subject, html, text }
}

export function generateOverdueEmail(data: OverdueEmailData) {
  const subject = `OVERDUE: Invoice ${data.invoiceNumber} - K2025 Mobile Carwash`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Overdue Invoice - K2025 Mobile Carwash</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .alert { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #dee2e6; background: #f8f9fa; border-radius: 0 0 8px 8px; }
        .btn { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>❌ Invoice Overdue</h2>
          <p>Invoice ${data.invoiceNumber} has expired</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <strong>Important:</strong> Your invoice has expired and your booking may be cancelled. 
            Please contact us immediately if you wish to proceed with your service.
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3>Overdue Invoice Details</h3>
            <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p><strong>Amount Due:</strong> R${data.amount.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">OVERDUE</span></p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <p>If you believe this is an error or wish to make alternative arrangements, please contact us immediately.</p>
            <a href="mailto:gloss.iq.info@gmail.com" class="btn">Contact Support</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Immediate assistance: gloss.iq.info@gmail.com | 071 869 2274</p>
          <p>© 2025 K2025 Mobile Carwash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
OVERDUE INVOICE NOTICE - K2025 Mobile Carwash

Dear ${data.customerName},

Invoice ${data.invoiceNumber} has expired.

Overdue Invoice Details:
- Invoice Number: ${data.invoiceNumber}
- Amount Due: R${data.amount.toFixed(2)}
- Status: OVERDUE

Your booking may be cancelled due to non-payment. If you believe this is an error or wish to make alternative arrangements, please contact us immediately.

Contact Information:
- Email: gloss.iq.info@gmail.com
- Phone: 071 869 2274

We appreciate your prompt attention to this matter.

Best regards,
The K2025 Mobile Carwash Team
  `

  return { subject, html, text }
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const { subject, html, text } = generateInvoiceEmail(data)
  return await sendEmail({
    to: data.customerEmail,
    subject,
    html,
    text
  })
}

export async function sendReminderEmail(data: ReminderEmailData) {
  const { subject, html, text } = generateReminderEmail(data)
  return await sendEmail({
    to: data.customerEmail,
    subject,
    html,
    text
  })
}

export async function sendOverdueEmail(data: OverdueEmailData) {
  const { subject, html, text } = generateOverdueEmail(data)
  return await sendEmail({
    to: data.customerEmail,
    subject,
    html,
    text
  })
}