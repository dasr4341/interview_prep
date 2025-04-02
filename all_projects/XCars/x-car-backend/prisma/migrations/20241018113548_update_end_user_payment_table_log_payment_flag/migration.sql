/*
  Warnings:

  - You are about to drop the column `payment_flag` on the `end_user_payment_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "end_user_invoice_record" ADD COLUMN     "payment_flag" "PaymentType"[];

-- AlterTable
ALTER TABLE "end_user_payment_logs" DROP COLUMN "payment_flag";
