/*
  Warnings:

  - Added the required column `dealer_lead_id` to the `dealer_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dealer_analytics" ADD COLUMN     "dealer_lead_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "dealer_analytics" ADD CONSTRAINT "dealer_analytics_dealer_lead_id_fkey" FOREIGN KEY ("dealer_lead_id") REFERENCES "dealer_leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
