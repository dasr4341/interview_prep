/*
  Warnings:

  - You are about to drop the `EndUserPaymentLogs` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `quotation_id` on table `invoice_record` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- DropForeignKey
ALTER TABLE "invoice_record" DROP CONSTRAINT "invoice_record_quotation_id_fkey";

-- AlterTable
ALTER TABLE "invoice_record" ALTER COLUMN "quotation_id" SET NOT NULL;

-- DropTable
DROP TABLE "EndUserPaymentLogs";

-- CreateTable
CREATE TABLE "end-user-payment-logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "payment_flag" "PaymentType" NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "end-user-payment-logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user-car-based-subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "payment_flags" "PaymentType"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user-car-based-subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "end-user-payment-logs_razorpay_order_id_key" ON "end-user-payment-logs"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "end-user-payment-logs_razorpay_payment_id_key" ON "end-user-payment-logs"("razorpay_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "userId_carId" ON "user-car-based-subscription"("user_id", "car_id");

-- AddForeignKey
ALTER TABLE "invoice_record" ADD CONSTRAINT "invoice_record_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
