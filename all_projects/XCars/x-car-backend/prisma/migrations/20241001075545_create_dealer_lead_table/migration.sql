-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_dealerId_fkey";

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "dealerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealer_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
