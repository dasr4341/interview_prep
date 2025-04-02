-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_admin_id_fkey";

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
