/*
  Warnings:

  - You are about to drop the `Car` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('AUTOMATIC', 'MANUAL');

-- DropTable
DROP TABLE "Car";

-- CreateTable
CREATE TABLE "car" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "launchYear" INTEGER NOT NULL,
    "totalRun" INTEGER NOT NULL,
    "noOfOwners" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "fuelType" "FuelType" NOT NULL,
    "transmission" "TransmissionType" NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
