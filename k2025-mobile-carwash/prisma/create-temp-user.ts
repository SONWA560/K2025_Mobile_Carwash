import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a temp user for testing
  const tempUser = await prisma.user.upsert({
    where: { email: 'temp@example.com' },
    update: {},
    create: {
      email: 'temp@example.com',
      name: 'Temp User',
      password: 'temp-password',
      role: 'CUSTOMER'
    }
  })

  console.log('Created/updated temp user:', tempUser.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })