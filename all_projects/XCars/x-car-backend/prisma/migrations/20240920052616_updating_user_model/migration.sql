/*
  Warnings:

  - Made the column `is_email_confirmed` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_phone_number_confirmed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_email_confirmed" SET NOT NULL;
