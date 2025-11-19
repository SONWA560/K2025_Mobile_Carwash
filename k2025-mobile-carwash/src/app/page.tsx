'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { NavBar } from '@/components/ui/tubelight-navbar'
import NeuralNetworkHero from '@/components/ui/neural-network-hero'
import PaginationAnt from '@/components/ui/pagination-ant'
import { 
  Droplets, 
  Sparkles, 
  Shield, 
  Sun, 
  CircleDollarSign,
  Calendar,
  Phone,
  MapPin,
  Star,

  Home,
  CalendarDays,
  User
} from 'lucide-react'

const services = [
  // Basic Services
  {
    id: 'exterior-basic',
    name: 'Exterior Wash',
    description: 'Pre-rinse hand wash, tyre and rim clean, windows quick dry, light wax spray (optional)',
    price: { small: { min: 120, max: 150 }, suv: { min: 150, max: 180 } },
    duration: { min: 30, max: 45 },
    category: 'basic',
    tier: 'basic',
    icon: Droplets
  },
  {
    id: 'interior-basic',
    name: 'Interior Wash',
    description: 'Vacuuming, wipe down of surfaces, windows, door panels',
    price: { small: { min: 100, max: 130 }, suv: { min: 130, max: 260 } },
    duration: { min: 25, max: 40 },
    category: 'basic',
    tier: 'basic',
    icon: Sparkles
  },
  // Standard Package
  {
    id: 'standard-full',
    name: 'Standard Full Package',
    description: 'Full exterior wash, tyre shine, full vacuum, dashboard and panel clean, windows inside and out',
    price: { small: { min: 250, max: 300 }, suv: { min: 300, max: 350 } },
    duration: { min: 60, max: 90 },
    category: 'standard',
    tier: 'standard',
    icon: Shield
  },
  // Premium Services
  {
    id: 'premium-detailing',
    name: 'Deep Interior Detailing',
    description: 'Seat deep cleaning, shampooing, deep vacuuming, odour removal, detail cleaning in corners and panels',
    price: { min: 400, max: 600 },
    duration: { min: 120, max: 180 },
    category: 'premium',
    tier: 'premium',
    icon: Sun
  }
]

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "#services", icon: Droplets },
  { name: "Book Now", url: "/booking", icon: CalendarDays },
  { name: "Admin", url: "/admin", icon: User },
]

export default function HomePage() {
  const [servicePage, setServicePage] = useState(1)
  const servicesPerPage = 6
  
  const paginatedServices = services.slice(
    (servicePage - 1) * servicesPerPage,
    servicePage * servicesPerPage
  )

  return (
    <div className="min-h-screen">
      {/* Tubelight Navbar */}
      <NavBar items={navItems} />

      {/* Neural Network Hero Section */}
      <NeuralNetworkHero 
        title="Premium Car Care at Your Location"
        description="Experience the convenience of professional car washing and detailing right at your doorstep. We bring advanced equipment and premium products to you."
        badgeText="Professional Mobile Service"
        badgeLabel="GlossIQ"
        ctaButtons={[
          { text: "Book Your Wash Now", href: "/booking", primary: true },
          { text: "View Our Services", href: "#services" }
        ]}
        microDetails={["Mobile Service", "Premium Products", "7 Days a Week"]}
      />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/27xxxxxxxxx" 
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contact us on WhatsApp"
      >
        <Phone className="h-6 w-6" />
      </a>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="font-semibold">4.9/5 Rating</h3>
              <p className="text-gray-600">500+ Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-glossiq-primary mb-2" />
              <h3 className="font-semibold">Mobile Service</h3>
              <p className="text-gray-600">We Come to You</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Insured</h3>
              <p className="text-gray-600">Fully Covered</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-8 w-8 text-glossiq-primary mb-2" />
              <h3 className="font-semibold">Flexible Scheduling</h3>
              <p className="text-gray-600">7 Days a Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Professional car care solutions for every need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedServices.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8 text-glossiq-primary" />
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                         <CardDescription>
                           {typeof service.duration === 'object' 
                             ? `${service.duration.min}-${service.duration.max} minutes`
                             : `${service.duration} minutes`
                           }
                         </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                     <div className="flex justify-between items-center">
                       <div>
                         <span className="text-lg font-bold text-glossiq-primary">
                           From R{typeof service.price === 'object' && 'min' in service.price ? service.price.min : service.price.small?.min || service.price.min}
                         </span>
                         <p className="text-sm text-gray-500">
                           {typeof service.duration === 'object' 
                             ? `${service.duration.min}-${service.duration.max} min`
                             : `${service.duration} min`
                           }
                         </p>
                       </div>
            <Link href={`/booking?service=${service.id}`}>
              <Button className="bg-glossiq-primary hover:bg-opacity-90">Book Now</Button>
            </Link>
                     </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <PaginationAnt
            current={servicePage}
            total={services.length}
            pageSize={servicesPerPage}
            showSizeChanger={false}
            showQuickJumper={false}
            onChange={(page) => setServicePage(page)}
          />
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 bg-glossiq-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready for a Spotless Car?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Book your mobile car wash service today and experience the convenience
          </p>
          <Link href="/booking">
            <Button size="lg" className="px-8 py-3 bg-white text-glossiq-primary hover:bg-gray-100">
              Book Your Wash Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 pb-20 md:pb-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/GlossIQ_logo.png" alt="GlossIQ" className="h-16 w-auto max-w-none" />
                <h3 className="text-lg font-semibold">GlossIQ</h3>
              </div>
              <p className="text-gray-400">Professional car care at your convenience</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Exterior Wash</li>
                <li>Interior Detailing</li>
                <li>Paint Protection</li>
                <li>Contract Packages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Phone: +27 XX XXX XXXX</li>
                <li>Email: info@k2025carwash.co.za</li>
                <li>
                  <a href="https://wa.me/27xxxxxxxxx" className="text-green-400 hover:text-green-300">
                    WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GlossIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}