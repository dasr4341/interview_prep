/*
  Warnings:

  - The `currency` column on the `subscription_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR');

-- AlterTable
ALTER TABLE "subscription_details" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';
