/*
  Warnings:

  - You are about to drop the column `bundle_name` on the `product_bundles` table. All the data in the column will be lost.
  - Added the required column `name` to the `product_bundles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_bundles" DROP COLUMN "bundle_name",
ADD COLUMN     "name" TEXT NOT NULL;
