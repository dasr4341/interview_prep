/*
  Warnings:

  - Added the required column `car_id` to the `end_user_payment_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `end_user_payment_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "end_user_payment_logs" ADD COLUMN     "car_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;
