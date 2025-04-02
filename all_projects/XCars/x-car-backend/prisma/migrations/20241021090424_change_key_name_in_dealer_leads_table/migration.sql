/*
  Warnings:

  - You are about to drop the column `dealerId` on the `dealer_leads` table. All the data in the column will be lost.
  - You are about to drop the column `leadId` on the `dealer_leads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lead_id]` on the table `dealer_leads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dealer_id` to the `dealer_leads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_id` to the `dealer_leads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dealer_leads" DROP CONSTRAINT "dealer_leads_leadId_fkey";

-- DropIndex
DROP INDEX "dealer_leads_leadId_key";

-- AlterTable
ALTER TABLE "dealer_leads" DROP COLUMN "dealerId",
DROP COLUMN "leadId",
ADD COLUMN     "dealer_id" TEXT NOT NULL,
ADD COLUMN     "lead_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dealer_leads_lead_id_key" ON "dealer_leads"("lead_id");

-- AddForeignKey
ALTER TABLE "dealer_leads" ADD CONSTRAINT "dealer_leads_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
