-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('VIDEO_INSPECTION_REPORT', 'SERVICE_HISTORY', 'ALL');

-- DropForeignKey
ALTER TABLE "invoice_record" DROP CONSTRAINT "invoice_record_quotation_id_fkey";

-- AlterTable
ALTER TABLE "car" ADD COLUMN     "inspection-report-price" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "inspection-report-seen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "service-history-price" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "service-history-seen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoSeen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "video_price" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "car_documents" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "invoice_record" ALTER COLUMN "quotation_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "end_user_invoice_record" (
    "id" TEXT NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "status" "RazorpayOrderStatus" NOT NULL DEFAULT 'CREATED',
    "amount" INTEGER NOT NULL,
    "amount_paid" INTEGER NOT NULL,
    "amount_due" INTEGER NOT NULL,
    "receipt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "end_user_invoice_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUserPaymentLogs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "payment_flags" "PaymentType"[],
    "payment_id" TEXT NOT NULL,

    CONSTRAINT "EndUserPaymentLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "end_user_invoice_record_razorpay_order_id_key" ON "end_user_invoice_record"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "end_user_invoice_record_razorpay_payment_id_key" ON "end_user_invoice_record"("razorpay_payment_id");

-- AddForeignKey
ALTER TABLE "invoice_record" ADD CONSTRAINT "invoice_record_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
