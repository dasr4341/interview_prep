/*
  Warnings:

  - The values [NORMAL_LEAD] on the enum `LeadType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeadType_new" AS ENUM ('LEAD', 'HOT_LEAD');
ALTER TABLE "leads" ALTER COLUMN "lead_type" TYPE "LeadType_new" USING ("lead_type"::text::"LeadType_new");
ALTER TYPE "LeadType" RENAME TO "LeadType_old";
ALTER TYPE "LeadType_new" RENAME TO "LeadType";
DROP TYPE "LeadType_old";
COMMIT;

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "lead_type" SET DEFAULT 'LEAD';
