/*
  Warnings:

  - A unique constraint covering the columns `[quotation_id]` on the table `invoice_record` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invoice_record_quotation_id_key" ON "invoice_record"("quotation_id");
