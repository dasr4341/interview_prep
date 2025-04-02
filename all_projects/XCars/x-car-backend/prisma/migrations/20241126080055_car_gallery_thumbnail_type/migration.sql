/*
  Warnings:

  - The `thumbnail` column on the `car_gallery` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "car_gallery" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnail" BOOLEAN NOT NULL DEFAULT false;
