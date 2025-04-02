-- DropForeignKey
ALTER TABLE "quotation" DROP CONSTRAINT "quotation_admin_id_fkey";

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
