-- AlterTable
ALTER TABLE "invoice_record" ADD COLUMN     "razorpay_payment_id" TEXT;

-- CreateTable
CREATE TABLE "payment_logs" (
    "id" TEXT NOT NULL,
    "quotation_id" TEXT NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_logs_razorpay_order_id_key" ON "payment_logs"("razorpay_order_id");
