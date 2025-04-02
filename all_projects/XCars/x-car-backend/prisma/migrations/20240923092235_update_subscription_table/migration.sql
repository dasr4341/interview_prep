/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id]` on the table `subscription_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscription_details_subscription_id_key" ON "subscription_details"("subscription_id");
