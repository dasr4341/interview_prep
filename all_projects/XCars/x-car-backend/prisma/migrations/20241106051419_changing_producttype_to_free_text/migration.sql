/*
  Warnings:

  - You are about to drop the column `inspection_report_price` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `service_history_price` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `video_price` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `file_type` on the `car_gallery` table. All the data in the column will be lost.
  - The primary key for the `car_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file_type` on the `car_products` table. All the data in the column will be lost.
  - You are about to drop the column `payment_flag` on the `end_user_invoice_record` table. All the data in the column will be lost.
  - You are about to drop the column `payment_flags` on the `product_bundles` table. All the data in the column will be lost.
  - Added the required column `document_type` to the `car_gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `car_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `car_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bundle_name` to the `product_bundles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DOCUMENT', 'IMAGE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "products_purchased" DROP CONSTRAINT "products_purchased_car_product_id_fkey";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "inspection_report_price",
DROP COLUMN "service_history_price",
DROP COLUMN "video_price";

-- AlterTable
ALTER TABLE "car_gallery" DROP COLUMN "file_type",
ADD COLUMN     "document_type" "DocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "car_products" DROP CONSTRAINT "car_products_pkey",
DROP COLUMN "file_type",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "document_type" "DocumentType" NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "car_products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "end_user_invoice_record" DROP COLUMN "payment_flag",
ADD COLUMN     "products_purchased" TEXT[];

-- AlterTable
ALTER TABLE "product_bundles" DROP COLUMN "payment_flags",
ADD COLUMN     "bundle_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products_purchased" ALTER COLUMN "car_product_id" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "CarProductType";

-- CreateTable
CREATE TABLE "bundle_items" (
    "id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "car_product_id" TEXT NOT NULL,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products_purchased" ADD CONSTRAINT "products_purchased_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "product_bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
