/*
  Warnings:

  - Added the required column `file_type` to the `user_documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_documents" ADD COLUMN     "file_type" TEXT NOT NULL;
