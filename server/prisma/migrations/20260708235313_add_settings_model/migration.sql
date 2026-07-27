-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "FontSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "TableDensity" AS ENUM ('COMFORTABLE', 'COMPACT', 'SPACIOUS');

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT,
    "registrationNumber" TEXT,
    "taxNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "currencySymbol" TEXT NOT NULL DEFAULT '₦',
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quotePrefix" TEXT NOT NULL DEFAULT 'QT',
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "paymentPrefix" TEXT NOT NULL DEFAULT 'PAY',
    "expensePrefix" TEXT NOT NULL DEFAULT 'EXP',
    "quoteValidity" INTEGER NOT NULL DEFAULT 30,
    "invoiceDueDays" INTEGER NOT NULL DEFAULT 30,
    "decimalPlaces" INTEGER NOT NULL DEFAULT 2,
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "sidebarCollapsed" BOOLEAN NOT NULL DEFAULT false,
    "fontSize" "FontSize" NOT NULL DEFAULT 'MEDIUM',
    "tableDensity" "TableDensity" NOT NULL DEFAULT 'COMFORTABLE',
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_createdById_key" ON "Setting"("createdById");

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
