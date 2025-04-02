/*
  Warnings:

  - The values [VIDEO_INSPECTION_REPORT,ALL] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('INSPECTION_REPORT', 'SERVICE_HISTORY', 'VIDEO');
ALTER TABLE "end_user_payment_logs" ALTER COLUMN "payment_flag" TYPE "PaymentType_new" USING ("payment_flag"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;
