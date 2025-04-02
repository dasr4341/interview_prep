/*
  Warnings:

  - You are about to drop the column `page_url` on the `user_analytics` table. All the data in the column will be lost.
  - Added the required column `operation` to the `user_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_analytics" DROP COLUMN "page_url",
ADD COLUMN     "operation" TEXT NOT NULL;
