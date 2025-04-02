/*
  Warnings:

  - You are about to drop the column `carId` on the `car_video` table. All the data in the column will be lost.
  - Made the column `carId` on table `car_documents` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `car_id` to the `car_video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_type` to the `car_video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('SHORT', 'LONG');

-- DropForeignKey
ALTER TABLE "car_documents" DROP CONSTRAINT "car_documents_carId_fkey";

-- DropForeignKey
ALTER TABLE "car_video" DROP CONSTRAINT "car_video_carId_fkey";

-- AlterTable
ALTER TABLE "car_documents" ALTER COLUMN "carId" SET NOT NULL;

-- AlterTable
ALTER TABLE "car_video" DROP COLUMN "carId",
ADD COLUMN     "car_id" UUID NOT NULL,
ADD COLUMN     "free_tier" BOOLEAN DEFAULT false,
ADD COLUMN     "video_type" "VideoType" NOT NULL;

-- AddForeignKey
ALTER TABLE "car_documents" ADD CONSTRAINT "car_documents_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_video" ADD CONSTRAINT "car_video_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
