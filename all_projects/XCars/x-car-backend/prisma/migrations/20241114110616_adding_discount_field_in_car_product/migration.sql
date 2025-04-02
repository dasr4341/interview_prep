/*
  Warnings:

  - Added the required column `discounted_amount` to the `car_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "car_product" ADD COLUMN     "discounted_amount" INTEGER NOT NULL;
