/*
  Warnings:

  - A unique constraint covering the columns `[customerNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerNumber` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityAfter` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityBefore` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `referenceType` on the `InventoryMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InventoryReferenceType" AS ENUM ('MANUAL', 'PURCHASE_ORDER', 'GOODS_RECEIPT', 'SALES_ORDER', 'INVOICE', 'PAYMENT', 'REFUND', 'STOCK_COUNT', 'TRANSFER');

-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'CUSTOMER';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "customerNumber" TEXT NOT NULL,
ADD COLUMN     "outstandingBalance" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "InventoryMovement" ADD COLUMN     "quantityAfter" INTEGER NOT NULL,
ADD COLUMN     "quantityBefore" INTEGER NOT NULL,
DROP COLUMN "referenceType",
ADD COLUMN     "referenceType" "InventoryReferenceType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerNumber_key" ON "Customer"("customerNumber");
