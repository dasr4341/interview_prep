-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
