/*
  Warnings:

  - You are about to drop the `car_document_free_tier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "car_document_free_tier" DROP CONSTRAINT "car_document_free_tier_car_product_id_fkey";

-- DropForeignKey
ALTER TABLE "car_documents" DROP CONSTRAINT "car_documents_carId_fkey";

-- DropTable
DROP TABLE "car_document_free_tier";

-- DropTable
DROP TABLE "car_documents";

-- CreateTable
CREATE TABLE "car_products" (
    "id" UUID NOT NULL,
    "file_type" "CarProductType" NOT NULL,
    "file_name" TEXT,
    "path" TEXT NOT NULL,
    "thumbnail" TEXT,
    "carId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_purchased" (
    "id" TEXT NOT NULL,
    "car_product_id" UUID,
    "user_id" TEXT,
    "car_id" TEXT NOT NULL,
    "free_tier" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_purchased_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carProductId_userId" ON "products_purchased"("car_product_id", "user_id");

-- AddForeignKey
ALTER TABLE "car_products" ADD CONSTRAINT "car_products_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_purchased" ADD CONSTRAINT "products_purchased_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
