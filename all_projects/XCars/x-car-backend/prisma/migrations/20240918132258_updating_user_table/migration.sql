/*
  Warnings:

  - You are about to drop the column `is_phone_no_confirmed` on the `user` table. All the data in the column will be lost.
  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'ONBOARDED', 'DISABLED');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_phone_no_confirmed",
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "location" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
