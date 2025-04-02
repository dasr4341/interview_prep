/*
  Warnings:

  - You are about to drop the `OtpVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OtpVerification";

-- CreateTable
CREATE TABLE "otp_verification" (
    "id" TEXT NOT NULL,
    "mode" "Mode" NOT NULL,
    "desc" TEXT NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "otp_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_verification_desc_key" ON "otp_verification"("desc");
