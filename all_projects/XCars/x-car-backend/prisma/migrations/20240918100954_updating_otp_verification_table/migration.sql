/*
  Warnings:

  - Added the required column `desc` to the `OtpVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "desc" TEXT NOT NULL;
