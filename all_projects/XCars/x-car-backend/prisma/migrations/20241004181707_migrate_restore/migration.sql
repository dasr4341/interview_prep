/*
  Warnings:

  - You are about to drop the column `fileName` on the `user_documents` table. All the data in the column will be lost.
  - You are about to drop the column `keys` on the `user_documents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user_documents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "fileName_userId";

-- AlterTable
ALTER TABLE "user_documents" DROP COLUMN "fileName",
DROP COLUMN "keys",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userDocumentsId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_documents_userId_key" ON "user_documents"("userId");

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_userDocumentsId_fkey" FOREIGN KEY ("userDocumentsId") REFERENCES "user_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
