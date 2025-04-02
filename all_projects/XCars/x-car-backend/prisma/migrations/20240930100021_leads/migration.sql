/*
  Warnings:

  - You are about to drop the column `contact_details` on the `contact_data` table. All the data in the column will be lost.
  - Added the required column `car_id` to the `contact_data` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('NORMAL_LEAD', 'HOT_LEAD');

-- AlterTable
ALTER TABLE "contact_data" DROP COLUMN "contact_details",
ADD COLUMN     "alternate_email" TEXT,
ADD COLUMN     "alternate_phone" TEXT,
ADD COLUMN     "car_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "car_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_id" TEXT,
    "lead_type" "LeadType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carId_userId" ON "leads"("car_id", "user_id");

-- AddForeignKey
ALTER TABLE "contact_data" ADD CONSTRAINT "contact_data_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contact_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
