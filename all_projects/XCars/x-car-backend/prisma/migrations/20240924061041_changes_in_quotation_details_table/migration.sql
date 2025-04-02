/*
  Warnings:

  - The `status` column on the `car` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('PENDING', 'APPROVED', 'DISABLED');

-- AlterTable
ALTER TABLE "car" DROP COLUMN "status",
ADD COLUMN     "status" "CarStatus" NOT NULL DEFAULT 'PENDING';
