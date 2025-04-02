/*
  Warnings:

  - You are about to drop the column `free_tier` on the `car_documents` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `contact_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "car_documents" DROP COLUMN "free_tier";

-- AlterTable
ALTER TABLE "contact_data" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "car_document_free_tier" (
    "id" TEXT NOT NULL,
    "car_document_id" UUID NOT NULL,
    "user_id" TEXT,
    "car_id" TEXT NOT NULL,
    "free_tier" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_document_free_tier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carDocumentId_userId" ON "car_document_free_tier"("car_document_id", "user_id");

-- AddForeignKey
ALTER TABLE "car_document_free_tier" ADD CONSTRAINT "car_document_free_tier_car_document_id_fkey" FOREIGN KEY ("car_document_id") REFERENCES "car_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
