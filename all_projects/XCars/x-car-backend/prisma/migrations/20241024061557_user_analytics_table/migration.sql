-- AlterTable
ALTER TABLE "user_analytics" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
