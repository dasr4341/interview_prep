/*
  Warnings:

  - You are about to drop the `payment_record` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment_record" DROP CONSTRAINT "payment_record_quotation_id_fkey";

-- DropTable
DROP TABLE "payment_record";

-- CreateTable
CREATE TABLE "invoice_record" (
    "id" TEXT NOT NULL,
    "quotation_id" TEXT NOT NULL,

    CONSTRAINT "invoice_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_record_quotation_id_key" ON "invoice_record"("quotation_id");

-- AddForeignKey
ALTER TABLE "invoice_record" ADD CONSTRAINT "invoice_record_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
