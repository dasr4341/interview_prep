/*
  Warnings:

  - You are about to drop the column `video_links` on the `car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car" DROP COLUMN "video_links";

-- CreateTable
CREATE TABLE "car_video" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "carId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_video_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car_video" ADD CONSTRAINT "car_video_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
