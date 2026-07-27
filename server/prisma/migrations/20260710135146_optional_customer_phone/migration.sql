-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'SALES_ORDER';

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "phone" DROP NOT NULL;
