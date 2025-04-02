/*
  Warnings:

  - You are about to drop the column `vimeo_video_id` on the `car_gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car_gallery" DROP COLUMN "vimeo_video_id";

-- AlterTable
ALTER TABLE "car_gallery_documents" ADD COLUMN     "vimeo_video_id" TEXT;
