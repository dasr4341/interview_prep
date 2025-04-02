/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `payment_record` table. All the data in the column will be lost.
  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_details` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[quotation_id]` on the table `payment_record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quotation_id` to the `payment_record` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "payment_record" DROP CONSTRAINT "payment_record_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_car_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_details" DROP CONSTRAINT "subscription_details_subscription_id_fkey";

-- DropIndex
DROP INDEX "payment_record_subscription_id_key";

-- AlterTable
ALTER TABLE "payment_record" DROP COLUMN "subscription_id",
ADD COLUMN     "quotation_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "subscription";

-- DropTable
DROP TABLE "subscription_details";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "quotation" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" UUID NOT NULL,
    "status" "QuotationStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_details" (
    "id" TEXT NOT NULL,
    "no_of_leads" INTEGER NOT NULL,
    "validity_days" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "status" "QuotationStatus" NOT NULL,
    "quotation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotation_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotation_details_quotation_id_key" ON "quotation_details"("quotation_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_record_quotation_id_key" ON "payment_record"("quotation_id");

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_details" ADD CONSTRAINT "quotation_details_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_record" ADD CONSTRAINT "payment_record_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
