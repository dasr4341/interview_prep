/*
  Warnings:

  - Added the required column `dealerId` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "dealerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "dealer_leads" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealer_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dealer_leads_dealerId_key" ON "dealer_leads"("dealerId");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealer_leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
