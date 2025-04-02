/*
  Warnings:

  - You are about to drop the column `documents` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserDocumentType" AS ENUM ('DOCUMENT1', 'DOCUMENT2', 'DOCUMENT3');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "documents";

-- CreateTable
CREATE TABLE "user_documents" (
    "id" TEXT NOT NULL,
    "fileName" "UserDocumentType" NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "user_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
