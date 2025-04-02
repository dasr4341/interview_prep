/*
  Warnings:

  - You are about to drop the column `dealerId` on the `leads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leadId]` on the table `dealer_leads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `leadId` to the `dealer_leads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_dealerId_fkey";

-- AlterTable
ALTER TABLE "dealer_leads" ADD COLUMN     "leadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "dealerId";

-- CreateIndex
CREATE UNIQUE INDEX "dealer_leads_leadId_key" ON "dealer_leads"("leadId");

-- AddForeignKey
ALTER TABLE "dealer_leads" ADD CONSTRAINT "dealer_leads_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
