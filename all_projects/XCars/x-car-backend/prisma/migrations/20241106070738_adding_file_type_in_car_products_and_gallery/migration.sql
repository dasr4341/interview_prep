/*
  Warnings:

  - Added the required column `file_type` to the `car_gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_type` to the `car_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "car_gallery" ADD COLUMN     "file_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "car_products" ADD COLUMN     "file_type" TEXT NOT NULL;
