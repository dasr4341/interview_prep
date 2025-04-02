/*
  Warnings:

  - You are about to drop the `UserAnalytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserAnalytics";

-- CreateTable
CREATE TABLE "user_analytics" (
    "id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_analytics_pkey" PRIMARY KEY ("id")
);
