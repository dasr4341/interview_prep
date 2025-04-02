/*
  Warnings:

  - You are about to drop the column `message` on the `contact_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,car_id]` on the table `contact_data` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "contact_data" DROP COLUMN "message";

-- CreateTable
CREATE TABLE "contact_message" (
    "id" TEXT NOT NULL,
    "contactDataId" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userId_carId" ON "contact_data"("user_id", "car_id");

-- AddForeignKey
ALTER TABLE "contact_message" ADD CONSTRAINT "contact_message_contactDataId_fkey" FOREIGN KEY ("contactDataId") REFERENCES "contact_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
