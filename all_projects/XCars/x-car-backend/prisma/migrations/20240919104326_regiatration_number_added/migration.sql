/*
  Warnings:

  - You are about to drop the column `fuelType` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `launchYear` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `noOfOwners` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `totalRun` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `car` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registration_number]` on the table `car` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fuel_type` to the `car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `launch_year` to the `car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_owners` to the `car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_number` to the `car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_run` to the `car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FuelType" ADD VALUE 'ELECTRIC';
ALTER TYPE "FuelType" ADD VALUE 'HYBRID';

-- DropForeignKey
ALTER TABLE "car" DROP CONSTRAINT "car_userId_fkey";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "fuelType",
DROP COLUMN "launchYear",
DROP COLUMN "noOfOwners",
DROP COLUMN "totalRun",
DROP COLUMN "userId",
ADD COLUMN     "fuel_type" "FuelType" NOT NULL,
ADD COLUMN     "launch_year" INTEGER NOT NULL,
ADD COLUMN     "no_of_owners" INTEGER NOT NULL,
ADD COLUMN     "registration_number" TEXT NOT NULL,
ADD COLUMN     "total_run" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "car_registration_number_key" ON "car"("registration_number");

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
