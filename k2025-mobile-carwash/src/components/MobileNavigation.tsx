'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, Home, Calendar, FileText, User, Phone } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Book Now', href: '/booking', icon: Calendar },
  { name: 'Customer Portal', href: '/customer', icon: User },
  { name: 'WhatsApp', href: 'https://wa.me/message/EEHXH5L5F5U6J1', icon: Phone, external: true },
]

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="flex justify-around items-center">
          {navigation.slice(0, 4).map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'text-glossiq-primary' : ''}`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          
          {/* More menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="mobile-nav-item">
                <Menu className="h-5 w-5 mb-1" />
                <span>More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {navigation.map((item) => {
                  const IconComponent = item.icon
                  const isActive = pathname === item.href
                  
                  if (item.external) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 ${
                          isActive ? 'bg-blue-50 text-glossiq-primary' : ''
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    )
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 ${
                        isActive ? 'bg-blue-50 text-glossiq-primary' : ''
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                
                <div className="border-t pt-4 mt-4">
                  <Link href="/admin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                    <User className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}