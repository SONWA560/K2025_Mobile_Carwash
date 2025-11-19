# K2025 Mobile Carwash

A comprehensive mobile car wash booking system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏠 Home Page
- Clean, professional design with water/shine color scheme
- Service showcase with pricing
- Trust indicators and customer testimonials
- WhatsApp integration for instant contact
- Responsive mobile-first design

### 📅 Booking System
- Multi-step booking process
- Service selection with pricing
- Date and time scheduling
- Location input for mobile service
- Multiple vehicle support
- Real-time price calculation

### 📋 Contract Management
- Bundle packages (10-wash, 20-wash contracts)
- Digital contract generation
- Electronic signature support
- Contract tracking and management
- Remaining washes calculation

### 💳 Payment Processing
- Stripe integration for secure payments
- Multiple payment methods
- Automatic receipt generation
- Webhook handling for payment confirmation

### 🛠️ Admin Dashboard
- Booking management and status updates
- Contract tracking
- Customer management
- Service pricing control
- Financial reporting
- Search and filtering capabilities

### 👤 Customer Portal
- Personal dashboard
- Booking history and management
- Contract balance tracking
- Profile management
- Booking editing capabilities

### 📱 Mobile Optimization
- Responsive design for all devices
- Mobile navigation menu
- Touch-friendly interfaces
- Progressive Web App ready

### 📧 Notifications
- Email notifications for bookings
- WhatsApp integration
- Automated reminders
- Contract activation notifications

### 📝 Blog System
- Car care tips and articles
- SEO-friendly content
- Category filtering
- Search functionality
- Newsletter signup

## Technology Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Prisma with SQLite (development), PostgreSQL (production)
- **Payments**: Stripe
- **Email**: Nodemailer
- **Notifications**: WhatsApp Business API
- **Authentication**: NextAuth.js (ready for implementation)
- **Deployment**: Vercel ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd k2025-mobile-carwash
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_your-stripe-public-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# WhatsApp (optional)
WHATSAPP_PHONE_NUMBER="+27xxxxxxxxx"
WHATSAPP_API_TOKEN="your-whatsapp-token"
```

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── booking/           # Booking system
│   ├── contracts/         # Contract management
│   ├── customer/          # Customer portal
│   ├── blog/              # Blog system
│   └── payment/           # Payment processing
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── PaymentForm.tsx    # Payment component
│   ├── ContractForm.tsx   # Contract generator
│   └── MobileNavigation.tsx
├── lib/                  # Utility functions
│   ├── prisma.ts         # Database client
│   ├── email.ts           # Email service
│   └── whatsapp.ts       # WhatsApp service
└── types/                # TypeScript definitions
```

## Key Features Implementation

### Booking Flow
1. Service selection with real-time pricing
2. Date/time scheduling with availability
3. Location input for mobile service
4. Multiple vehicle support
5. Review and confirmation
6. Payment processing
7. Automated notifications

### Contract System
1. Package selection (Basic, Premium, Ultimate)
2. Customer information collection
3. Digital contract generation
4. Electronic signature capture
5. Payment processing
6. Contract activation and tracking

### Admin Dashboard
1. Real-time booking management
2. Contract tracking and analytics
3. Customer relationship management
4. Service pricing control
5. Financial reporting
6. Search and filtering

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

### Required for Production
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Your application URL
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

### Optional
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Email configuration
- `WHATSAPP_PHONE_NUMBER`, `WHATSAPP_API_TOKEN`: WhatsApp Business API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact:
- Email: info@k2025carwash.co.za
- Phone: +27 XX XXX XXXX
- WhatsApp: +27 XXX XXX XXXX

---

Built with ❤️ for K2025 Mobile Carwash
