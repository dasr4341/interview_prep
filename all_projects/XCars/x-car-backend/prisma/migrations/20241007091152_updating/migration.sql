/*
  Warnings:

  - You are about to drop the `end-user-payment-logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user-car-based-subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "end-user-payment-logs";

-- DropTable
DROP TABLE "user-car-based-subscription";

-- CreateTable
CREATE TABLE "end_user_payment_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "payment_flag" "PaymentType" NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "end_user_payment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_car_based_subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "payment_flags" "PaymentType"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_car_based_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "end_user_payment_logs_razorpay_order_id_key" ON "end_user_payment_logs"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "end_user_payment_logs_razorpay_payment_id_key" ON "end_user_payment_logs"("razorpay_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "userId_carId" ON "user_car_based_subscription"("user_id", "car_id");
