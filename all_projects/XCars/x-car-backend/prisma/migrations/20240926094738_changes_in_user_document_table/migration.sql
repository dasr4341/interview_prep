/*
  Warnings:

  - You are about to drop the column `key` on the `user_documents` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fileName,userId]` on the table `user_documents` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `fileName` on the `user_documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `userId` on table `user_documents` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "car" DROP CONSTRAINT "car_user_id_fkey";

-- DropForeignKey
ALTER TABLE "quotation" DROP CONSTRAINT "quotation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_documents" DROP CONSTRAINT "user_documents_userId_fkey";

-- AlterTable
ALTER TABLE "user_documents" DROP COLUMN "key",
ADD COLUMN     "keys" TEXT[],
DROP COLUMN "fileName",
ADD COLUMN     "fileName" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "UserDocumentType";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" TEXT,
    "role" "Roles",
    "company_name" TEXT,
    "location" TEXT,
    "phone_number" TEXT,
    "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "is_phone_number_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "fileName_userId" ON "user_documents"("fileName", "userId");

-- AddForeignKey
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
