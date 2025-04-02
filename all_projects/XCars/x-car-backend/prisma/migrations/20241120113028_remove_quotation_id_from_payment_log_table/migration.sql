/*
  Warnings:

  - You are about to drop the column `quotation_id` on the `payment_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_logs" DROP COLUMN "quotation_id";
