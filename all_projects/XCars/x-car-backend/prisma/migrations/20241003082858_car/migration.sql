/*
  Warnings:

  - The values [IMAGE] on the enum `CarDocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CarDocumentType_new" AS ENUM ('INSPECTION_REPORT', 'SERVICE_HISTORY');
ALTER TABLE "car_documents" ALTER COLUMN "fileName" TYPE "CarDocumentType_new" USING ("fileName"::text::"CarDocumentType_new");
ALTER TYPE "CarDocumentType" RENAME TO "CarDocumentType_old";
ALTER TYPE "CarDocumentType_new" RENAME TO "CarDocumentType";
DROP TYPE "CarDocumentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "car" ADD COLUMN     "images" TEXT[];
