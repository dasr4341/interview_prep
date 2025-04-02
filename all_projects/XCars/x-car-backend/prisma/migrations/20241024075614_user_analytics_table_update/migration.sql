-- AlterTable
ALTER TABLE "user_analytics" ADD COLUMN     "admin_id" TEXT;

-- AddForeignKey
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
