/*
  Warnings:

  - You are about to drop the column `bundleId` on the `car_product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "car_product" DROP CONSTRAINT "car_product_bundleId_fkey";

-- AlterTable
ALTER TABLE "car_product" DROP COLUMN "bundleId";

-- CreateTable
CREATE TABLE "bundle_items" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bundle_items_bundleId_productId_key" ON "bundle_items"("bundleId", "productId");

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "car_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "car_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
