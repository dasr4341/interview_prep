/*
  Warnings:

  - You are about to drop the column `user_id` on the `quotation` table. All the data in the column will be lost.
  - Added the required column `dealer_id` to the `quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quotation" DROP CONSTRAINT "quotation_user_id_fkey";

-- AlterTable
ALTER TABLE "quotation" DROP COLUMN "user_id",
ADD COLUMN     "dealer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
