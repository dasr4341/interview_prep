/*
  Warnings:

  - You are about to drop the column `videoSeen` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `free_tier` on the `car_video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "car_document_free_tier" DROP CONSTRAINT "car_document_free_tier_car_document_id_fkey";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "videoSeen";

-- AlterTable
ALTER TABLE "car_document_free_tier" ADD COLUMN     "carDocumentsId" UUID,
ADD COLUMN     "car_video_id" UUID,
ALTER COLUMN "car_document_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "car_video" DROP COLUMN "free_tier";
