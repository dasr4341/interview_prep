/*
  Warnings:

  - A unique constraint covering the columns `[razorpay_order_id]` on the table `invoice_record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `invoice_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_due` to the `invoice_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_paid` to the `invoice_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_record" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "amount_due" INTEGER NOT NULL,
ADD COLUMN     "amount_paid" INTEGER NOT NULL,
ADD COLUMN     "receipt" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "invoice_record_razorpay_order_id_key" ON "invoice_record"("razorpay_order_id");
