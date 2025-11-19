'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Droplets, Sparkles, Shield, Sun } from 'lucide-react'

const services = [
  {
    id: 'exterior-basic',
    name: 'Exterior Wash',
    description: 'Pre-rinse hand wash, tyre and rim clean, windows quick dry, light wax spray (optional)',
    price: { small: { min: 120, max: 150 }, suv: { min: 150, max: 180 } },
    duration: { min: 30, max: 45 },
    category: 'basic',
    tier: 'basic',
    icon: Droplets,
    features: [
      'Pre-rinse hand wash',
      'Tyre and rim cleaning',
      'Windows quick dry',
      'Light wax spray (optional)',
      'Mobile service at your location'
    ],
    popular: false
  },
  {
    id: 'interior-basic',
    name: 'Interior Wash',
    description: 'Vacuuming, wipe down of surfaces, windows, door panels',
    price: { small: { min: 100, max: 130 }, suv: { min: 130, max: 260 } },
    duration: { min: 25, max: 40 },
    category: 'basic',
    tier: 'basic',
    icon: Sparkles,
    features: [
      'Complete vacuuming',
      'Surface wipe down',
      'Window cleaning',
      'Door panel cleaning',
      'Interior freshening'
    ],
    popular: false
  },
  {
    id: 'standard-full',
    name: 'Standard Full Package',
    description: 'Full exterior wash, tyre shine, full vacuum, dashboard and panel clean, windows inside and out',
    price: { small: { min: 250, max: 300 }, suv: { min: 300, max: 350 } },
    duration: { min: 60, max: 90 },
    category: 'standard',
    tier: 'standard',
    icon: Shield,
    features: [
      'Everything in Basic Wash',
      'Full exterior wash',
      'Tyre shine application',
      'Complete interior vacuum',
      'Dashboard and panel cleaning',
      'Interior and exterior windows',
      'Mobile service at your location'
    ],
    popular: true
  },
  {
    id: 'premium-detailing',
    name: 'Deep Interior Detailing',
    description: 'Seat deep cleaning, shampooing, deep vacuuming, odour removal, detail cleaning in corners and panels',
    price: { min: 400, max: 600 },
    duration: { min: 120, max: 180 },
    category: 'premium',
    tier: 'premium',
    icon: Sun,
    features: [
      'Seat deep cleaning and shampooing',
      'Deep vacuuming',
      'Odour removal treatment',
      'Detail corner and panel cleaning',
      'Fabric protection (optional)',
      'Premium cleaning products',
      'Mobile service at your location'
    ],
    popular: false
  }
]

interface GlossIQPricingProps {
  vehicleType?: 'small' | 'suv'
  onServiceSelect?: (serviceId: string) => void
}

export default function GlossIQPricing({ vehicleType = 'small', onServiceSelect }: GlossIQPricingProps) {
  const getServicePrice = (service: any) => {
    if (typeof service.price === 'object' && 'min' in service.price && !('small' in service.price)) {
      return service.price.min // Premium service
    }
    if (typeof service.price === 'object' && 'small' in service.price) {
      return service.price[vehicleType].min // Basic or standard service
    }
    return 0
  }



  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Professional car care solutions for every need</p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const IconComponent = service.icon
            const price = getServicePrice(service)
            
            return (
              <Card key={service.id} className={`relative flex flex-col ${service.popular ? 'ring-2 ring-glossiq-primary/20' : ''}`}>
                {service.popular && (
                  <span className="bg-glossiq-primary absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                    Most Popular
                  </span>
                )}

                <div className="flex flex-col">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-glossiq-primary/10">
                      <IconComponent className="h-6 w-6 text-glossiq-primary" />
                    </div>
                    <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
                    <div className="my-3 space-y-1">
                      <span className="block text-2xl font-bold text-glossiq-primary">
                        From R{price}
                      </span>
                      <CardDescription className="text-sm">
                        {typeof service.duration === 'object' 
                          ? `${service.duration.min}-${service.duration.max} minutes`
                          : `${service.duration} minutes`
                        }
                      </CardDescription>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {service.tier.charAt(0).toUpperCase() + service.tier.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <hr className="border-dashed" />
                    
                    <ul className="list-outside space-y-3 text-sm">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2">
                          <Check className="mt-0.5 size-3 flex-shrink-0 text-glossiq-primary" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="mt-auto pt-4">
                    <Link href={`/booking?service=${service.id}`} className="w-full inline-block">
                      <Button
                        className={`w-full ${service.popular ? 'bg-glossiq-primary hover:bg-opacity-90 text-white' : 'bg-glossiq-secondary hover:bg-opacity-90 text-glossiq-primary'}`}
                        size="lg"
                      >
                        Book This Service
                      </Button>
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}