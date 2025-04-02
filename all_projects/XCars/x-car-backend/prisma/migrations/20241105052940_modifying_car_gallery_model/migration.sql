/*
  Warnings:

  - You are about to drop the column `vimeoVideoId` on the `car_gallery` table. All the data in the column will be lost.
  - Made the column `file_type` on table `car_gallery` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "car_gallery" DROP COLUMN "vimeoVideoId",
ADD COLUMN     "vimeo_video_id" TEXT,
ALTER COLUMN "file_type" SET NOT NULL;
