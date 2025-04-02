/*
  Warnings:

  - You are about to drop the column `document_type` on the `car_products` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `car_products` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `car_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "car_products" DROP COLUMN "document_type",
DROP COLUMN "file_name",
DROP COLUMN "path";

-- CreateTable
CREATE TABLE "car_product_documents" (
    "id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "car_product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_product_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car_product_documents" ADD CONSTRAINT "car_product_documents_car_product_id_fkey" FOREIGN KEY ("car_product_id") REFERENCES "car_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
