/*
  Warnings:

  - A unique constraint covering the columns `[desc]` on the table `OtpVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_desc_key" ON "OtpVerification"("desc");
