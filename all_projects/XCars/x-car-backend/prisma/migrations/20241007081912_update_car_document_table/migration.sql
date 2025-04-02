/*
  Warnings:

  - You are about to drop the column `key` on the `car_documents` table. All the data in the column will be lost.
  - Added the required column `path` to the `car_documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "car_documents" DROP COLUMN "key",
ADD COLUMN     "path" TEXT NOT NULL;
