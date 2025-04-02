/*
  Warnings:

  - You are about to drop the `bundle_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_bundles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'BUNDLE');

-- DropForeignKey
ALTER TABLE "bundle_items" DROP CONSTRAINT "bundle_items_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_items" DROP CONSTRAINT "bundle_items_car_product_id_fkey";

-- DropForeignKey
ALTER TABLE "car_product_documents" DROP CONSTRAINT "car_product_documents_car_product_id_fkey";

-- DropForeignKey
ALTER TABLE "car_products" DROP CONSTRAINT "car_products_carId_fkey";

-- DropForeignKey
ALTER TABLE "product_bundles" DROP CONSTRAINT "product_bundles_car_id_fkey";

-- DropForeignKey
ALTER TABLE "products_purchased" DROP CONSTRAINT "products_purchased_car_product_id_fkey";

-- DropTable
DROP TABLE "bundle_items";

-- DropTable
DROP TABLE "car_products";

-- DropTable
DROP TABLE "product_bundles";

-- CreateTable
CREATE TABLE "car_product" (
    "id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "productType" "ProductType" NOT NULL DEFAULT 'PRODUCT',
    "thumbnail" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "carId" UUID NOT NULL,
    "vimeoVideoId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bundleId" TEXT,

    CONSTRAINT "car_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car_product" ADD CONSTRAINT "car_product_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_product" ADD CONSTRAINT "car_product_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "car_product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_product_documents" ADD CONSTRAINT "car_product_documents_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_purchased" ADD CONSTRAINT "products_purchased_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
