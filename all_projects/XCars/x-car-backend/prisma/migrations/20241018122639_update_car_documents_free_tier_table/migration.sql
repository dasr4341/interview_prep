/*
  Warnings:

  - A unique constraint covering the columns `[car_video_id,user_id]` on the table `car_document_free_tier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "carVideoId_userId" ON "car_document_free_tier"("car_video_id", "user_id");
