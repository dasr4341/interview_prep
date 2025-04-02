/*
  Warnings:

  - You are about to drop the column `contactDataId` on the `contact_message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "contact_message" DROP CONSTRAINT "contact_message_contactDataId_fkey";

-- AlterTable
ALTER TABLE "contact_message" DROP COLUMN "contactDataId",
ADD COLUMN     "contact_data_id" TEXT;

-- AddForeignKey
ALTER TABLE "contact_message" ADD CONSTRAINT "contact_message_contact_data_id_fkey" FOREIGN KEY ("contact_data_id") REFERENCES "contact_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
