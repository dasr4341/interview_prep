/*
  Warnings:

  - You are about to drop the column `inspection-report-seen` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `service-history-seen` on the `car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car" DROP COLUMN "inspection-report-seen",
DROP COLUMN "service-history-seen",
ALTER COLUMN "inspection-report-price" DROP NOT NULL,
ALTER COLUMN "inspection-report-price" DROP DEFAULT,
ALTER COLUMN "service-history-price" DROP NOT NULL,
ALTER COLUMN "service-history-price" DROP DEFAULT,
ALTER COLUMN "video_price" DROP NOT NULL,
ALTER COLUMN "video_price" DROP DEFAULT;
