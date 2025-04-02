/*
  Warnings:

  - You are about to drop the column `inspection-report-price` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `service-history-price` on the `car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car" DROP COLUMN "inspection-report-price",
DROP COLUMN "service-history-price",
ADD COLUMN     "inspection_report_price" INTEGER,
ADD COLUMN     "service_history_price" INTEGER;
