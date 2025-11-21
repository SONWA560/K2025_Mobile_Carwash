import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample services
  const exteriorWash = await prisma.service.create({
    data: {
      name: 'Exterior Wash',
      description: 'Pre-rinse hand wash, tyre and rim clean, windows quick dry, light wax spray',
      tier: 'BASIC',
      category: 'exterior',
      durationMin: 30,
      durationMax: 45,
      prices: {
        create: [
          { vehicleType: 'SMALL', priceMin: 120, priceMax: 150 },
          { vehicleType: 'SUV', priceMin: 150, priceMax: 180 }
        ]
      }
    }
  })

  const interiorWash = await prisma.service.create({
    data: {
      name: 'Interior Wash',
      description: 'Vacuuming, wipe down of surfaces, windows, door panels',
      tier: 'BASIC',
      category: 'interior',
      durationMin: 25,
      durationMax: 40,
      prices: {
        create: [
          { vehicleType: 'SMALL', priceMin: 100, priceMax: 130 },
          { vehicleType: 'SUV', priceMin: 120, priceMax: 150 }
        ]
      }
    }
  })

  const standardFull = await prisma.service.create({
    data: {
      name: 'Standard Full Package',
      description: 'Full exterior wash, tyre shine, full vacuum, dashboard and panel clean, windows inside and out',
      tier: 'STANDARD',
      category: 'full',
      durationMin: 60,
      durationMax: 90,
      prices: {
        create: [
          { vehicleType: 'SMALL', priceMin: 250, priceMax: 300 },
          { vehicleType: 'SUV', priceMin: 300, priceMax: 350 }
        ]
      }
    }
  })

  const premiumDetail = await prisma.service.create({
    data: {
      name: 'Premium Detail',
      description: 'Everything in Standard plus clay bar treatment, premium wax application, leather conditioning, engine bay cleaning',
      tier: 'PREMIUM',
      category: 'detailing',
      durationMin: 120,
      durationMax: 180,
      prices: {
        create: [
          { vehicleType: 'SMALL', priceMin: 500, priceMax: 600 },
          { vehicleType: 'SUV', priceMin: 600, priceMax: 700 }
        ]
      }
    }
  })

  console.log('Created services:', {
    exteriorWash: exteriorWash.id,
    interiorWash: interiorWash.id,
    standardFull: standardFull.id,
    premiumDetail: premiumDetail.id
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })