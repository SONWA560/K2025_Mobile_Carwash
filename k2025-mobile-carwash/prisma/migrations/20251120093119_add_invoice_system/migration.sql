-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "invoiceNumber" TEXT,
    "invoiceSentAt" DATETIME,
    "invoiceExpiresAt" DATETIME,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paidAt" DATETIME,
    "paidAmount" REAL,
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("basePrice", "createdAt", "date", "distance", "endTime", "id", "location", "notes", "numberOfCars", "serviceCharge", "status", "time", "totalPrice", "updatedAt", "userId", "vehicleType", "withinRadius") SELECT "basePrice", "createdAt", "date", "distance", "endTime", "id", "location", "notes", "numberOfCars", "serviceCharge", "status", "time", "totalPrice", "updatedAt", "userId", "vehicleType", "withinRadius" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE UNIQUE INDEX "bookings_invoiceNumber_key" ON "bookings"("invoiceNumber");
CREATE TABLE "new_contracts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "totalWashes" INTEGER NOT NULL,
    "usedWashes" INTEGER NOT NULL DEFAULT 0,
    "remainingWashes" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "contractUrl" TEXT,
    "signatureUrl" TEXT,
    "invoiceNumber" TEXT,
    "invoiceSentAt" DATETIME,
    "invoiceExpiresAt" DATETIME,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paidAt" DATETIME,
    "paidAmount" REAL,
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contracts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_contracts" ("contractType", "contractUrl", "createdAt", "endDate", "id", "remainingWashes", "signatureUrl", "startDate", "status", "totalPrice", "totalWashes", "updatedAt", "usedWashes", "userId") SELECT "contractType", "contractUrl", "createdAt", "endDate", "id", "remainingWashes", "signatureUrl", "startDate", "status", "totalPrice", "totalWashes", "updatedAt", "usedWashes", "userId" FROM "contracts";
DROP TABLE "contracts";
ALTER TABLE "new_contracts" RENAME TO "contracts";
CREATE UNIQUE INDEX "contracts_invoiceNumber_key" ON "contracts"("invoiceNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
