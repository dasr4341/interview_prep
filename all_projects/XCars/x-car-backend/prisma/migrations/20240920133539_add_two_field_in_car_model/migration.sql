/*
  Warnings:

  - You are about to drop the column `documents` on the `car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car" DROP COLUMN "documents",
ADD COLUMN     "inspection_report" TEXT,
ADD COLUMN     "service_history" TEXT;
