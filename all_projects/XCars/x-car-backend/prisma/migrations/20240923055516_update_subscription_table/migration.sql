/*
  Warnings:

  - Added the required column `admin_id` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "admin_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
