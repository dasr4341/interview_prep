/*
  Warnings:

  - The values [PAYMENT_INITIATED,PAYMENT_SUCCESS,PAYMENT_FAILED] on the enum `QuotationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuotationStatus_new" AS ENUM ('PENDING', 'CANCELLED', 'ACTIVE', 'EXPIRED');
ALTER TABLE "quotation" ALTER COLUMN "status" TYPE "QuotationStatus_new" USING ("status"::text::"QuotationStatus_new");
ALTER TYPE "QuotationStatus" RENAME TO "QuotationStatus_old";
ALTER TYPE "QuotationStatus_new" RENAME TO "QuotationStatus";
DROP TYPE "QuotationStatus_old";
COMMIT;
