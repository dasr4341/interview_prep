/*
  Warnings:

  - You are about to drop the column `inspection_report` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `service_history` on the `car` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CarDocumentType" AS ENUM ('INSPECTION_REPORT', 'SERVICE_HISTORY');

-- AlterTable
ALTER TABLE "car" DROP COLUMN "inspection_report",
DROP COLUMN "service_history";

-- CreateTable
CREATE TABLE "car_documents" (
    "id" UUID NOT NULL,
    "fileName" "CarDocumentType" NOT NULL,
    "key" TEXT NOT NULL,
    "carId" UUID,

    CONSTRAINT "car_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car_documents" ADD CONSTRAINT "car_documents_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
