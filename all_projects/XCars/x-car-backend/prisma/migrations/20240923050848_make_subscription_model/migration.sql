/*
  Warnings:

  - Added the required column `status` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED');

-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "status" "Status" NOT NULL;

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_details" (
    "id" TEXT NOT NULL,
    "no_of_leads" INTEGER NOT NULL,
    "validity_days" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "subscription_status" "SubscriptionStatus" NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_record" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,

    CONSTRAINT "payment_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_record_subscription_id_key" ON "payment_record"("subscription_id");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_details" ADD CONSTRAINT "subscription_details_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_record" ADD CONSTRAINT "payment_record_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
