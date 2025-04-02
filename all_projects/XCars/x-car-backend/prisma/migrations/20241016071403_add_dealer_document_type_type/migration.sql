/*
  Warnings:

  - Changed the type of `file_name` on the `user_documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DealerDocumentType" AS ENUM ('AADHAAR_CARD', 'PAN_CARD', 'VOTER_CARD');

-- AlterTable
ALTER TABLE "user_documents" DROP COLUMN "file_name",
ADD COLUMN     "file_name" "DealerDocumentType" NOT NULL;
