-- AddForeignKey
ALTER TABLE "dealer_analytics" ADD CONSTRAINT "dealer_analytics_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealer_analytics" ADD CONSTRAINT "dealer_analytics_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
