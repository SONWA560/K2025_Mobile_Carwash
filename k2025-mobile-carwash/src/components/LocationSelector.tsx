'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, AlertTriangle, CheckCircle } from 'lucide-react'

interface LocationData {
  address: string
  distance: number
  withinRadius: boolean
  serviceCharge?: number
}

interface LocationSelectorProps {
  onLocationChange: (locationData: LocationData) => void
  initialLocation?: string
}

// Danoon coordinates (base location)
const BASE_LOCATION = { lat: -26.5375, lng: 31.0989 } // Approximate coordinates for Danoon
const SERVICE_RADIUS_KM = 20
const SERVICE_CHARGE_RATE = 20 // R20 per km beyond 20km

export default function LocationSelector({ onLocationChange, initialLocation }: LocationSelectorProps) {
  const [address, setAddress] = useState(initialLocation || '')
  const [isLoading, setIsLoading] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Geocode address to get coordinates
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`
      )
      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].geometry.location
      }
      return null
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  const handleAddressSubmit = async () => {
    if (!address.trim()) {
      setError('Please enter an address')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // For demo purposes, simulate distance calculation
      // In production, replace with actual Google Maps API call
      const mockDistance = Math.random() * 50 // Random distance for demo
      const withinRadius = mockDistance <= SERVICE_RADIUS_KM
      const serviceCharge = withinRadius ? 0 : Math.ceil((mockDistance - SERVICE_RADIUS_KM) * SERVICE_CHARGE_RATE)

      const newLocationData: LocationData = {
        address: address.trim(),
        distance: mockDistance,
        withinRadius,
        serviceCharge
      }

      setLocationData(newLocationData)
      onLocationChange(newLocationData)
    } catch (err) {
      setError('Failed to calculate distance. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Service Location
        </CardTitle>
        <CardDescription>
          Enter your address to check if you're within our 20km service radius from Danoon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Your Address</Label>
          <div className="flex space-x-2">
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              className="flex-1"
            />
            <Button 
              onClick={handleAddressSubmit} 
              disabled={isLoading || !address.trim()}
              className="whitespace-nowrap"
            >
              {isLoading ? 'Checking...' : 'Check Distance'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {locationData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {locationData.withinRadius ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className="font-medium">Distance from Danoon</span>
              </div>
              <Badge variant={locationData.withinRadius ? "default" : "secondary"}>
                {locationData.distance.toFixed(1)} km
              </Badge>
            </div>

            {locationData.withinRadius ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Great!</strong> You're within our service area. No additional charges apply.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm mb-2">
                  <strong>Service Charge:</strong> You're {locationData.distance.toFixed(1)}km from our base location.
                </p>
                <p className="text-yellow-800 text-sm font-medium">
                  Additional service charge: R{locationData.serviceCharge}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Base location: Danoon</p>
              <p>Service radius: {SERVICE_RADIUS_KM}km</p>
              {!locationData.withinRadius && (
                <p>Service charge: R{SERVICE_CHARGE_RATE} per km beyond {SERVICE_RADIUS_KM}km</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}