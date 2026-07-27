/*
  Warnings:

  - You are about to drop the column `price` on the `QuoteItem` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `QuoteItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuoteItem" DROP COLUMN "price",
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
