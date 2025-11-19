import { addMinutes, isAfter, isBefore, parse, format } from 'date-fns'

export interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

export interface BookingBlock {
  startTime: Date
  endTime: Date
  serviceName: string
}

// Mock existing bookings - in production, this would come from database
const mockExistingBookings: BookingBlock[] = [
  {
    startTime: parse('09:00', 'HH:mm', new Date()),
    endTime: parse('10:30', 'HH:mm', new Date()),
    serviceName: 'Standard Full Package'
  },
  {
    startTime: parse('13:00', 'HH:mm', new Date()),
    endTime: parse('15:00', 'HH:mm', new Date()),
    serviceName: 'Deep Interior Detailing'
  }
]

// Generate time slots from 8:00 to 17:00 with 30-minute intervals
export const generateTimeSlots = (date: Date, serviceDuration: number): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startTime = parse('08:00', 'HH:mm', date)
  const endTime = parse('17:00', 'HH:mm', date)
  
  let currentTime = startTime
  
  while (isBefore(currentTime, endTime)) {
    const timeString = formatTime(currentTime)
    const slotEndTime = addMinutes(currentTime, serviceDuration)
    
    // Check if this slot is available
    const isSlotAvailable = checkSlotAvailability(currentTime, slotEndTime, mockExistingBookings)
    
    slots.push({
      time: timeString,
      available: isSlotAvailable,
      reason: isSlotAvailable ? undefined : 'Blocked by existing booking'
    })
    
    currentTime = addMinutes(currentTime, 30)
  }
  
  return slots
}

// Check if a time slot conflicts with existing bookings
const checkSlotAvailability = (
  slotStart: Date, 
  slotEnd: Date, 
  existingBookings: BookingBlock[]
): boolean => {
  for (const booking of existingBookings) {
    // Check if there's any overlap
    if (
      (isAfter(slotStart, booking.startTime) && isBefore(slotStart, booking.endTime)) ||
      (isAfter(slotEnd, booking.startTime) && isBefore(slotEnd, booking.endTime)) ||
      (isBefore(slotStart, booking.startTime) && isAfter(slotEnd, booking.endTime)) ||
      slotStart.getTime() === booking.startTime.getTime()
    ) {
      return false
    }
  }
  return true
}

// Format time to HH:mm string
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  })
}

// Get available time slots for a specific date and service duration
export const getAvailableTimeSlots = (date: Date, serviceDuration: number): string[] => {
  const slots = generateTimeSlots(date, serviceDuration)
  return slots.filter(slot => slot.available).map(slot => slot.time)
}

// Check if a specific time slot is available for a given duration
export const isTimeSlotAvailable = (
  date: Date, 
  timeString: string, 
  serviceDuration: number
): boolean => {
  const timeSlot = parse(timeString, 'HH:mm', date)
  const slotEndTime = addMinutes(timeSlot, serviceDuration)
  return checkSlotAvailability(timeSlot, slotEndTime, mockExistingBookings)
}

// Calculate end time for a booking
export const calculateBookingEndTime = (date: Date, timeString: string, duration: number): string => {
  const startTime = parse(timeString, 'HH:mm', date)
  const endTime = addMinutes(startTime, duration)
  return formatTime(endTime)
}