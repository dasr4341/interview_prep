/*
  Warnings:

  - The `key` column on the `car_documents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "car_documents" DROP COLUMN "key",
ADD COLUMN     "key" TEXT[];
