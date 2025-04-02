/*
  Warnings:

  - The `status` column on the `invoice_record` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[razorpay_payment_id]` on the table `invoice_record` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpay_payment_id]` on the table `payment_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "invoice_record" DROP COLUMN "status",
ADD COLUMN     "status" "RazorpayOrderStatus" NOT NULL DEFAULT 'CREATED';

-- CreateIndex
CREATE UNIQUE INDEX "invoice_record_razorpay_payment_id_key" ON "invoice_record"("razorpay_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_logs_razorpay_payment_id_key" ON "payment_logs"("razorpay_payment_id");
