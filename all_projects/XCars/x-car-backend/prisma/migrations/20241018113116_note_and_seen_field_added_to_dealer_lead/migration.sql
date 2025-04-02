-- AlterTable
ALTER TABLE "dealer_leads" ADD COLUMN     "note" TEXT,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;
