/*
  Warnings:

  - You are about to drop the column `document_type` on the `car_gallery` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `car_gallery` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `car_gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car_gallery" DROP COLUMN "document_type",
DROP COLUMN "file_name",
DROP COLUMN "path";
