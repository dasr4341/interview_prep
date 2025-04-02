/*
  Warnings:

  - You are about to drop the `uploaded_files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "uploaded_files" DROP CONSTRAINT "uploaded_files_userDocumentsId_fkey";

-- DropIndex
DROP INDEX "user_documents_userId_key";

-- AlterTable
ALTER TABLE "user_documents" ADD COLUMN     "file_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "uploaded_files";
