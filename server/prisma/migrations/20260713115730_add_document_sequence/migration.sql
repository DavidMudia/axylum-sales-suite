/*
  Warnings:

  - The values [INVENTORY_COUNT] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isDeleted` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `isRefunded` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationCode]` on the table `Refund` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `module` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `action` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `module` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refundMethod` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationCode` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SALES', 'STORE_KEEPER', 'ACCOUNTANT');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'PRINT', 'EXPORT', 'POST', 'CANCEL');

-- CreateEnum
CREATE TYPE "AuditModule" AS ENUM ('PAYMENT', 'REFUND', 'WAYBILL', 'PURCHASE_ORDER', 'GOODS_RECEIPT', 'INVENTORY_COUNT');

-- CreateEnum
CREATE TYPE "RefundMethod" AS ENUM ('CASH', 'TRANSFER', 'CARD', 'CHEQUE', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('QUOTE', 'SALES_ORDER', 'INVOICE', 'PAYMENT', 'REFUND', 'WAYBILL', 'PURCHASE_ORDER', 'GOODS_RECEIPT');
ALTER TABLE "DocumentSequence" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "public"."DocumentType_old";
COMMIT;

-- DropIndex
DROP INDEX "Payment_customerId_idx";

-- DropIndex
DROP INDEX "Payment_invoiceId_idx";

-- DropIndex
DROP INDEX "Payment_paymentNumber_idx";

-- DropIndex
DROP INDEX "Payment_status_idx";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "module",
ADD COLUMN     "module" "AuditModule" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "isDeleted",
DROP COLUMN "isRefunded",
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledById" INTEGER,
ADD COLUMN     "refundedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "paymentMethod" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "action" "PermissionAction" NOT NULL,
ADD COLUMN     "module" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Refund" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "refundMethod" "RefundMethod" NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "verificationCode" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "displayName" TEXT NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "RoleName" NOT NULL,
ALTER COLUMN "isSystem" SET DEFAULT true;

-- AlterTable
ALTER TABLE "RolePermission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "AuditLog_module_idx" ON "AuditLog"("module");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_verificationCode_key" ON "Refund"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
