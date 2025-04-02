/*
  Warnings:

  - Added the required column `expiry_date` to the `quotation_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_leads_left` to the `quotation_details` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeadsStatus" AS ENUM ('ASSIGNED', 'UNASSIGNED');

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "status" "LeadsStatus" NOT NULL DEFAULT 'UNASSIGNED';

-- AlterTable
ALTER TABLE "quotation_details" ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "no_of_leads_left" INTEGER NOT NULL;
