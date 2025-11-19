/*
  Warnings:

  - You are about to drop the column `duration` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `services` table. All the data in the column will be lost.
  - Added the required column `duration` to the `booking_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `booking_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMax` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMin` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tier` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "service_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "priceMin" REAL NOT NULL,
    "priceMax" REAL NOT NULL,
    CONSTRAINT "service_prices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_booking_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "booking_services_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "booking_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_booking_services" ("bookingId", "id", "serviceId") SELECT "bookingId", "id", "serviceId" FROM "booking_services";
DROP TABLE "booking_services";
ALTER TABLE "new_booking_services" RENAME TO "booking_services";
CREATE UNIQUE INDEX "booking_services_bookingId_serviceId_key" ON "booking_services"("bookingId", "serviceId");
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "endTime" TEXT,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "basePrice" REAL NOT NULL,
    "serviceCharge" REAL NOT NULL DEFAULT 0,
    "totalPrice" REAL NOT NULL,
    "notes" TEXT,
    "vehicleType" TEXT NOT NULL,
    "numberOfCars" INTEGER NOT NULL DEFAULT 1,
    "distance" REAL,
    "withinRadius" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("createdAt", "date", "id", "location", "notes", "status", "time", "totalPrice", "updatedAt", "userId") SELECT "createdAt", "date", "id", "location", "notes", "status", "time", "totalPrice", "updatedAt", "userId" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "durationMax" INTEGER NOT NULL
);
INSERT INTO "new_services" ("category", "createdAt", "description", "id", "isActive", "name", "updatedAt") SELECT "category", "createdAt", "description", "id", "isActive", "name", "updatedAt" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "service_prices_serviceId_vehicleType_key" ON "service_prices"("serviceId", "vehicleType");
