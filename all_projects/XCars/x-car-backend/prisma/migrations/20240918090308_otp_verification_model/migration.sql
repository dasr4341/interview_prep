/*
  Warnings:

  - You are about to drop the `Registration` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('EMAIL', 'PHONE_NUMBER');

-- DropTable
DROP TABLE "Registration";

-- CreateTable
CREATE TABLE "registration" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "is_email_confirmed" BOOLEAN DEFAULT false,
    "is_phone_no_confirmed" BOOLEAN DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" TEXT NOT NULL,
    "mode" "Mode" NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registration_email_key" ON "registration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "registration_phone_number_key" ON "registration"("phone_number");
