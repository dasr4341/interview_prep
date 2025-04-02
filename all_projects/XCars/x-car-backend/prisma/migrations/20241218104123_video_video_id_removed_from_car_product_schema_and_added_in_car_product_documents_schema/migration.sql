/*
  Warnings:

  - You are about to drop the column `vimeoVideoId` on the `car_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car_product" DROP COLUMN "vimeoVideoId";

-- AlterTable
ALTER TABLE "car_product_documents" ADD COLUMN     "videoVimeoId" TEXT;
