/*
  Warnings:

  - You are about to drop the column `car_id` on the `end_user_payment_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `end_user_payment_logs` table. All the data in the column will be lost.
  - Added the required column `car_id` to the `end_user_invoice_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `end_user_invoice_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "end_user_invoice_record" ADD COLUMN     "car_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "end_user_payment_logs" DROP COLUMN "car_id",
DROP COLUMN "user_id";
