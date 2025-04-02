/*
  Warnings:

  - You are about to drop the column `car_document_id` on the `car_document_free_tier` table. All the data in the column will be lost.
  - You are about to drop the column `car_video_id` on the `car_document_free_tier` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `car_documents` table. All the data in the column will be lost.
  - You are about to drop the `car_video` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[car_product_id,user_id]` on the table `car_document_free_tier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_type` to the `car_documents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CarProductType" AS ENUM ('INSPECTION_REPORT', 'SERVICE_HISTORY', 'VIDEO');

-- DropForeignKey
ALTER TABLE "car_document_free_tier" DROP CONSTRAINT "car_document_free_tier_car_document_id_fkey";

-- DropForeignKey
ALTER TABLE "car_document_free_tier" DROP CONSTRAINT "car_document_free_tier_car_video_id_fkey";

-- DropForeignKey
ALTER TABLE "car_video" DROP CONSTRAINT "car_video_car_id_fkey";

-- DropIndex
DROP INDEX "carDocumentId_userId";

-- DropIndex
DROP INDEX "carVideoId_userId";

-- AlterTable
ALTER TABLE "car_document_free_tier" DROP COLUMN "car_document_id",
DROP COLUMN "car_video_id",
ADD COLUMN     "car_product_id" UUID;

-- AlterTable
ALTER TABLE "car_documents" DROP COLUMN "fileName",
ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "file_type" "CarProductType" NOT NULL,
ADD COLUMN     "thumbnail" TEXT;

-- DropTable
DROP TABLE "car_video";

-- DropEnum
DROP TYPE "CarDocumentType";

-- DropEnum
DROP TYPE "VideoType";

-- CreateTable
CREATE TABLE "car_gallery" (
    "id" TEXT NOT NULL,
    "car_id" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carProductId_userId" ON "car_document_free_tier"("car_product_id", "user_id");

-- AddForeignKey
ALTER TABLE "car_gallery" ADD CONSTRAINT "car_gallery_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_document_free_tier" ADD CONSTRAINT "car_document_free_tier_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
